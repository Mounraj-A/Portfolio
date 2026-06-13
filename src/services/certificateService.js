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

const certificatesRef = collection(db, 'certificates')

function mapCertificate(snapshot) {
  const data = snapshot.data() || {}
  return {
    id: snapshot.id,
    title: cleanString(data.title),
    organization: cleanString(data.organization),
    description: cleanString(data.description || data.note),
    note: cleanString(data.note || data.description),
    image: cleanString(data.image),
    createdAt: toIsoString(data.createdAt),
    updatedAt: toIsoString(data.updatedAt),
  }
}

function buildCertificatePayload(certificate) {
  return withTimestamps(
    {
      title: cleanString(certificate.title),
      organization: cleanString(certificate.organization),
      description: cleanString(certificate.description || certificate.note),
      note: cleanString(certificate.note || certificate.description),
      image: cleanString(certificate.image),
    },
    certificate
  )
}

export async function fetchCertificates() {
  try {
    const snapshot = await getDocs(certificatesRef)
    return sortByLatest(snapshot.docs.map(mapCertificate))
  } catch (error) {
    throw new Error(error?.message || 'Failed to fetch certificates')
  }
}

export async function addCertificate(certificate) {
  try {
    const payload = buildCertificatePayload(certificate)
    const ref = await addDoc(certificatesRef, payload)
    return { id: ref.id, ...payload }
  } catch (error) {
    throw new Error(error?.message || 'Failed to add certificate')
  }
}

export async function updateCertificate(certificateId, certificate) {
  try {
    const payload = buildCertificatePayload(certificate)
    await updateDoc(doc(db, 'certificates', String(certificateId)), payload)
    return { id: String(certificateId), ...payload }
  } catch (error) {
    throw new Error(error?.message || 'Failed to update certificate')
  }
}

export async function deleteCertificate(certificateId) {
  try {
    await deleteDoc(doc(db, 'certificates', String(certificateId)))
    return { id: String(certificateId) }
  } catch (error) {
    throw new Error(error?.message || 'Failed to delete certificate')
  }
}
