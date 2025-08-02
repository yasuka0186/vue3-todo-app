<template>
  <nav class="fixed top-0 left-0 w-screen z-50 bg-gray-800 text-white shadow-md">
    <div class="flex justify-between items-center px-6 h-16 w-full">
      <!-- 左：アプリ名 -->
      <div class="text-xl font-bold">TODOアプリ</div>

      <!-- ログイン状態のときだけ表示 -->
      <div
        v-if="isLoggedIn"
        class="flex items-center gap-4 flex-wrap justify-end max-w-full overflow-hidden"
      >
        <span class="text-sm break-words max-w-[280px] sm:max-w-none">
          {{ userEmail }} さん、ようこそ！
        </span>
        <button @click="handleLogout" class="bg-red-500 hover:bg-red-600 px-3 py-1 rounded text-sm">
          ログアウト
        </button>
      </div>
    </div>
  </nav>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { auth } from '../firebase/config'
import { onAuthStateChanged, signOut } from 'firebase/auth'
import type { User } from 'firebase/auth'
import { useRouter } from 'vue-router'

const user = ref<User | null>(null)
const userEmail = computed(() => user.value?.email ?? '')
const isLoggedIn = computed(() => user.value !== null)

const router = useRouter()

// ログイン状態を監視
onMounted(() => {
  onAuthStateChanged(auth, (currentUser) => {
    user.value = currentUser
  })
})

// ログアウト処理
const handleLogout = async () => {
  try {
    await signOut(auth)
    user.value = null
    router.push('/login')
  } catch (err) {
    console.error('ログアウトエラー', err)
  }
}
</script>
