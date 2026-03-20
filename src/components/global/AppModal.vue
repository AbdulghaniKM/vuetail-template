<template>
  <Teleport to="body">
    <AnimatePresence>
      <motion.div
        v-if="isOpen"
        key="modal-backdrop"
        class="fixed inset-0 z-[9999] flex p-4"
        :class="[
          verticalAlign === 'center' ? 'items-center' : 'items-start pt-[10vh]',
          'justify-center',
        ]"
        :initial="{ opacity: 0 }"
        :animate="{ opacity: 1 }"
        :exit="{ opacity: 0 }"
        :transition="{ duration: 0.2 }"
      >
        <!-- Backdrop -->
        <motion.div
          class="absolute inset-0 bg-black/50 backdrop-blur-sm"
          :initial="{ opacity: 0 }"
          :animate="{ opacity: 1 }"
          :exit="{ opacity: 0 }"
          @click="handleBackdropClick"
        />

        <!-- Panel -->
        <motion.div
          ref="panelRef"
          key="modal-panel"
          role="dialog"
          aria-modal="true"
          :aria-label="title || undefined"
          class="relative flex w-full flex-col overflow-hidden rounded-2xl border shadow-2xl"
          :class="[
            maxWidthClass,
            fullscreen
              ? 'h-full max-h-full rounded-none border-0'
              : 'max-h-[85vh]',
            'border-border bg-surface text-text shadow-black/10',
          ]"
          :initial="{ opacity: 0, scale: 0.95, y: 16 }"
          :animate="{ opacity: 1, scale: 1, y: 0 }"
          :exit="{ opacity: 0, scale: 0.97, y: 8 }"
          :transition="{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }"
        >
          <!-- Loading overlay -->
          <Transition
            enter-active-class="transition-opacity duration-200"
            enter-from-class="opacity-0"
            enter-to-class="opacity-100"
            leave-active-class="transition-opacity duration-150"
            leave-from-class="opacity-100"
            leave-to-class="opacity-0"
          >
            <div
              v-if="loading"
              class="absolute inset-0 z-20 flex items-center justify-center rounded-2xl bg-surface/80 backdrop-blur-[2px]"
            >
              <div class="flex flex-col items-center gap-3">
                <div class="border-primary/30 border-t-primary size-8 animate-spin rounded-full border-[2.5px]" />
                <span v-if="loadingText" class="text-text-secondary text-sm font-medium">{{ loadingText }}</span>
              </div>
            </div>
          </Transition>

          <!-- Top accent line -->
          <div class="from-primary via-secondary/60 to-accent/40 absolute inset-x-0 top-0 z-10 h-[2px] bg-gradient-to-r" />

          <!-- Header -->
          <div
            v-if="title || icon || $slots.header"
            class="border-border relative flex shrink-0 items-start justify-between gap-4 border-b px-6 pb-4 pt-5"
          >
            <slot name="header">
              <div class="flex items-start gap-3">
                <!-- Optional icon -->
                <div
                  v-if="icon"
                  class="bg-primary/10 mt-0.5 flex size-9 shrink-0 items-center justify-center rounded-xl"
                >
                  <AppIcon :name="icon" :size="1.125" class="text-primary" />
                </div>
                <div class="min-w-0">
                  <h3 class="text-text text-base font-semibold leading-snug">{{ title }}</h3>
                  <p v-if="description" class="text-text-secondary mt-0.5 text-sm leading-relaxed">{{ description }}</p>
                </div>
              </div>
            </slot>
            <button
              v-if="!hideClose"
              type="button"
              class="text-text-secondary hover:bg-muted hover:text-text focus-visible:ring-primary/40 -me-1 -mt-0.5 flex size-8 shrink-0 items-center justify-center rounded-lg transition-all focus-visible:ring-2 focus-visible:outline-none active:scale-90"
              @click="handleClose"
              :aria-label="closeLabel"
            >
              <AppIcon name="icon-[heroicons-outline--x-mark]" :size="1.125" />
            </button>
          </div>

          <!-- Body -->
          <div class="min-h-0 flex-1 overflow-y-auto">
            <slot />
          </div>

          <!-- Footer -->
          <div
            v-if="$slots.footer"
            class="border-border bg-muted/30 shrink-0 border-t px-6 py-3.5"
          >
            <slot name="footer" />
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  </Teleport>
</template>

<script setup lang="ts">
import { computed, watch, onUnmounted, ref } from 'vue'
import { motion, AnimatePresence } from 'motion-v'
import AppIcon from './AppIcon.vue'

const props = withDefaults(
  defineProps<{
    /** Controls modal visibility */
    isOpen: boolean
    /** Header title text */
    title?: string
    /** Optional description below the title */
    description?: string
    /** Optional icon displayed before the title (Iconify class) */
    icon?: string
    /** Max width preset */
    maxWidth?: 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl' | 'full'
    /** Aria label for the close button */
    closeLabel?: string
    /** Prevent closing via backdrop click or Escape key */
    persistent?: boolean
    /** Hide the close (X) button */
    hideClose?: boolean
    /** Full-screen mode — overrides maxWidth */
    fullscreen?: boolean
    /** Show a loading overlay that blocks interaction */
    loading?: boolean
    /** Optional text displayed below the loading spinner */
    loadingText?: string
    /** Vertical alignment: 'center' or 'top' */
    verticalAlign?: 'center' | 'top'
  }>(),
  {
    title: '',
    description: '',
    icon: '',
    maxWidth: '2xl',
    closeLabel: 'Close',
    persistent: false,
    hideClose: false,
    fullscreen: false,
    loading: false,
    loadingText: '',
    verticalAlign: 'center',
  }
)

const emit = defineEmits<{ close: [] }>()
const panelRef = ref<HTMLElement | null>(null)

function handleClose() {
  if (props.loading) return
  emit('close')
}

function handleBackdropClick() {
  if (!props.persistent) {
    handleClose()
  }
}

function handleKeydown(e: KeyboardEvent) {
  if (e.key === 'Escape' && !props.persistent && !props.loading) {
    handleClose()
  }
}

// Body scroll lock + keyboard listener
watch(
  () => props.isOpen,
  (open) => {
    if (open) {
      document.body.style.overflow = 'hidden'
      document.addEventListener('keydown', handleKeydown)
    } else {
      document.body.style.overflow = ''
      document.removeEventListener('keydown', handleKeydown)
    }
  },
  { immediate: true }
)

onUnmounted(() => {
  document.body.style.overflow = ''
  document.removeEventListener('keydown', handleKeydown)
})

const maxWidthClass = computed(() => {
  if (props.fullscreen) return 'max-w-none'
  const map = {
    xs: 'max-w-xs',
    sm: 'max-w-sm',
    md: 'max-w-md',
    lg: 'max-w-lg',
    xl: 'max-w-xl',
    '2xl': 'max-w-2xl',
    full: 'max-w-full',
  }
  return map[props.maxWidth]
})
</script>
