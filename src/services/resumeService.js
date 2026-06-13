import { doc, getDoc, setDoc } from 'firebase/firestore'
import { db } from '../firebase/firebase'
import { cleanObject, cleanString } from './firestoreUtils.js'

const resumeRef = doc(db, 'resume', 'main')

function normalizeResume(data) {
  const resume = cleanObject(data)
  return {
    previewImage: cleanString(resume.previewImage),
    pdfUrl: cleanString(resume.pdfUrl),
    createdAt: cleanString(resume.createdAt),
    updatedAt: cleanString(resume.updatedAt),
  }
}

export async function fetchResume() {
  try {
    const snapshot = await getDoc(resumeRef)
    if (!snapshot.exists()) return normalizeResume({})
    return normalizeResume(snapshot.data())
  } catch (error) {
    throw new Error(error?.message || 'Failed to fetch resume section')
  }
}

export async function updateResume(resume) {
  try {
    const snapshot = await getDoc(resumeRef)
    const current = snapshot.exists() ? snapshot.data() || {} : {}
    const payload = normalizeResume(resume)
    const now = new Date().toISOString()
    await setDoc(
      resumeRef,
      {
        ...payload,
        createdAt: current.createdAt || payload.createdAt || now,
        updatedAt: now,
      },
      { merge: true }
    )
    return {
      ...payload,
      createdAt: current.createdAt || payload.createdAt || now,
      updatedAt: now,
    }
  } catch (error) {
    throw new Error(error?.message || 'Failed to update resume section')
  }
}
