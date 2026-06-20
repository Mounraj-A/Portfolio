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
  cleanString,
  cleanStringArray,
  sortByLatest,
  withTimestamps,
  toIsoString,
} from './firestoreUtils.js'

const projectsRef = collection(db, 'projects')

function mapProject(snapshot) {
  const data = snapshot.data() || {}
  return {
    id: snapshot.id,
    title: cleanString(data.title),
    description: cleanString(data.description),
    longDescription: cleanString(data.longDescription || data.description),
    highlights: Array.isArray(data.highlights) ? data.highlights.map(cleanString).filter(Boolean) : [],
    tech: cleanStringArray(data.tech),
    githubUrl: cleanString(data.githubUrl),
    liveUrl: cleanString(data.liveUrl),
    image: cleanString(data.image),
    iconKey: cleanString(data.iconKey) || 'code',
    createdAt: toIsoString(data.createdAt),
    updatedAt: toIsoString(data.updatedAt),
  }
}

function buildProjectPayload(project) {
  const payload = {
    title: cleanString(project.title),
    description: cleanString(project.description),
    longDescription: cleanString(project.longDescription || project.description),
    highlights: Array.isArray(project.highlights) ? project.highlights.map(cleanString).filter(Boolean) : [],
    tech: cleanStringArray(project.tech),
    githubUrl: cleanString(project.githubUrl),
    liveUrl: cleanString(project.liveUrl),
    image: cleanString(project.image),
    iconKey: cleanString(project.iconKey) || 'code',
  }

  return withTimestamps(payload, project)
}

export async function fetchProjects() {
  try {
    const snapshot = await getDocs(projectsRef)
    return sortByLatest(snapshot.docs.map(mapProject))
  } catch (error) {
    throw new Error(error?.message || 'Failed to fetch projects')
  }
}

export async function addProject(project) {
  try {
    const payload = buildProjectPayload(project)
    const ref = await addDoc(projectsRef, payload)
    return { id: ref.id, ...payload }
  } catch (error) {
    throw new Error(error?.message || 'Failed to add project')
  }
}

export async function updateProject(projectId, project) {
  try {
    const ref = doc(db, 'projects', String(projectId))
    const payload = buildProjectPayload(project)
    await updateDoc(ref, payload)
    return { id: String(projectId), ...payload }
  } catch (error) {
    throw new Error(error?.message || 'Failed to update project')
  }
}

export async function deleteProject(projectId) {
  try {
    await deleteDoc(doc(db, 'projects', String(projectId)))
    return { id: String(projectId) }
  } catch (error) {
    throw new Error(error?.message || 'Failed to delete project')
  }
}
