<template>
  <div
    class="group relative inline-flex"
    @mouseenter="onEnter"
    @mouseleave="onLeave"
    @focusin="onEnter"
    @focusout="onLeave"
  >
    <slot />
    <Transition
      enter-active-class="transition duration-150 ease-out"
      enter-from-class="opacity-0 scale-95"
      enter-to-class="opacity-100 scale-100"
      leave-active-class="transition duration-100 ease-in"
      leave-from-class="opacity-100 scale-100"
      leave-to-class="opacity-0 scale-95"
    >
      <span
        v-if="content && show"
        role="tooltip"
        class="pointer-events-none absolute z-[9990] max-w-xs whitespace-normal rounded-lg px-3 py-1.5 text-xs font-medium leading-snug shadow-lg"
        :class="[themeClass, placementClass]"
      >
        {{ content }}
        <!-- Arrow -->
        <span class="absolute size-2 rotate-45" :class="[arrowClass, arrowPositionClass]" />
      </span>
    </Transition>
  </div>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'
import { useMediaQuery } from '@vueuse/core'

const props = withDefaults(
  defineProps<{
    content?: string
    placement?: 'top' | 'bottom' | 'start' | 'end'
    dark?: boolean
    delay?: number
  }>(),
  {
    content: '',
    placement: 'top',
    dark: true,
    delay: 200,
  }
)

const disableOnMobile = useMediaQuery('(max-width: 767px)')
const show = ref(false)
let timeoutId: ReturnType<typeof setTimeout> | null = null

function onEnter() {
  if (disableOnMobile.value) return
  timeoutId = setTimeout(() => { show.value = true }, props.delay)
}

function onLeave() {
  if (timeoutId) { clearTimeout(timeoutId); timeoutId = null }
  show.value = false
}

const themeClass = computed(() =>
  props.dark
    ? 'bg-[#1e293b] text-white ring-1 ring-white/10'
    : 'bg-surface text-text border border-border shadow-md'
)

const arrowClass = computed(() =>
  props.dark
    ? 'bg-[#1e293b]'
    : 'bg-surface border border-border'
)

const placementClass = computed(() => ({
  top: 'bottom-full left-1/2 -translate-x-1/2 mb-2',
  bottom: 'top-full left-1/2 -translate-x-1/2 mt-2',
  start: 'end-full top-1/2 -translate-y-1/2 me-2',
  end: 'start-full top-1/2 -translate-y-1/2 ms-2',
})[props.placement])

const arrowPositionClass = computed(() => ({
  top: 'bottom-[-0.25rem] left-1/2 -translate-x-1/2 border-t-0 border-s-0',
  bottom: 'top-[-0.25rem] left-1/2 -translate-x-1/2 border-b-0 border-e-0',
  start: 'end-[-0.25rem] top-1/2 -translate-y-1/2 border-b-0 border-s-0',
  end: 'start-[-0.25rem] top-1/2 -translate-y-1/2 border-t-0 border-e-0',
})[props.placement])
</script>
