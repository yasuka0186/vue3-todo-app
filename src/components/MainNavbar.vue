<template>
  <nav class="flex justify-between items-center px-6 py-4 bg-gray-800 text-white">
    <div class="text-lg font-bold">TODOアプリ</div>
    <div class="flex items-center gap-4">
      <span v-if="userEmail">{{ userEmail }} さん、ようこそ！</span>
      <button
        v-if="user"
        @click="handleLogout"
        class="bg-red-500 hover:bg-red-600 px-3 py-1 rounded"
      >
        ログアウト
      </button>
    </div>
  </nav>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { auth } from '../firebase/config'
import { onAuthStateChanged, signOut } from 'firebase/auth'
import { useRouter } from 'vue-router'

const user = ref()
const userEmail = ref<string | null>(null)
const router = useRouter()

// ログイン状態を監視
onMounted(() => {
  onAuthStateChanged(auth, (currentUser) => {
    console.log('ログインユーザ：', currentUser)
    user.value = currentUser
    userEmail.value = currentUser?.email ?? null
  })
})

const handleLogout = async () => {
  try {
    await signOut(auth)
    user.value = null
    userEmail.value = null
    router.push('/login')
  } catch (err: unknown) {
    console.error('ログアウトエラー', err)
  }
}
</script>
