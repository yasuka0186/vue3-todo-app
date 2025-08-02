<template>
  <div>
    <h1>ユーザー登録</h1>
    <form @submit.prevent="handleSignup">
      <input v-model="email" placeholder="メールアドレス" type="email" required />
      <input v-model="password" placeholder="パスワード" type="password" required />
      <button type="submit">登録</button>
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
