<template>
  <div>
    <!-- ログイン見出し -->
    <h1 class="text-2xl font-bold mb-4 text-gray-800">ログイン</h1>

    <!-- フォーム -->
    <form @submit.prevent="handleLogin" class="flex flex-col sm:flex-row gap-2 w-full max-w-md">
      <input
        v-model="email"
        type="email"
        placeholder="Email"
        class="flex-1 border border-gray-300 rounded px-4 py-2"
        required
      />
      <input
        v-model="password"
        type="password"
        placeholder="Password"
        class="flex-1 border border-gray-300 rounded px-4 py-2"
        required
      />
      <button
        type="submit"
        class="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 whitespace-nowrap"
      >
        ログイン
      </button>
    </form>
  </div>
</template>
<script setup lang="ts">
import { ref } from 'vue'
import { signInWithEmailAndPassword } from 'firebase/auth'
import { auth } from '../firebase/config'
import { useRouter } from 'vue-router'

const email = ref('')
const password = ref('')
const error = ref('')
const router = useRouter()

const handleLogin = async () => {
  error.value = ''
  try {
    await signInWithEmailAndPassword(auth, email.value, password.value)
    router.push('/')
  } catch (err: unknown) {
    if (err instanceof Error) {
      error.value = err.message
    } else {
      error.value = '予期せぬエラーが発生しました'
    }
  }
}
</script>
