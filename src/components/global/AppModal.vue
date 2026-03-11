<template>
  <Teleport to="body">
    <AnimatePresence>
      <motion.div
        v-if="isOpen"
        key="modal-backdrop"
        class="fixed inset-0 z-[9999] flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm"
        :initial="{ opacity: 0 }"
        :animate="{ opacity: 1 }"
        :exit="{ opacity: 0 }"
        :transition="{ duration: 0.22 }"
        @click.self="handleClose"
      >
        <motion.div
          key="modal-panel"
          class="border-border bg-surface text-text relative flex max-h-[90vh] w-full flex-col overflow-hidden rounded-2xl border shadow-2xl shadow-black/15"
          :class="maxWidthClass"
          :initial="{ opacity: 0, scale: 0.96, y: 14 }"
          :animate="{ opacity: 1, scale: 1, y: 0 }"
          :exit="{ opacity: 0, scale: 0.96, y: 14 }"
          :transition="{ duration: 0.28, ease: [0.32, 0.72, 0, 1] }"
        >
          <!-- Top accent gradient bar -->
          <div class="from-primary/70 via-primary to-accent/60 absolute inset-x-0 top-0 h-0.5 rounded-t-2xl bg-gradient-to-r" />

          <!-- Header -->
          <div class="border-border flex shrink-0 items-center justify-between border-b px-5 py-3.5 pt-4">
            <div class="flex items-center gap-2.5">
              <span class="bg-primary size-1.5 rounded-full" />
              <h3 class="text-base font-semibold">{{ title }}</h3>
            </div>
            <button
              type="button"
              class="text-text-secondary hover:bg-muted hover:text-text -me-1 flex size-8 items-center justify-center rounded-lg transition-all active:scale-90"
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

          <!-- Optional footer slot -->
          <div v-if="$slots.footer" class="border-border bg-muted/40 shrink-0 border-t px-5 py-3">
            <slot name="footer" />
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  </Teleport>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { motion, AnimatePresence } from 'motion-v'
import AppIcon from './AppIcon.vue'

const props = withDefaults(
  defineProps<{
    isOpen: boolean
    title?: string
    maxWidth?: 'sm' | 'md' | 'lg' | 'xl' | '2xl'
    closeLabel?: string
  }>(),
  {
    title: '',
    maxWidth: '2xl',
    closeLabel: 'Close',
  }
)

const emit = defineEmits<{ close: [] }>()

const maxWidthClass = computed(() => {
  const map = { sm: 'max-w-sm', md: 'max-w-md', lg: 'max-w-lg', xl: 'max-w-xl', '2xl': 'max-w-2xl' }
  return map[props.maxWidth]
})

function handleClose() {
  emit('close')
}
</script>
