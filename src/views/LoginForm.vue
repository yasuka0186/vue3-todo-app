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
    <BaseToast ref="toastRef" />
  </div>
</template>
<script setup lang="ts">
import { ref } from 'vue'
import { signInWithEmailAndPassword } from 'firebase/auth'
import { auth } from '../firebase/config'
import { useRouter } from 'vue-router'
import BaseToast from '../components/BaseToast.vue'

const email = ref('')
const password = ref('')
const error = ref('')
const submitting = ref(false)
const router = useRouter()

type BaseToastExposed = {
  showToast: (text: string, type?: 'success' | 'error', duration?: number) => void
}
const toastRef = ref<BaseToastExposed | null>(null)

const handleLogin = async () => {
  error.value = ''
  try {
    await signInWithEmailAndPassword(auth, email.value, password.value)
    toastRef.value?.showToast('ログインに成功しました！', 'success')
    router.push('/')
  } catch (err) {
    console.error('ログインエラー：', err)
    toastRef.value?.showToast(
      'ログインに失敗しました。メールアドレスまたはパスワードが間違っています。',
      'error',
    )
  } finally {
    submitting.value = false
  }
}
</script>
