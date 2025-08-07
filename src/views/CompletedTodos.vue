<template>
  <div class="px-4 py-6 max-w-lg mx-auto">
    <h1 class="text-2xl font-bold mb-4">完了したTODO</h1>
    <ul class="space-y-4">
      <li v-for="todo in completedTodos" :key="todo.id" class="bg-white rounded shadow p-4">
        <strong class="block">{{ todo.title }}</strong>
        <div class="text-sm text-gray-500">
          完了日:
          <span>
            {{ todo.completedAt ? formatDate(todo.completedAt.toDate()) : '不明' }}
          </span>
        </div>
      </li>
    </ul>
  </div>
  <div class="flex justify-end mb-4">
    <button
      @click="deleteAllCompletedTodos"
      class="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 text-sm"
    >
      完了TODOをすべて削除
    </button>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import {
  collection,
  query,
  where,
  orderBy,
  onSnapshot,
  getDocs,
  writeBatch,
} from 'firebase/firestore'
import { db } from '../firebase/config'
import { auth } from '../firebase/config'
import type { Timestamp } from 'firebase/firestore'

interface Todo {
  id: string
  title: string
  status: string
  createdAt: Timestamp
  uid: string
  completedAt?: Timestamp | null
}

const completedTodos = ref<Todo[]>([])

const formatDate = (date: Date): string => {
  return new Intl.DateTimeFormat('ja-JP', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
  }).format(date)
}

onMounted(() => {
  const q = query(
    collection(db, 'todos'),
    where('uid', '==', auth.currentUser?.uid),
    where('status', '==', '完了'),
    orderBy('completedAt', 'desc'),
  )

  onSnapshot(q, (snapshot) => {
    completedTodos.value = snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    })) as Todo[]
  })
})

const deleteAllCompletedTodos = async () => {
  try {
    const q = query(
      collection(db, 'todos'),
      where('uid', '==', auth.currentUser?.uid),
      where('status', '==', '完了'),
    )
    const snapshot = await getDocs(q)

    const batch = writeBatch(db)
    snapshot.forEach((doc) => {
      batch.delete(doc.ref)
    })

    await batch.commit()
    alert('完了TODOをすべて削除しました。')
  } catch (err) {
    console.error('一括削除エラー:', err)
    alert('削除中にエラーが発生しました。')
  }
}
</script>
