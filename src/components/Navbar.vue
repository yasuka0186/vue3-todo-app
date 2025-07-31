<template>
  <nav>
    <router-link to="/">Home</router-link>
    <router-link to="/login" v-if="!user">ログイン</router-link>
    <router-link to="/signup" v-if="!user">新規登録</router-link>
    <button v-if="user" @click="handleLogout">ログアウト</button>
  </nav>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { auth } from '../firebase/config'
import { onAuthStateChanged, signOut } from 'firebase/auth'
import { useRouter } from 'vue-router'

const user = ref()
const router = useRouter()

// ログイン状態を監視
onMounted(() => {
  onAuthStateChanged(auth, (currentUser) => {
    console.log('ログインユーザ：', currentUser)
    user.value = currentUser
  })
})

const handleLogout = async () => {
  try {
    await signOut(auth)
    user.value = null
    router.push('/login')
  } catch (err: unknown) {
    console.error('ログアウトエラー', err)
  }
}
</script>
