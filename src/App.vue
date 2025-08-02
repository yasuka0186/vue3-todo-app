<template>
  <div v-if="isAuthReady" class="min-h-screen w-full bg-gray-50 pt-16">
    <MainNavbar />
    <main class="w-full max-w-lg mx-auto px-4 py-6">
      <RouterView />
    </main>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, provide } from 'vue'
import { auth } from './firebase/config'
import { onAuthStateChanged } from 'firebase/auth'
import type { User } from 'firebase/auth'
import MainNavbar from './components/MainNavbar.vue'

const user = ref<User | null>(null)
const isAuthReady = ref(false)

// ✅ Provide user globally
provide('currentUser', user)

onMounted(() => {
  onAuthStateChanged(auth, (currentUser) => {
    user.value = currentUser
    isAuthReady.value = true
  })
})
</script>

<style scoped>
header {
  line-height: 1.5;
  max-height: 100vh;
}

.logo {
  display: block;
  margin: 0 auto 2rem;
}

nav {
  width: 100%;
  font-size: 12px;
  text-align: center;
  margin-top: 2rem;
}

nav a.router-link-exact-active {
  color: var(--color-text);
}

nav a.router-link-exact-active:hover {
  background-color: transparent;
}

nav a {
  display: inline-block;
  padding: 0 1rem;
  border-left: 1px solid var(--color-border);
}

nav a:first-of-type {
  border: 0;
}

@media (min-width: 1024px) {
  header {
    display: flex;
    place-items: center;
    padding-right: calc(var(--section-gap) / 2);
  }

  .logo {
    margin: 0 2rem 0 0;
  }

  header .wrapper {
    display: flex;
    place-items: flex-start;
    flex-wrap: wrap;
  }

  nav {
    text-align: left;
    margin-left: -1rem;
    font-size: 1rem;

    padding: 1rem 0;
    margin-top: 1rem;
  }
}
</style>
