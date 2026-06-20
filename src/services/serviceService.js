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

const servicesRef = collection(db, 'services')

function mapService(snapshot) {
  const data = snapshot.data() || {}
  return {
    id: snapshot.id,
    title: cleanString(data.title),
    desc: cleanString(data.desc || data.description),
    iconKey: cleanString(data.iconKey || 'layout') || 'layout',
    tags: Array.isArray(data.tags) ? data.tags.map((t) => String(t).trim()).filter(Boolean) : [],
    createdAt: toIsoString(data.createdAt),
    updatedAt: toIsoString(data.updatedAt),
  }
}

function buildServicePayload(service) {
  return withTimestamps(
    {
      title: cleanString(service.title),
      desc: cleanString(service.desc || service.description),
      iconKey: cleanString(service.iconKey || 'layout') || 'layout',
      tags: Array.isArray(service.tags) ? service.tags.map((t) => String(t).trim()).filter(Boolean) : [],
    },
    service
  )
}

export async function fetchServices() {
  try {
    const snapshot = await getDocs(servicesRef)
    return sortByLatest(snapshot.docs.map(mapService))
  } catch (error) {
    throw new Error(error?.message || 'Failed to fetch services')
  }
}

export async function addService(service) {
  try {
    const payload = buildServicePayload(service)
    const ref = await addDoc(servicesRef, payload)
    return { id: ref.id, ...payload }
  } catch (error) {
    throw new Error(error?.message || 'Failed to add service')
  }
}

export async function updateService(serviceId, service) {
  try {
    const payload = buildServicePayload(service)
    await updateDoc(doc(db, 'services', String(serviceId)), payload)
    return { id: String(serviceId), ...payload }
  } catch (error) {
    throw new Error(error?.message || 'Failed to update service')
  }
}

export async function deleteService(serviceId) {
  try {
    await deleteDoc(doc(db, 'services', String(serviceId)))
    return { id: String(serviceId) }
  } catch (error) {
    throw new Error(error?.message || 'Failed to delete service')
  }
}
