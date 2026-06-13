import { doc, getDoc, setDoc } from 'firebase/firestore'
import { db } from '../firebase/firebase'
import { cleanObject, cleanString } from './firestoreUtils.js'

const contactRef = doc(db, 'contact', 'main')

function normalizeFooterSocial(item) {
  const social = cleanObject(item)
  return {
    label: cleanString(social.label),
    href: cleanString(social.href),
    iconKey: cleanString(social.iconKey || 'mail') || 'mail',
  }
}

function normalizeContact(data) {
  const contact = cleanObject(data)
  const sectionHeader = cleanObject(contact.sectionHeader)
  const direct = cleanObject(contact.direct)
  const social = cleanObject(contact.social)

  return {
    sectionHeader: {
      eyebrow: cleanString(sectionHeader.eyebrow),
      title: cleanString(sectionHeader.title),
      subtitle: cleanString(sectionHeader.subtitle),
    },
    direct: {
      email: cleanString(direct.email),
      phone: cleanString(direct.phone),
      location: cleanString(direct.location),
    },
    social: {
      github: cleanString(social.github),
      linkedin: cleanString(social.linkedin),
    },
    footerSocials: Array.isArray(contact.footerSocials)
      ? contact.footerSocials.map(normalizeFooterSocial).filter((item) => item.label && item.href)
      : [],
    createdAt: cleanString(contact.createdAt),
    updatedAt: cleanString(contact.updatedAt),
  }
}

export async function fetchContact() {
  try {
    const snapshot = await getDoc(contactRef)
    if (!snapshot.exists()) return normalizeContact({})
    return normalizeContact(snapshot.data())
  } catch (error) {
    throw new Error(error?.message || 'Failed to fetch contact section')
  }
}

export async function updateContact(contact) {
  try {
    const snapshot = await getDoc(contactRef)
    const current = snapshot.exists() ? snapshot.data() || {} : {}
    const payload = normalizeContact(contact)
    const now = new Date().toISOString()
    await setDoc(
      contactRef,
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
    throw new Error(error?.message || 'Failed to update contact section')
  }
}
