<template>
  <component :is="tag" class="vt-swap relative inline-flex items-center">
    <Transition :css="true" name="vt-swap" @before-leave="hide">
      <component :is="tag" :key="swapKey" class="inline-flex items-center">
        <slot />
      </component>
    </Transition>
  </component>
</template>

<script setup lang="ts">
  /**
   * AppSwap: content that changes (Save → Saving… → Saved, sun → moon, 3 → 4) cross-fades
   * through a blur instead of snapping, after Sileo's header (github.com/hiaaryan/sileo, MIT).
   * Change `swapKey` to swap. The leaving copy is out of flow and `aria-hidden`, so a button is
   * never named "Save Saving…" while both show. Reduced motion keeps the fade, drops the blur.
   */
  withDefaults(
    defineProps<{
      /** What the content is now. A new value swaps the old copy out and the new one in. */
      swapKey: string | number | boolean;
      /** Element for the wrapper and each copy. */
      tag?: string;
    }>(),
    { tag: 'span' },
  );

  const hide = (el: Element) => el.setAttribute('aria-hidden', 'true');
</script>

<style scoped>
  .vt-swap-enter-active {
    transition:
      opacity var(--vt-duration-enter) var(--vt-ease),
      filter var(--vt-duration-enter) var(--vt-ease);
  }
  .vt-swap-leave-active {
    position: absolute;
    inset-inline-start: 0;
    transition:
      opacity var(--vt-duration-exit) var(--vt-ease-exit),
      filter var(--vt-duration-exit) var(--vt-ease-exit);
  }
  .vt-swap-enter-from,
  .vt-swap-leave-to {
    opacity: 0;
    filter: blur(6px);
  }

  @media (prefers-reduced-motion: reduce) {
    .vt-swap-enter-from,
    .vt-swap-leave-to {
      filter: none;
    }
  }
</style>
