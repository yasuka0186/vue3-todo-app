// src/firebase/config.ts
import { initializeApp, getApps } from 'firebase/app'
import { getAuth } from 'firebase/auth'
import { getFirestore } from 'firebase/firestore'

// Vite の環境変数から読む（VITE_ プレフィックス必須）
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
}

console.log('PROJECT_ID:', import.meta.env.VITE_FIREBASE_PROJECT_ID)

// 2重初期化を防止
// Firebaseアプリを初期化
const app = getApps().length ? getApps()[0] : initializeApp(firebaseConfig)

// Firebaseの各機能を使えるようにexport
const auth = getAuth(app)
const db = getFirestore(app)

export { auth, db }
