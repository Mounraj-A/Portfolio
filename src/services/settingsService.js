import { doc, getDoc, setDoc } from 'firebase/firestore'
import { db } from '../firebase/firebase'
import { cleanString } from './firestoreUtils.js'

const settingsRef = doc(db, 'settings', 'main')

export async function fetchSettings() {
  try {
    const snapshot = await getDoc(settingsRef)
    if (!snapshot.exists()) {
      return { adminPassword: '', createdAt: '', updatedAt: '' }
    }

    const data = snapshot.data() || {}
    return {
      adminPassword: cleanString(data.adminPassword),
      createdAt: cleanString(data.createdAt),
      updatedAt: cleanString(data.updatedAt),
    }
  } catch (error) {
    throw new Error(error?.message || 'Failed to fetch settings')
  }
}

export async function updateSettings(partial) {
  try {
    const snapshot = await getDoc(settingsRef)
    const current = snapshot.exists() ? snapshot.data() || {} : {}
    const now = new Date().toISOString()

    const payload = {
      ...current,
      ...partial,
      adminPassword: partial?.adminPassword != null ? cleanString(partial.adminPassword) : cleanString(current.adminPassword),
      createdAt: cleanString(current.createdAt) || now,
      updatedAt: now,
    }

    await setDoc(settingsRef, payload, { merge: true })
    return {
      adminPassword: cleanString(payload.adminPassword),
      createdAt: cleanString(payload.createdAt),
      updatedAt: cleanString(payload.updatedAt),
    }
  } catch (error) {
    throw new Error(error?.message || 'Failed to update settings')
  }
}