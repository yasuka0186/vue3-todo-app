<template>
  <div>
    <h1 class="text-2xl font-bold mb-4 text-gray-800">ユーザー登録</h1>
    <form @submit.prevent="handleSignup" class="flex flex-col sm:flex-row gap-2 w-full max-w-md">
      <input
        v-model="email"
        placeholder="Email"
        type="email"
        class="flex-1 border border-gray-300 rounded px-4 py-2"
        required
      />
      <input
        v-model="password"
        placeholder="Password"
        type="password"
        class="flex-1 border border-gray-300 rounded px-4 py-2"
        required
      />
      <button
        type="submit"
        class="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 whitespace-nowrap"
      >
        登録
      </button>
    </form>
    <p v-if="error">{{ error }}</p>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { createUserWithEmailAndPassword } from 'firebase/auth'
import { auth } from '../firebase/config'
import { useRouter } from 'vue-router'

const email = ref('')
const password = ref('')
const error = ref('')
const router = useRouter()

const handleSignup = async () => {
  error.value = ''
  try {
    await createUserWithEmailAndPassword(auth, email.value, password.value)
    router.push('/') // 登録成功後にトップページなどへリダイレクト
  } catch (err: unknown) {
    if (err instanceof Error) {
      error.value = err.message
    } else {
      error.value = '予期せぬエラーが発生しました'
    }
  }
}
</script>
