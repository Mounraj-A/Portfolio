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

const achievementsRef = collection(db, 'achievements')

function mapAchievement(snapshot) {
  const data = snapshot.data() || {}
  return {
    id: snapshot.id,
    title: cleanString(data.title),
    desc: cleanString(data.desc || data.description),
    iconKey: cleanString(data.iconKey || 'trophy') || 'trophy',
    createdAt: toIsoString(data.createdAt),
    updatedAt: toIsoString(data.updatedAt),
  }
}

function buildAchievementPayload(achievement) {
  return withTimestamps(
    {
      title: cleanString(achievement.title),
      desc: cleanString(achievement.desc || achievement.description),
      iconKey: cleanString(achievement.iconKey || 'trophy') || 'trophy',
    },
    achievement
  )
}

export async function fetchAchievements() {
  try {
    const snapshot = await getDocs(achievementsRef)
    return sortByLatest(snapshot.docs.map(mapAchievement))
  } catch (error) {
    throw new Error(error?.message || 'Failed to fetch achievements')
  }
}

export async function addAchievement(achievement) {
  try {
    const payload = buildAchievementPayload(achievement)
    const ref = await addDoc(achievementsRef, payload)
    return { id: ref.id, ...payload }
  } catch (error) {
    throw new Error(error?.message || 'Failed to add achievement')
  }
}

export async function updateAchievement(achievementId, achievement) {
  try {
    const payload = buildAchievementPayload(achievement)
    await updateDoc(doc(db, 'achievements', String(achievementId)), payload)
    return { id: String(achievementId), ...payload }
  } catch (error) {
    throw new Error(error?.message || 'Failed to update achievement')
  }
}

export async function deleteAchievement(achievementId) {
  try {
    await deleteDoc(doc(db, 'achievements', String(achievementId)))
    return { id: String(achievementId) }
  } catch (error) {
    throw new Error(error?.message || 'Failed to delete achievement')
  }
}
