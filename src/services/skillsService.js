import {
  collection,
  getDocs,
  addDoc,
  updateDoc,
  deleteDoc,
  doc,
} from 'firebase/firestore'
import { db } from '../firebase/firebase'
import {
  cleanNumber,
  cleanString,
  sortByLatest,
  withTimestamps,
  toIsoString,
} from './firestoreUtils.js'

const groupsRef = collection(db, 'skills_groups')

function skillsItemsRef(groupId) {
  return collection(db, 'skills_groups', String(groupId), 'items')
}

function mapSkillItem(snapshot) {
  const data = snapshot.data() || {}
  return {
    id: snapshot.id,
    name: cleanString(data.name),
    level: cleanNumber(data.level, 0, 0, 100),
    iconKey: cleanString(data.iconKey || 'code2') || 'code2',
    createdAt: toIsoString(data.createdAt),
    updatedAt: toIsoString(data.updatedAt),
  }
}

function mapSkillGroup(snapshot, items = []) {
  const data = snapshot.data() || {}
  return {
    id: snapshot.id,
    title: cleanString(data.title),
    groupIconKey: cleanString(data.groupIconKey || 'react') || 'react',
    items,
    createdAt: toIsoString(data.createdAt),
    updatedAt: toIsoString(data.updatedAt),
  }
}

function buildSkillGroupPayload(group) {
  return withTimestamps(
    {
      title: cleanString(group.title),
      groupIconKey: cleanString(group.groupIconKey || 'react') || 'react',
    },
    group
  )
}

function buildSkillItemPayload(skill) {
  return withTimestamps(
    {
      name: cleanString(skill.name),
      level: cleanNumber(skill.level, 0, 0, 100),
      iconKey: cleanString(skill.iconKey || 'code2') || 'code2',
    },
    skill
  )
}

export async function fetchSkillGroups() {
  try {
    const snapshot = await getDocs(groupsRef)
    const groups = await Promise.all(
      snapshot.docs.map(async (groupSnapshot) => {
        const itemsSnapshot = await getDocs(skillsItemsRef(groupSnapshot.id))
        const items = sortByLatest(itemsSnapshot.docs.map(mapSkillItem))
        return mapSkillGroup(groupSnapshot, items)
      })
    )

    return sortByLatest(groups)
  } catch (error) {
    throw new Error(error?.message || 'Failed to fetch skill groups')
  }
}

export async function addSkillGroup(group) {
  try {
    const payload = buildSkillGroupPayload(group)
    const ref = await addDoc(groupsRef, payload)
    return { id: ref.id, ...payload, items: [] }
  } catch (error) {
    throw new Error(error?.message || 'Failed to add skill group')
  }
}

export async function updateSkillGroup(groupId, group) {
  try {
    const payload = buildSkillGroupPayload(group)
    await updateDoc(doc(db, 'skills_groups', String(groupId)), payload)
    return { id: String(groupId), ...payload, items: Array.isArray(group.items) ? group.items : [] }
  } catch (error) {
    throw new Error(error?.message || 'Failed to update skill group')
  }
}

export async function deleteSkillGroup(groupId) {
  try {
    const groupIdString = String(groupId)
    const itemsSnapshot = await getDocs(skillsItemsRef(groupIdString))
    await Promise.all(itemsSnapshot.docs.map((itemSnapshot) => deleteDoc(itemSnapshot.ref)))
    await deleteDoc(doc(db, 'skills_groups', groupIdString))
    return { id: groupIdString }
  } catch (error) {
    throw new Error(error?.message || 'Failed to delete skill group')
  }
}

export async function addSkill(groupId, skill) {
  try {
    const payload = buildSkillItemPayload(skill)
    const ref = await addDoc(skillsItemsRef(groupId), payload)
    return { groupId: String(groupId), skill: { id: ref.id, ...payload } }
  } catch (error) {
    throw new Error(error?.message || 'Failed to add skill')
  }
}

export async function updateSkill(groupId, skillId, skill) {
  try {
    const payload = buildSkillItemPayload(skill)
    await updateDoc(doc(db, 'skills_groups', String(groupId), 'items', String(skillId)), payload)
    return { groupId: String(groupId), skill: { id: String(skillId), ...payload } }
  } catch (error) {
    throw new Error(error?.message || 'Failed to update skill')
  }
}

export async function deleteSkill(groupId, skillId) {
  try {
    await deleteDoc(doc(db, 'skills_groups', String(groupId), 'items', String(skillId)))
    return { groupId: String(groupId), skillId: String(skillId) }
  } catch (error) {
    throw new Error(error?.message || 'Failed to delete skill')
  }
}
