import { initializeApp } from 'firebase/app'
import { getFirestore } from 'firebase/firestore'

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY ?? 'AIzaSyCaWSBOrGiX3UHssfovYEsI3hr7Ed6mvsg',
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN ?? 'portfolio-1b85a.firebaseapp.com',
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID ?? 'portfolio-1b85a',
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET ?? 'portfolio-1b85a.firebasestorage.app',
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID ?? '819824920411',
  appId: import.meta.env.VITE_FIREBASE_APP_ID ?? '1:819824920411:web:f1966db014fde49fb6fc7e',
  measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID ?? 'G-803PHVMTCG',
}

export const app = initializeApp(firebaseConfig)
export const db = getFirestore(app)

export let analytics = null

if (typeof window !== 'undefined' && firebaseConfig.measurementId) {
  import('firebase/analytics')
    .then(({ getAnalytics, isSupported }) =>
      isSupported()
        .then((supported) => {
          if (supported) analytics = getAnalytics(app)
        })
        .catch(() => {})
    )
    .catch(() => {})
}