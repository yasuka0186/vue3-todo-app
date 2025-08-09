<template>
  <transition name="fade">
    <div
      v-if="visible"
      class="fixed bottom-5 left-1/2 transform -translate-x-1/2 bg-green-500 text-white px-4 py-3 rounded shadow-lg z-50"
    >
      {{ message }}
    </div>
  </transition>
</template>

<script setup lang="ts">
import { ref } from 'vue'

const visible = ref(false)
const message = ref('')

const showToast = (text: string, duration = 3000) => {
  message.value = text
  visible.value = true
  setTimeout(() => {
    visible.value = false
  }, duration)
}

defineExpose<{ showToast: (text: string, duration?: number) => void }>({
  showToast,
})
</script>

<style scoped>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
