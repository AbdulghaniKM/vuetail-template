<template>
  <Teleport to="body">
    <div
      class="pointer-events-none fixed inset-x-0 top-0 z-[10000] flex flex-col items-end gap-2.5 p-4 sm:inset-x-auto sm:end-4 sm:top-4"
      role="log"
      aria-live="polite"
      aria-label="Notifications"
    >
      <AnimatePresence>
        <motion.div
          v-for="toast in toasts"
          :key="toast.id"
          class="pointer-events-auto relative w-full overflow-hidden rounded-xl shadow-lg sm:max-w-sm"
          :class="containerClass(toast.type)"
          role="alert"
          :initial="{ opacity: 0, y: -12, scale: 0.95 }"
          :animate="{ opacity: 1, y: 0, scale: 1 }"
          :exit="{ opacity: 0, y: -8, scale: 0.95 }"
          :transition="{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }"
          @mouseenter="emit('pause', toast.id)"
          @mouseleave="emit('resume', toast.id)"
          @focusin="emit('pause', toast.id)"
          @focusout="emit('resume', toast.id)"
        >
          <div class="flex items-start gap-3 px-4 py-3">
            <!-- Icon -->
            <span class="mt-0.5 flex size-5 shrink-0 items-center justify-center rounded-full" :class="iconBgClass(toast.type)">
              <AppIcon :name="toastIcon(toast.type)" :size="0.75" />
            </span>

            <!-- Content -->
            <div class="min-w-0 flex-1">
              <p v-if="toast.title" class="text-sm font-semibold leading-snug">{{ toast.title }}</p>
              <p class="text-sm leading-relaxed" :class="toast.title ? 'opacity-80' : ''">{{ toast.message }}</p>
            </div>

            <!-- Close -->
            <button
              type="button"
              class="mt-0.5 flex size-6 shrink-0 items-center justify-center rounded-lg opacity-60 transition-opacity hover:opacity-100"
              aria-label="Dismiss notification"
              @click="removeToast(toast.id)"
            >
              <AppIcon name="icon-[heroicons-outline--x-mark]" :size="0.875" />
            </button>
          </div>

          <!-- Progress bar -->
          <div
            v-if="toast.duration && toast.duration > 0"
            class="h-0.5 origin-left"
            :class="progressClass(toast.type)"
            :style="{ animation: `toast-progress ${toast.duration}ms linear forwards` }"
          />
        </motion.div>
      </AnimatePresence>
    </div>
  </Teleport>
</template>

<script setup lang="ts">
import { AnimatePresence, motion } from 'motion-v'
import type { Toast } from '@/composables/useToast'
import AppIcon from './AppIcon.vue'

defineProps<{ toasts: Toast[] }>()

const emit = defineEmits<{
  remove: [id: string]
  pause: [id: string]
  resume: [id: string]
}>()
const removeToast = (id: string) => emit('remove', id)

const containerClass = (type: Toast['type']) => ({
  success: 'bg-surface border border-success/20 text-text',
  error: 'bg-surface border border-error/20 text-text',
  warning: 'bg-surface border border-warning/20 text-text',
  info: 'bg-surface border border-info/20 text-text',
})[type]

const iconBgClass = (type: Toast['type']) => ({
  success: 'bg-success/15 text-success',
  error: 'bg-error/15 text-error',
  warning: 'bg-warning/15 text-warning',
  info: 'bg-info/15 text-info',
})[type]

const progressClass = (type: Toast['type']) => ({
  success: 'bg-success/40',
  error: 'bg-error/40',
  warning: 'bg-warning/40',
  info: 'bg-info/40',
})[type]

const toastIcon = (type: Toast['type']) => ({
  success: 'icon-[heroicons-outline--check-circle]',
  error: 'icon-[heroicons-outline--x-circle]',
  warning: 'icon-[heroicons--exclamation-triangle]',
  info: 'icon-[heroicons-outline--information-circle]',
})[type]
</script>

<style scoped>
@keyframes toast-progress {
  from { transform: scaleX(1); }
  to { transform: scaleX(0); }
}
</style>
