import { createRouter, createWebHistory } from 'vue-router'
import Signup from '../views/SignupForm.vue'
import Login from '../views/LoginForm.vue'
import TodoList from '../views/TodoList.vue'
import { auth } from '../firebase/config'
import { onAuthStateChanged } from 'firebase/auth'
import CompletedTodos from '../views/CompletedTodos.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/signup',
      name: 'Signup',
      component: Signup,
    },
    {
      path: '/login',
      name: 'Login',
      component: Login,
    },
    {
      path: '/',
      name: 'TodoList',
      component: TodoList,
      meta: { requiresAuth: true },
    },
    {
      path: '/completed',
      name: 'CompletedTodos',
      component: CompletedTodos,
      meta: { requiresAuth: true },
    },
  ],
})

// Firebase Auth の初期化が完了するまで currentUser を待つ
let isAuthChecked = false
const waitForAuth = new Promise((resolve) => {
  onAuthStateChanged(auth, () => {
    isAuthChecked = true
    resolve(true)
  })
})

// 認証ガード（beforeEach）
router.beforeEach(async (to, from, next) => {
  if (!isAuthChecked) {
    await waitForAuth
  }

  const currentUser = auth.currentUser
  const requiresAuth = to.matched.some((record) => record.meta.requiresAuth)

  if (requiresAuth && !currentUser) {
    next('/login')
  } else if (!requiresAuth && currentUser && to.path === '/login') {
    // ログイン済みでログイン画面にアクセスした場合、リダイレクト
    next('/')
  } else {
    next()
  }
})

export default router
