<template>
  <nav class="fixed top-0 left-0 right-0 z-50 bg-gray-800 text-white shadow-md m-0 p-0">
    <!-- px をモバイルで狭く、sm 以上で従来通り -->
    <div class="flex items-center justify-between px-3 sm:px-6 h-16 w-full max-w-screen-xl mx-auto">
      <!-- 左：ロゴ（そのまま） -->
      <div class="text-xl font-bold whitespace-nowrap">TODOアプリ</div>

      <!-- 中央：タブ（モバイルは文字小さく＆間隔狭く、幅詰め・はみ出し対策） -->
      <div
        v-if="isLoggedIn"
        class="flex gap-3 sm:gap-6 text-xs sm:text-sm justify-center flex-1 min-w-0 overflow-x-auto"
      >
        <RouterLink
          to="/"
          class="hover:underline whitespace-nowrap"
          :class="{ 'font-bold text-blue-300 underline': $route.path === '/' }"
        >
          一覧
        </RouterLink>
        <RouterLink
          to="/completed"
          class="hover:underline whitespace-nowrap"
          :class="{ 'font-bold text-blue-300 underline': $route.path === '/completed' }"
        >
          完了
        </RouterLink>
      </div>

      <!-- 右：ログイン中のみ表示（モバイルはボタン小さめ＆gap を縮める） -->
      <div class="flex items-center gap-2 sm:gap-4 whitespace-nowrap shrink-0" v-if="isLoggedIn">
        <!-- モバイルでは非表示、sm 以上で従来通り -->
        <span class="hidden sm:inline text-sm break-words max-w-[280px]">
          {{ userEmail }} さん、ようこそ！
        </span>
        <!-- モバイルは小さめ、sm 以上は従来サイズ -->
        <button
          @click="handleLogout"
          class="bg-red-500 hover:bg-red-600 rounded text-xs px-2 py-1 sm:text-sm sm:px-3 sm:py-1"
        >
          ログアウト
        </button>
      </div>

      <!-- 未ログイン時の右側表示（同様にモバイルで小さめ） -->
      <div v-else class="flex items-center gap-2 sm:gap-4 whitespace-nowrap shrink-0">
        <RouterLink
          to="/login"
          class="bg-blue-500 hover:bg-blue-600 rounded text-xs px-2 py-1 sm:text-sm sm:px-3 sm:py-1"
        >
          ログイン
        </RouterLink>
        <RouterLink
          to="/signup"
          class="bg-green-500 hover:bg-green-600 rounded text-xs px-2 py-1 sm:text-sm sm:px-3 sm:py-1"
        >
          ユーザー登録
        </RouterLink>
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
