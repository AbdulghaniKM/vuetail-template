<template>
  <Teleport to="body">
    <div class="pointer-events-none fixed top-4 right-4 z-[10000] flex flex-col gap-2">
      <AnimatePresence>
        <motion.div
          v-for="toast in toasts"
          :key="toast.id"
          class="pointer-events-auto flex max-w-md min-w-[20rem] items-start gap-3 rounded-lg px-4 py-3 shadow-lg backdrop-blur-sm"
          :class="toastClass(toast.type)"
          :initial="{ opacity: 0, x: '100%' }"
          :animate="{ opacity: 1, x: 0 }"
          :exit="{ opacity: 0, x: '100%' }"
          :transition="{ type: 'spring', stiffness: 400, damping: 30 }"
        >
          <AppIcon :name="toastIcon(toast.type)" :size="1" class="mt-0.5 flex-shrink-0" />

          <div class="min-w-0 flex-1">
            <p v-if="toast.title" class="mb-1 text-sm font-semibold">{{ toast.title }}</p>
            <p class="text-sm">{{ toast.message }}</p>
          </div>

          <button
            @click="removeToast(toast.id)"
            class="flex-shrink-0 text-current opacity-70 transition-opacity hover:opacity-100"
            aria-label="Close"
          >
            <AppIcon name="mdi:close" :size="1" />
          </button>
        </motion.div>
      </AnimatePresence>
    </div>
  </Teleport>
</template>

<script setup lang="ts">
import { AnimatePresence, motion } from 'motion-v'
import type { Toast } from '../../composables/useToast'
import AppIcon from './AppIcon.vue'

interface Props {
  toasts: Toast[]
}

const props = defineProps<Props>()

const emit = defineEmits<{
  remove: [id: string]
}>()

const toastClass = (type: Toast['type']) => {
  const classes = {
    success: 'bg-green-500/90 text-white',
    error: 'bg-red-500/90 text-white',
    warning: 'bg-yellow-500/90 text-white',
    info: 'bg-blue-500/90 text-white',
  }
  return classes[type]
}

const toastIcon = (type: Toast['type']) => {
  const icons = {
    success: 'mdi-check-circle',
    error: 'mdi-alert-circle',
    warning: 'mdi-alert',
    info: 'mdi-information',
  }
  return icons[type]
}

const removeToast = (id: string) => {
  emit('remove', id)
}
</script>
