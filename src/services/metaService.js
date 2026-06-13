import { doc, getDoc, setDoc } from 'firebase/firestore'
import { db } from '../firebase/firebase'
import { cleanString } from './firestoreUtils.js'

const metaRef = doc(db, 'meta', 'main')

export async function fetchMeta() {
  try {
    const snapshot = await getDoc(metaRef)
    if (!snapshot.exists()) {
      return { lastUpdated: '', createdAt: '', updatedAt: '' }
    }

    const data = snapshot.data() || {}
    return {
      lastUpdated: cleanString(data.lastUpdated),
      createdAt: cleanString(data.createdAt),
      updatedAt: cleanString(data.updatedAt),
    }
  } catch (error) {
    throw new Error(error?.message || 'Failed to fetch meta document')
  }
}

export async function updateMeta(meta) {
  try {
    const snapshot = await getDoc(metaRef)
    const current = snapshot.exists() ? snapshot.data() || {} : {}
    const now = new Date().toISOString()
    const payload = {
      lastUpdated: cleanString(meta.lastUpdated) || now,
      createdAt: cleanString(current.createdAt) || now,
      updatedAt: now,
    }

    await setDoc(metaRef, payload, { merge: true })
    return payload
  } catch (error) {
    throw new Error(error?.message || 'Failed to update meta document')
  }
}
