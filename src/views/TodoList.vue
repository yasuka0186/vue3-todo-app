<template>
  <div>
    <h1 class="text-xl font-bold mb-4 text-center max-w-lg mx-auto">TODO一覧</h1>

    <!-- ✅ フォーム全体を中央配置＋幅制限 -->
    <form @submit.prevent="addTodo" class="w-full max-w-lg mx-auto flex gap-2 mb-6">
      <input
        v-model="newTodo"
        type="text"
        placeholder="新しいTODOを入力"
        class="flex-1 border border-gray-300 rounded px-4 py-2 focus:outline-none focus:ring focus:ring-blue-400"
        required
      />
      <button
        type="submit"
        class="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition"
      >
        追加
      </button>
    </form>

    <!-- TODOリスト全体を包む div を追加 -->
    <div class="w-full max-w-lg mx-auto space-y-4">
      <li
        v-for="todo in todos"
        :key="todo.id"
        class="p-4 border rounded shadow-sm bg-white flex justify-between items-start"
      >
        <div>
          <p class="text-lg font-medium">{{ todo.title }}</p>
          <p class="text-sm text-gray-500">作成日: {{ formatDate(todo.createdAt.toDate()) }}</p>

          <span
            :class="{
              'text-gray-600': todo.status === '未完了',
              'text-yellow-600': todo.status === '着手中',
              'text-green-600': todo.status === '完了',
            }"
            class="inline-block mt-1 text-sm font-semibold"
          >
            状態: {{ todo.status }}
          </span>

          <div class="mt-2">
            <select
              v-model="todo.status"
              @change="updateStatus(todo.id, todo.status)"
              class="border border-gray-300 rounded px-2 py-1 text-sm"
            >
              <option value="未完了">未完了</option>
              <option value="着手中">着手中</option>
              <option value="完了">完了</option>
            </select>
          </div>
        </div>

        <button @click="deleteTodo(todo.id)" class="text-red-600 hover:text-red-800 text-sm">
          削除
        </button>
      </li>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onBeforeUnmount } from 'vue'
import { db, auth } from '../firebase/config'
import {
  collection,
  addDoc,
  onSnapshot,
  query,
  orderBy,
  Timestamp,
  deleteDoc,
  updateDoc,
  doc,
  where,
} from 'firebase/firestore'
import { onAuthStateChanged } from 'firebase/auth'

interface Todo {
  id: string
  title: string
  status: '未完了' | '着手中' | '完了'
  createdAt: Timestamp
  uid?: string
}

const newTodo = ref('')
// ✅ todos に型情報をつける
const todos = ref<Todo[]>([])
const todosRef = collection(db, 'todos')
const userId = ref<string | null>(null)

onMounted(() => {
  onAuthStateChanged(auth, (user) => {
    if (user) {
      userId.value = user.uid
      fetchTodos(user.uid)
    } else {
      userId.value = null
      todos.value = []
    }
  })
})

// TODO追加処理
const addTodo = async () => {
  if (!newTodo.value.trim()) return
  try {
    await addDoc(todosRef, {
      title: newTodo.value,
      status: '未完了',
      createdAt: Timestamp.now(),
      uid: userId.value,
    })
    newTodo.value = ''
  } catch (err) {
    console.error('TODO追加エラー:', err)
  }
}

// status更新処理
const updateStatus = async (id: string, newStatus: '未完了' | '着手中' | '完了') => {
  try {
    const todoDoc = doc(db, 'todos', id)
    await updateDoc(todoDoc, {
      status: newStatus,
    })
  } catch (err) {
    console.error('ステータス更新エラー:', err)
  }
}

// TODO削除処理
const deleteTodo = async (id: string) => {
  try {
    await deleteDoc(doc(db, 'todos', id))
  } catch (err) {
    console.error('削除エラー:', err)
  }
}

// 日時フォーマット関数（例: 2025/07/30 21:15）
const formatDate = (date: Date): string => {
  const yyyy = date.getFullYear()
  const mm = String(date.getMonth() + 1).padStart(2, '0')
  const dd = String(date.getDate()).padStart(2, '0')
  const hh = String(date.getHours()).padStart(2, '0')
  const min = String(date.getMinutes()).padStart(2, '0')
  return `${yyyy}/${mm}/${dd} ${hh}:${min}`
}

// Firestoreのリアルタイム監視（一覧表示）
let unsubscribe: () => void

const fetchTodos = (uid: string) => {
  const q = query(todosRef, where('uid', '==', uid), orderBy('createdAt', 'desc'))
  unsubscribe = onSnapshot(q, (snapshot) => {
    todos.value = snapshot.docs.map((doc): Todo => {
      const data = doc.data()
      return {
        id: doc.id,
        title: data.title,
        status: (data.status ?? '未完了') as '未完了' | '着手中' | '完了',
        createdAt: data.createdAt,
      }
    })
  })
}

onBeforeUnmount(() => {
  if (unsubscribe) unsubscribe()
})
</script>
