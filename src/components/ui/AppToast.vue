<template>
  <Teleport to="body">
    <div
      class="pointer-events-none fixed z-[10000] flex flex-col gap-2.5 p-4 sm:max-w-sm"
      :class="positionClass"
      role="region"
      aria-label="Notifications"
    >
      <AnimatePresence>
        <motion.div
          v-for="toast in toasts"
          :key="toast.id"
          class="pointer-events-auto relative w-full overflow-hidden rounded-lg border border-border bg-surface-raised text-text shadow-lg sm:max-w-sm"
          :class="containerClass(toast.type)"
          :initial="motionConfig.initial"
          :animate="motionConfig.animate"
          :exit="motionConfig.exit"
          :transition="enter()"
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
              <p class="text-sm leading-relaxed" :class="toast.title ? 'text-text-muted' : ''">
                {{ toast.message }}
              </p>
            </div>
            <button
              v-if="toast.action"
              type="button"
              class="-my-0.5 shrink-0 rounded-md px-2 py-1 text-sm font-medium text-accent-text transition-colors hover:bg-muted"
              @click="runAction(toast)"
            >
              {{ toast.action.label }}
            </button>
            <button
              type="button"
              class="mt-0.5 flex size-6 shrink-0 items-center justify-center rounded-sm text-text-muted transition-colors hover:bg-muted hover:text-text"
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
  import { computed, watch } from 'vue';
  import { AnimatePresence, motion } from 'motion-v';
  import type { Toast } from '@/composables/useToast';
  import AppIcon from './AppIcon.vue';
  import { useMotionTokens } from '@/composables/useMotionTokens';
  import { useReducedMotion } from '@/composables/useReducedMotion';
  import { useAnnouncer } from '@/composables/useAnnouncer';

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

  // Toasts are announced through the shared live regions, not by making the stack live: a toast
  // that closes cannot cut its own message short, and nothing is read twice. Errors interrupt;
  // everything else waits. A changed toast (promise() turning into its outcome) is read again.
  const { announce } = useAnnouncer();
  const spoken = new Map<string, string>();
  watch(
    () => props.toasts.map((t) => [t.id, t.type, t.title ?? '', t.message] as const),
    (list) => {
      const live = new Set<string>();
      for (const [id, type, title, message] of list) {
        live.add(id);
        const text = title ? `${title}. ${message}` : message;
        if (spoken.get(id) === `${type}|${text}`) continue;
        spoken.set(id, `${type}|${text}`);
        announce(text, type === 'error' ? 'assertive' : 'polite');
      }
      for (const id of spoken.keys()) if (!live.has(id)) spoken.delete(id);
    },
    { immediate: true },
  );
  // The action runs, then the toast closes: an Undo that leaves "Deleted" on screen reads as failed.
  const runAction = (toast: Toast) => {
    toast.action?.onClick();
    removeToast(toast.id);
  };

  const { enter, exit } = useMotionTokens();
  const reduced = useReducedMotion();

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
    // Reduced motion keeps the fade (it aids comprehension) and drops the slide/scale.
    if (reduced.value) {
      return {
        initial: { opacity: 0 },
        animate: { opacity: 1 },
        exit: { opacity: 0, transition: exit() },
      };
    }
    const yOffset = isTop ? -12 : 12;
    const exitOffset = isTop ? -8 : 8;
    return {
      initial: { opacity: 0, y: yOffset, scale: 0.95 },
      animate: { opacity: 1, y: 0, scale: 1 },
      exit: { opacity: 0, y: exitOffset, scale: 0.95, transition: exit() },
    };
  });

  const containerClass = (type: Toast['type']) =>
    ({
      // Status shows in the icon and the progress bar; the card itself stays neutral.
      success: '',
      error: '',
      warning: '',
      info: '',
    })[type];

  const iconBgClass = (type: Toast['type']) =>
    ({
      success: 'bg-success-subtle text-success-text',
      error: 'bg-danger-subtle text-danger-text',
      warning: 'bg-warning-subtle text-warning-text',
      info: 'bg-info-subtle text-info-text',
    })[type];

  const progressClass = (type: Toast['type']) =>
    ({
      success: 'bg-success',
      error: 'bg-danger',
      warning: 'bg-warning',
      info: 'bg-info',
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
