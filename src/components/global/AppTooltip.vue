<template>
  <div
    class="group relative inline-flex"
    @mouseenter="onEnter"
    @mouseleave="onLeave"
  >
    <slot />
    <Transition name="tooltip-fade">
      <span
        v-if="content && show"
        class="pointer-events-none absolute z-[100] whitespace-nowrap rounded-lg px-3 py-1.5 text-xs font-medium shadow-lg"
        :class="contentClasses"
        :data-placement="placement"
      >
        {{ content }}
      </span>
    </Transition>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useMediaQuery } from '@vueuse/core'

const props = withDefaults(
  defineProps<{
    content?: string
    placement?: 'top' | 'bottom' | 'start' | 'end'
    dark?: boolean
  }>(),
  {
    content: '',
    placement: 'top',
    dark: true,
  }
)

const disableOnMobile = useMediaQuery('(max-width: 767px)')

const show = ref(false)
let timeoutId: ReturnType<typeof setTimeout> | null = null

function onEnter() {
  if (disableOnMobile.value) return
  timeoutId = setTimeout(() => {
    show.value = true
  }, 200)
}

function onLeave() {
  if (timeoutId) {
    clearTimeout(timeoutId)
    timeoutId = null
  }
  show.value = false
}

const contentClasses = props.dark
  ? 'bg-secondary text-white ring-1 ring-white/10'
  : 'bg-surface text-text border border-border'
</script>

<style scoped>
[data-placement='top'] {
  bottom: calc(100% + 0.25rem);
  left: 50%;
  transform: translateX(-50%);
}

[data-placement='bottom'] {
  top: calc(100% + 0.25rem);
  left: 50%;
  transform: translateX(-50%);
}

[data-placement='start'] {
  right: calc(100% + 0.25rem);
  top: 50%;
  transform: translateY(-50%);
}

[data-placement='end'] {
  left: calc(100% + 0.25rem);
  top: 50%;
  transform: translateY(-50%);
}

.tooltip-fade-enter-active,
.tooltip-fade-leave-active {
  transition: opacity 0.15s ease;
}
.tooltip-fade-enter-from,
.tooltip-fade-leave-to {
  opacity: 0;
}
</style>
