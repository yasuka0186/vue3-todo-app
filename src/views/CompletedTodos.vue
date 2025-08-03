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
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { collection, query, where, orderBy, onSnapshot } from 'firebase/firestore'
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
    orderBy('createdAt', 'desc'),
  )

  onSnapshot(q, (snapshot) => {
    completedTodos.value = snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    })) as Todo[]
  })
})
</script>
