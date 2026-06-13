import {
  collection,
  deleteDoc,
  doc,
  getDocs,
  setDoc,
  writeBatch,
} from 'firebase/firestore'
import { db } from '../firebase/firebase'
import { cleanObject } from './firestoreUtils.js'

function asArray(value) {
  return Array.isArray(value) ? value : []
}

function asMapById(items) {
  const map = new Map()
  for (const item of asArray(items)) {
    if (!item || typeof item !== 'object') continue
    const id = String(item.id || '').trim()
    if (!id) continue
    map.set(id, item)
  }
  return map
}

async function deleteDocsNotInCollection(collectionName, keepIds) {
  const ref = collection(db, collectionName)
  const snapshot = await getDocs(ref)
  const batch = writeBatch(db)
  let count = 0

  snapshot.forEach((d) => {
    if (!keepIds.has(d.id)) {
      batch.delete(d.ref)
      count += 1
    }
  })

  if (count) await batch.commit()
}

async function upsertDocsById(collectionName, items) {
  const byId = asMapById(items)
  const batch = writeBatch(db)
  let count = 0

  for (const [id, raw] of byId.entries()) {
    const payload = cleanObject(raw)
    const { id: _ignored, ...data } = payload
    batch.set(doc(db, collectionName, id), data, { merge: true })
    count += 1
  }

  if (count) await batch.commit()
  return byId
}

async function replaceSkillsGroups(groups) {
  const groupById = asMapById(groups)

  // Delete groups not present (and their items)
  const groupsSnapshot = await getDocs(collection(db, 'skills_groups'))
  await Promise.all(
    groupsSnapshot.docs.map(async (g) => {
      if (groupById.has(g.id)) return
      const itemsSnapshot = await getDocs(collection(db, 'skills_groups', g.id, 'items'))
      await Promise.all(itemsSnapshot.docs.map((d) => deleteDoc(d.ref)))
      await deleteDoc(g.ref)
    })
  )

  // Upsert groups and replace items per group
  for (const [groupId, rawGroup] of groupById.entries()) {
    const groupPayload = cleanObject(rawGroup)
    const { id: _ignored, items: rawItems, ...groupData } = groupPayload
    await setDoc(doc(db, 'skills_groups', groupId), groupData, { merge: true })

    const itemById = asMapById(asArray(rawItems))

    const existingItemsSnapshot = await getDocs(collection(db, 'skills_groups', groupId, 'items'))
    await Promise.all(
      existingItemsSnapshot.docs.map((d) => {
        if (itemById.has(d.id)) return null
        return deleteDoc(d.ref)
      })
    )

    const itemBatch = writeBatch(db)
    let itemCount = 0
    for (const [itemId, rawItem] of itemById.entries()) {
      const itemPayload = cleanObject(rawItem)
      const { id: _ignoredItem, ...itemData } = itemPayload
      itemBatch.set(doc(db, 'skills_groups', groupId, 'items', itemId), itemData, { merge: true })
      itemCount += 1
    }
    if (itemCount) await itemBatch.commit()
  }
}

export async function replacePortfolioInFirestore(portfolio) {
  const data = cleanObject(portfolio)

  const projects = asArray(data.projects)
  const services = asArray(data.services)
  const achievements = asArray(data.achievements)
  const certificates = asArray(data.certificates)
  const timeline = asArray(data.timeline)

  const about = cleanObject(data.about)
  const contact = cleanObject(data.contact)
  const resume = cleanObject(data.resume)
  const meta = cleanObject(data.meta)

  // Collections (replace by id)
  const projectsById = await upsertDocsById('projects', projects)
  await deleteDocsNotInCollection('projects', new Set(projectsById.keys()))

  const servicesById = await upsertDocsById('services', services)
  await deleteDocsNotInCollection('services', new Set(servicesById.keys()))

  const achievementsById = await upsertDocsById('achievements', achievements)
  await deleteDocsNotInCollection('achievements', new Set(achievementsById.keys()))

  const certificatesById = await upsertDocsById('certificates', certificates)
  await deleteDocsNotInCollection('certificates', new Set(certificatesById.keys()))

  const timelineById = await upsertDocsById('timeline', timeline)
  await deleteDocsNotInCollection('timeline', new Set(timelineById.keys()))

  // Skills groups + items
  await replaceSkillsGroups(data.skills?.groups)

  // Singleton docs
  await setDoc(doc(db, 'about', 'main'), about, { merge: true })
  await setDoc(doc(db, 'contact', 'main'), contact, { merge: true })
  await setDoc(doc(db, 'resume', 'main'), resume, { merge: true })

  // Meta is optional; keep lastUpdated if present
  await setDoc(doc(db, 'meta', 'main'), meta, { merge: true })

  return true
}