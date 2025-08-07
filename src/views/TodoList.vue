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
            class="absolute top-2 right-2 bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded text-sm"
          >
            編集
          </button>
          <div class="text-lg font-semibold">{{ todo.title }}</div>
          <div class="mt-2">
            <span
              class="mr-2 font-semibold"
              :class="{
                'text-orange-500': todo.status === '未着手',
                'text-green-600': todo.status === '着手中',
                'text-gray-500': todo.status === '完了',
              }"
            >
            </span>
            <!-- 新: 状態ボタンで表示・変更 -->
            <button
              @click="cycleStatus(todo)"
              class="px-3 py-1 rounded text-sm font-semibold border"
              :class="{
                'bg-gray-100 text-gray-700': todo.status === '未着手',
                'bg-yellow-100 text-yellow-700': todo.status === '着手中',
                'bg-green-100 text-green-700': todo.status === '完了',
              }"
            >
              状態: {{ todo.status }}
            </button>
          </div>
          <div class="text-sm text-gray-500">
            作成日: {{ formatDate(todo.createdAt?.toDate()) }}
          </div>
          <!-- 削除ボタン（右下） -->
          <button
            @click="openDeleteModal(todo.id)"
            class="absolute bottom-2 right-2 bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded text-sm"
          >
            削除
          </button>
        </li>
      </ul>
    </div>
    <div
      v-if="isEditModalOpen"
      class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
    >
      <div class="bg-white p-6 rounded shadow-md w-full max-w-md">
        <h2 class="text-lg font-bold mb-4">TODOタイトルの編集</h2>
        <input
          type="text"
          v-model="editTitle"
          class="border px-3 py-2 w-full rounded mb-4"
          placeholder="新しいタイトル"
        />

        <div class="flex justify-end gap-2">
          <button @click="closeEditModal" class="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400">
            キャンセル
          </button>
          <button
            @click="updateTodoTitle"
            class="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
          >
            保存
          </button>
        </div>
      </div>
    </div>

    <div
      v-if="isDeleteModalOpen"
      class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
    >
      <div class="bg-white p-6 rounded shadow-md w-full max-w-md">
        <h2 class="text-lg font bold mb-4">このTODOを削除してもよろしいですか？</h2>
        <p class="mb-4 text-gray-700">
          <span class="font-semibold">「{{ targetTodo?.title || '(タイトルなし)' }}」　</span>
        </p>
        <div class="flex justify-end gap-2">
          <button @click="closeDeleteModal" class="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400">
            キャンセル
          </button>
          <buttton
            @click="deleteTodo"
            class="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
          >
            削除
          </buttton>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
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
  where,
  serverTimestamp,
  FieldValue,
} from 'firebase/firestore'
import { db } from '../firebase/config'
import { auth } from '../firebase/config'

interface Todo {
  id: string
  title: string
  status: string
  createdAt: Timestamp
  uid: string
  completedAt?: Timestamp | FieldValue | null
}

const newTodo = ref('')
const todos = ref<Todo[]>([])
const isEditModalOpen = ref(false)
const editTitle = ref('')
const editTodoId = ref<string | null>(null)
const isDeleteModalOpen = ref(false)
const deleteTodoId = ref<string | null>(null)
const targetTodo = computed(() => todos.value.find((t) => t.id === deleteTodoId.value) || null)
const statusOrder = ['未着手', '着手中', '完了']

// TODOの追加
const addTodo = async () => {
  const title = newTodo.value.trim()
  if (!title) return
  await addDoc(collection(db, 'todos'), {
    title,
    status: '未着手',
    createdAt: new Date(),
    uid: auth.currentUser?.uid,
  })
  newTodo.value = ''
}

const cycleStatus = async (todo: Todo) => {
  const currentIndex = statusOrder.indexOf(todo.status)
  const nextIndex = (currentIndex + 1) % statusOrder.length
  const nextStatus = statusOrder[nextIndex]

  const todoRef = doc(db, 'todos', todo.id)

  const updateData: {
    status: string
    completedAt?: Timestamp | FieldValue | null
  } = {
    status: nextStatus,
  }

  if (nextStatus === '完了') {
    updateData.completedAt = serverTimestamp()
  } else {
    updateData.completedAt = null
  }

  try {
    await updateDoc(todoRef, updateData)
  } catch (err) {
    console.error('ステータス更新エラー:', err)
  }
}

// 編集モーダルを開く
const openEditModal = (todo: Todo) => {
  editTitle.value = todo.title
  editTodoId.value = todo.id
  isEditModalOpen.value = true
}

// 編集モーダルを閉じる
const closeEditModal = () => {
  isEditModalOpen.value = false
  editTitle.value = ''
  editTodoId.value = null
}

// Firestoreでタイトルを更新
const updateTodoTitle = async () => {
  if (!editTodoId.value) return
  try {
    const todoDoc = doc(db, 'todos', editTodoId.value)
    await updateDoc(todoDoc, {
      title: editTitle.value,
    })
    closeEditModal()
  } catch (err) {
    console.error('タイトル更新エラー：', err)
  }
}

// 削除モーダルを開く
const openDeleteModal = (id: string) => {
  deleteTodoId.value = id
  isDeleteModalOpen.value = true
}

// 削除モーダルを閉じる
const closeDeleteModal = () => {
  isDeleteModalOpen.value = false
  // deleteTitle.value = ''
  deleteTodoId.value = null
}

// Firestoreでタイトルを削除
const deleteTodo = async () => {
  if (!deleteTodoId.value) return
  try {
    await deleteDoc(doc(db, 'todos', deleteTodoId.value))
    closeDeleteModal()
  } catch (err) {
    console.error('タイトル削除エラー：', err)
  }
}

// 日付を日本語形式に整形
const formatDate = (date: Date) => {
  return new Intl.DateTimeFormat('ja-JP', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
  }).format(date)
}

// TODO一覧をリアルタイムで取得
onMounted(() => {
  const q = query(
    collection(db, 'todos'),
    where('uid', '==', auth.currentUser?.uid),
    orderBy('createdAt', 'desc'),
  )

  onSnapshot(q, (snapshot) => {
    todos.value = snapshot.docs
      .map((doc) => ({ id: doc.id, ...doc.data() }) as Todo)
      .filter((todo) => todo.status !== '完了')
  })
})
</script>
