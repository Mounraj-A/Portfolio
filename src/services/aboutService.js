import { doc, getDoc, setDoc } from 'firebase/firestore'
import { db } from '../firebase/firebase'
import { cleanObject, cleanString } from './firestoreUtils.js'

const aboutRef = doc(db, 'about', 'main')

function normalizeAbout(data) {
  const about = cleanObject(data)
  const sectionHeader = cleanObject(about.sectionHeader)
  const infoCards = cleanObject(about.infoCards)

  return {
    sectionHeader: {
      eyebrow: cleanString(sectionHeader.eyebrow),
      title: cleanString(sectionHeader.title),
      subtitle: cleanString(sectionHeader.subtitle),
    },
    heroName: cleanString(about.heroName),
    paragraph: cleanString(about.paragraph),
    infoCards: {
      collegeLabel: cleanString(infoCards.collegeLabel),
      collegeValue: cleanString(infoCards.collegeValue),
      careerGoalLabel: cleanString(infoCards.careerGoalLabel),
      careerGoalValue: cleanString(infoCards.careerGoalValue),
      interestsLabel: cleanString(infoCards.interestsLabel),
      interestsValue: cleanString(infoCards.interestsValue),
      mindsetLabel: cleanString(infoCards.mindsetLabel),
      mindsetValue: cleanString(infoCards.mindsetValue),
    },
    createdAt: cleanString(about.createdAt),
    updatedAt: cleanString(about.updatedAt),
  }
}

export async function fetchAbout() {
  try {
    const snapshot = await getDoc(aboutRef)
    if (!snapshot.exists()) return normalizeAbout({})
    return normalizeAbout(snapshot.data())
  } catch (error) {
    throw new Error(error?.message || 'Failed to fetch about section')
  }
}

export async function updateAbout(about) {
  try {
    const snapshot = await getDoc(aboutRef)
    const current = snapshot.exists() ? snapshot.data() || {} : {}
    const payload = normalizeAbout(about)
    await setDoc(
      aboutRef,
      {
        ...payload,
        createdAt: current.createdAt || payload.createdAt || new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
      { merge: true }
    )
    return {
      ...payload,
      createdAt: current.createdAt || payload.createdAt || new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    }
  } catch (error) {
    throw new Error(error?.message || 'Failed to update about section')
  }
}
