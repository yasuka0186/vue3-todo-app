// src/firebase/config.ts
import { initializeApp } from 'firebase/app'
import { getAuth } from 'firebase/auth'
import { getFirestore } from 'firebase/firestore'

// ↓ここは Firebase コンソールの「プロジェクト設定」>「SDK 設定と構成」>「構成」からコピペしてください
const firebaseConfig = {
  apiKey: 'AIzaSyDfaXtuXAJGgRYjaHhO8IVZTVDMe5AWupM',
  authDomain: 'vue3-todo-app-fa89d.firebaseapp.com',
  projectId: 'vue3-todo-app-fa89d',
  storageBucket: 'vue3-todo-app-fa89d.appspot.com',
  messagingSenderId: '1091554238548',
  appId: '1:1091554238548:web:197aab73a5a4decca2cdc1',
}

// Firebaseアプリを初期化
const app = initializeApp(firebaseConfig)

// Firebaseの各機能を使えるようにexport
const auth = getAuth(app)
const db = getFirestore(app)

export { auth, db }
