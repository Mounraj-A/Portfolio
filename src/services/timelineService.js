import {
  collection,
  getDocs,
  addDoc,
  updateDoc,
  deleteDoc,
  doc,
} from 'firebase/firestore'
import { db } from '../firebase/firebase'
import { cleanString, sortByLatest, withTimestamps, toIsoString } from './firestoreUtils.js'

const timelineRef = collection(db, 'timeline')

function mapTimeline(snapshot) {
  const data = snapshot.data() || {}
  return {
    id: snapshot.id,
    year: cleanString(data.year),
    title: cleanString(data.title),
    desc: cleanString(data.desc || data.description),
    createdAt: toIsoString(data.createdAt),
    updatedAt: toIsoString(data.updatedAt),
  }
}

function buildTimelinePayload(item) {
  return withTimestamps(
    {
      year: cleanString(item.year),
      title: cleanString(item.title),
      desc: cleanString(item.desc || item.description),
    },
    item
  )
}

export async function fetchTimeline() {
  try {
    const snapshot = await getDocs(timelineRef)
    return sortByLatest(snapshot.docs.map(mapTimeline))
  } catch (error) {
    throw new Error(error?.message || 'Failed to fetch timeline')
  }
}

export async function addTimeline(item) {
  try {
    const payload = buildTimelinePayload(item)
    const ref = await addDoc(timelineRef, payload)
    return { id: ref.id, ...payload }
  } catch (error) {
    throw new Error(error?.message || 'Failed to add timeline item')
  }
}

export async function updateTimeline(itemId, item) {
  try {
    const payload = buildTimelinePayload(item)
    await updateDoc(doc(db, 'timeline', String(itemId)), payload)
    return { id: String(itemId), ...payload }
  } catch (error) {
    throw new Error(error?.message || 'Failed to update timeline item')
  }
}

export async function deleteTimeline(itemId) {
  try {
    await deleteDoc(doc(db, 'timeline', String(itemId)))
    return { id: String(itemId) }
  } catch (error) {
    throw new Error(error?.message || 'Failed to delete timeline item')
  }
}
