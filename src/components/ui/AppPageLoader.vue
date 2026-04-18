<template>
  <div
    v-if="active"
    class="fixed top-0 inset-x-0 z-[10001] h-0.5 bg-primary/20 pointer-events-none"
    role="progressbar"
    aria-label="Loading"
    :aria-valuenow="Math.round(progress * 100)"
    aria-valuemin="0"
    aria-valuemax="100"
  >
    <div
      class="h-full bg-primary transition-[width,opacity] duration-200 ease-out"
      :style="{ width: `${progress * 100}%`, opacity: fading ? 0 : 1 }"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, onUnmounted } from 'vue';

/**
 * Top-of-page progress bar. Call `start()` on route change,
 * `done()` when the route settles.
 *
 * Example (in router/index.ts):
 *   router.beforeEach((to, from, next) => { pageLoader.start(); next() })
 *   router.afterEach(() => pageLoader.done())
 */
const active = ref(false);
const progress = ref(0);
const fading = ref(false);
let trickleTimer: ReturnType<typeof setInterval> | null = null;
let fadeTimer: ReturnType<typeof setTimeout> | null = null;

const start = () => {
  if (fadeTimer) { clearTimeout(fadeTimer); fadeTimer = null; }
  active.value = true;
  fading.value = false;
  progress.value = 0.1;
  if (trickleTimer) clearInterval(trickleTimer);
  trickleTimer = setInterval(() => {
    if (progress.value < 0.9) progress.value += (0.9 - progress.value) * 0.15;
  }, 200);
};

const done = () => {
  if (trickleTimer) { clearInterval(trickleTimer); trickleTimer = null; }
  progress.value = 1;
  fading.value = true;
  fadeTimer = setTimeout(() => {
    active.value = false;
    progress.value = 0;
    fading.value = false;
  }, 250);
};

onUnmounted(() => {
  if (trickleTimer) clearInterval(trickleTimer);
  if (fadeTimer) clearTimeout(fadeTimer);
});

defineExpose({ start, done });
</script>
