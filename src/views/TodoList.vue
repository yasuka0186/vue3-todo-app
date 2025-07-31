<template>
  <div>
    <h1>TODO一覧</h1>

    <form @submit.prevent="addTodo">
      <input v-model="newTodo" placeholder="新しいTODOを入力" required />
      <button type="submit">追加</button>
    </form>

    <ul>
      <li v-for="todo in todos" :key="todo.id">
        <div>
          <strong>{{ todo.title }}</strong>
          <div>作成日: {{ formatDate(todo.createdAt.toDate()) }}</div>
        </div>
        <select v-model="todo.status" @change="updateStatus(todo.id, todo.status)">
          <option value="未完了">未完了</option>
          <option value="着手中">着手中</option>
          <option value="完了">完了</option>
        </select>
        <button @click="deleteTodo(todo.id)">削除</button>
      </li>
    </ul>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onBeforeUnmount } from 'vue'
import { db } from '../firebase/config'
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
} from 'firebase/firestore'

interface Todo {
  id: string
  title: string
  status: '未完了' | '着手中' | '完了'
  createdAt: Timestamp
}

const newTodo = ref('')
// ✅ todos に型情報をつける
const todos = ref<Todo[]>([])

const todosRef = collection(db, 'todos')

// TODO追加処理
const addTodo = async () => {
  if (!newTodo.value.trim()) return
  try {
    await addDoc(todosRef, {
      title: newTodo.value,
      createdAt: Timestamp.now(),
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

onMounted(() => {
  const q = query(todosRef, orderBy('createdAt', 'desc'))
  unsubscribe = onSnapshot(q, (snapshot) => {
    todos.value = snapshot.docs.map((doc) => {
      const data = doc.data()
      return {
        id: doc.id,
        title: data.title,
        status: data.status ?? '未完了', // ← 既存データの対応
        createdAt: data.createdAt,
      } as Todo
    })
  })
})

onBeforeUnmount(() => {
  if (unsubscribe) unsubscribe()
})
</script>
