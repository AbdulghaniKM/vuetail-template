<template>
  <Teleport to="body">
    <div
      class="pointer-events-none fixed z-[10000] flex flex-col gap-2.5 p-4 sm:max-w-sm"
      :class="positionClass"
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
          :initial="motionConfig.initial"
          :animate="motionConfig.animate"
          :exit="motionConfig.exit"
          :transition="{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }"
          @mouseenter="emit('pause', toast.id)"
          @mouseleave="emit('resume', toast.id)"
          @focusin="emit('pause', toast.id)"
          @focusout="emit('resume', toast.id)"
        >
          <div class="flex items-start gap-3 px-4 py-3">
            <span
              class="mt-0.5 flex size-5 shrink-0 items-center justify-center rounded-full"
              :class="iconBgClass(toast.type)"
            >
              <AppIcon :name="toastIcon(toast.type)" :size="0.75" />
            </span>
            <div class="min-w-0 flex-1">
              <p v-if="toast.title" class="text-sm leading-snug font-semibold">{{ toast.title }}</p>
              <p class="text-sm leading-relaxed" :class="toast.title ? 'opacity-80' : ''">
                {{ toast.message }}
              </p>
            </div>
            <button
              type="button"
              class="mt-0.5 flex size-6 shrink-0 items-center justify-center rounded-lg opacity-60 transition-opacity hover:opacity-100"
              aria-label="Dismiss notification"
              @click="removeToast(toast.id)"
            >
              <AppIcon name="icon-[heroicons-outline--x-mark]" :size="0.875" />
            </button>
          </div>
          <div
            v-if="toast.duration && toast.duration > 0"
            class="h-0.5 origin-left"
            :class="progressClass(toast.type)"
            :style="{
              animation: `toast-progress ${toast.duration}ms linear forwards`,
              animationPlayState: toast.paused ? 'paused' : 'running',
            }"
          />
        </motion.div>
      </AnimatePresence>
    </div>
  </Teleport>
</template>

<script setup lang="ts">
  import { computed } from 'vue';
  import { AnimatePresence, motion } from 'motion-v';
  import type { Toast } from '@/composables/useToast';
  import AppIcon from './AppIcon.vue';

  export interface AppToastProps {
    toasts: Toast[];
    position?: 'top-right' | 'top-left' | 'bottom-right' | 'bottom-left';
  }

  const props = withDefaults(defineProps<AppToastProps>(), {
    position: 'top-right',
  });

  const emit = defineEmits<{
    remove: [id: string];
    pause: [id: string];
    resume: [id: string];
  }>();

  const removeToast = (id: string) => emit('remove', id);

  const positionClass = computed(() => {
    switch (props.position) {
      case 'top-left':
        return 'inset-x-0 top-0 items-start sm:inset-x-auto sm:start-4 sm:top-4';
      case 'top-right':
        return 'inset-x-0 top-0 items-end sm:inset-x-auto sm:end-4 sm:top-4';
      case 'bottom-left':
        return 'inset-x-0 bottom-0 items-start sm:inset-x-auto sm:start-4 sm:bottom-4';
      default:
        return 'inset-x-0 bottom-0 items-end sm:inset-x-auto sm:end-4 sm:bottom-4';
    }
  });

  const motionConfig = computed(() => {
    const isTop = props.position.startsWith('top');
    const yOffset = isTop ? -12 : 12;
    return {
      initial: { opacity: 0, y: yOffset, scale: 0.95 },
      animate: { opacity: 1, y: 0, scale: 1 },
      exit: { opacity: 0, y: isTop ? -8 : 8, scale: 0.95 },
    };
  });

  const containerClass = (type: Toast['type']) =>
    ({
      success: 'bg-surface border border-success/20 text-text',
      error: 'bg-surface border border-error/20 text-text',
      warning: 'bg-surface border border-warning/20 text-text',
      info: 'bg-surface border border-info/20 text-text',
    })[type];

  const iconBgClass = (type: Toast['type']) =>
    ({
      success: 'bg-success/15 text-success',
      error: 'bg-error/15 text-error',
      warning: 'bg-warning/15 text-warning',
      info: 'bg-info/15 text-info',
    })[type];

  const progressClass = (type: Toast['type']) =>
    ({
      success: 'bg-success/40',
      error: 'bg-error/40',
      warning: 'bg-warning/40',
      info: 'bg-info/40',
    })[type];

  const toastIcon = (type: Toast['type']) =>
    ({
      success: 'icon-[heroicons-outline--check-circle]',
      error: 'icon-[heroicons-outline--x-circle]',
      warning: 'icon-[heroicons--exclamation-triangle]',
      info: 'icon-[heroicons-outline--information-circle]',
    })[type];
</script>

<style scoped>
  @keyframes toast-progress {
    from {
      transform: scaleX(1);
    }
    to {
      transform: scaleX(0);
    }
  }
</style>
