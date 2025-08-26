<template>
  <Teleport to="body">
    <div
      v-if="visible"
      :class="[
        'fixed bottom-6 left-1/2 transform -translate-x-1/2 px-4 py-2 rounded shadow-md text-white z-50',
        type === 'success' ? 'bg-green-500' : 'bg-red-500',
      ]"
    >
      {{ message }}
    </div>
  </Teleport>
</template>

<script setup lang="ts">
import { ref } from 'vue'

const visible = ref(false)
const message = ref('')
const type = ref<'success' | 'error'>('success')

const showToast = (text: string, toastType: 'success' | 'error' = 'success', duration = 3000) => {
  message.value = text
  type.value = toastType
  visible.value = true

  setTimeout(() => {
    visible.value = false
  }, duration)
}

defineExpose({ showToast })
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
