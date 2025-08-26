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
        autocomplete="email"
      />
      <input
        v-model="password"
        placeholder="Password"
        type="password"
        class="flex-1 border border-gray-300 rounded px-4 py-2"
        required
        autocomplete="new-password"
      />
      <button
        type="submit"
        class="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 whitespace-nowrap"
        :disabled="submitting || !email || !password"
      >
        {{ submitting ? '登録中…' : '登録' }}
      </button>
    </form>
    <!-- コンポーネント名を合わせる -->
    <SignupToast ref="toastRef" />
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { createUserWithEmailAndPassword } from 'firebase/auth'
import { auth } from '../firebase/config'
import SignupToast from '../components/SignupToast.vue'

// 子が expose したシグネチャと一致させる
type SignupToastExposed = {
  showToast: (text: string, type?: 'success' | 'error', duration?: number) => void
}
const toastRef = ref<SignupToastExposed | null>(null)

const email = ref('')
const password = ref('')
const submitting = ref(false)
const router = useRouter()

const handleSignup = async () => {
  if (submitting.value) return
  submitting.value = true
  try {
    await createUserWithEmailAndPassword(auth, email.value, password.value)

    // ここでもうエラーは出なくなる
    toastRef.value?.showToast('ユーザー登録が完了しました！', 'success')

    // トーストが見えるように少し待ってから遷移（任意）
    setTimeout(() => router.push('/'), 600)
  } catch (err) {
    console.error('ユーザー登録エラー：', err)
    toastRef.value?.showToast('登録に失敗しました', 'error')
  } finally {
    submitting.value = false
  }
}
</script>
