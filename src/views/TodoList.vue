<template>
  <div class="flex flex-col h-[calc(100vh-4rem)]">
    <!-- ナビバー高さを引いた高さ -->
    <!-- タイトル & 入力フォーム（固定表示） -->
    <div class="shrink-0 bg-gray-50 py-4 px-4">
      <h1 class="text-2xl font-bold mb-4">TODO一覧</h1>
      <form @submit.prevent="addTodo" class="flex gap-2">
        <input
          v-model="newTodo"
          class="flex-1 px-3 py-2 border rounded"
          type="text"
          placeholder="新しいTODOを入力"
        />
        <button type="submit" class="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600">
          追加
        </button>
      </form>
    </div>

    <!-- TODOカードリスト（スクロール領域） -->
    <div class="grow overflow-y-auto px-4 pb-6">
      <ul class="space-y-4 mt-4">
        <li v-for="todo in todos" :key="todo.id" class="relative bg-white p-4 rounded shadow">
          <!-- 編集ボタン（右上） -->
          <button
            @click="openEditModal(todo)"
            class="absolute top-2 right-2 text-blue-500 text-sm hover:underline"
          >
            編集
          </button>

          <div class="text-lg font-semibold">{{ todo.title }}</div>
          <div class="text-sm text-gray-500">
            作成日: {{ formatDate(todo.createdAt?.toDate()) }}
          </div>

          <div class="mt-2">
            <span
              class="mr-2 font-semibold"
              :class="{
                'text-orange-500': todo.status === '着手中',
                'text-green-600': todo.status === '完了',
                'text-gray-500': todo.status === '未完了',
              }"
            >
              状態: {{ todo.status }}
            </span>
            <select
              v-model="todo.status"
              @change="updateStatus(todo.id, todo.status)"
              class="border rounded px-2 py-1 text-sm"
            >
              <option value="未完了">未完了</option>
              <option value="着手中">着手中</option>
              <option value="完了">完了</option>
            </select>
          </div>

          <!-- 削除ボタン（右下） -->
          <button
            @click="deleteTodo(todo.id)"
            class="absolute bottom-2 right-2 text-red-500 text-sm hover:underline"
          >
            削除
          </button>
        </li>
      </ul>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import {
  collection,
  query,
  orderBy,
  onSnapshot,
  addDoc,
  deleteDoc,
  updateDoc,
  doc,
  Timestamp,
} from 'firebase/firestore'
import { db } from '../firebase/config'
import { auth } from '../firebase/config'

interface Todo {
  id: string
  title: string
  status: string
  createdAt: Timestamp
  uid: string
}

const newTodo = ref('')
const todos = ref<Todo[]>([])

const addTodo = async () => {
  const title = newTodo.value.trim()
  if (!title) return
  await addDoc(collection(db, 'todos'), {
    title,
    status: '未完了',
    createdAt: new Date(),
    uid: auth.currentUser?.uid,
  })
  newTodo.value = ''
}

const deleteTodo = async (id: string) => {
  await deleteDoc(doc(db, 'todos', id))
}

const updateStatus = async (id: string, status: string) => {
  await updateDoc(doc(db, 'todos', id), { status })
}

const openEditModal = (todo: Todo) => {
  // TODO: モーダル編集処理（必要に応じて後日追加）
  alert(`"${todo.title}" を編集します（実装予定）`)
}

const formatDate = (date: Date) => {
  return new Intl.DateTimeFormat('ja-JP', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
  }).format(date)
}

onMounted(() => {
  const q = query(collection(db, 'todos'), orderBy('createdAt', 'desc'))
  onSnapshot(q, (snapshot) => {
    todos.value = snapshot.docs
      .map((doc) => ({ id: doc.id, ...doc.data() }) as Todo)
      .filter((todo) => todo.uid === auth.currentUser?.uid)
  })
})
</script>
