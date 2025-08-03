<template>
  <nav class="fixed top-0 left-0 right-0 z-50 bg-gray-800 text-white shadow-md m-0 p-0">
    <div class="flex items-center justify-between px-6 h-16 w-full max-w-screen-xl mx-auto">
      <!-- 左：ロゴ -->
      <div class="text-xl font-bold whitespace-nowrap">TODOアプリ</div>

      <!-- 中央：タブ -->
      <div class="flex gap-6 text-sm justify-center flex-1">
        <RouterLink
          to="/"
          class="hover:underline"
          :class="{ 'font-bold text-blue-300 underline': $route.path === '/' }"
        >
          TODO一覧
        </RouterLink>
        <RouterLink
          to="/completed"
          class="hover:underline"
          :class="{ 'font-bold text-blue-300 underline': $route.path === '/completed' }"
        >
          完了したTODO
        </RouterLink>
      </div>

      <!-- 右：ログイン中のみ表示 -->
      <div v-if="isLoggedIn" class="flex items-center gap-4 whitespace-nowrap">
        <span class="text-sm hidden sm:inline break-words max-w-[280px]">
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
import { inject, computed } from 'vue'
import { signOut } from 'firebase/auth'
import { auth } from '../firebase/config'
import { useRouter } from 'vue-router'
import type { Ref } from 'vue'
import type { User } from 'firebase/auth'

// Inject user from App.vue
const injectedUser = inject<Ref<User | null>>('currentUser')
const user = computed(() => injectedUser?.value ?? null)
const userEmail = computed(() => user.value?.email ?? '')
const isLoggedIn = computed(() => user.value !== null)

const router = useRouter()

const handleLogout = async () => {
  try {
    await signOut(auth)
    router.push('/login')
  } catch (err) {
    console.error('ログアウトエラー', err)
  }
}
</script>
