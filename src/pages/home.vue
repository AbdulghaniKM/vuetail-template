<template>
  <div
    class="bg-background flex min-h-screen flex-col items-center justify-center gap-6 px-4 text-center"
  >
    <div class="bg-primary/10 flex size-16 items-center justify-center rounded-2xl">
      <AppIcon name="icon-[logos--vue]" class="size-8" />
    </div>

    <div class="space-y-2">
      <h1 class="text-text text-4xl font-extrabold tracking-tight sm:text-5xl">VueTail</h1>
      <p class="text-text-secondary mx-auto max-w-sm text-base">
        Vue 3 + Tailwind v4 + TypeScript. Clean and ready to build.
      </p>
    </div>

    <div class="text-text-secondary flex flex-wrap justify-center gap-2 text-xs">
      <span class="bg-muted rounded-full px-3 py-1.5 font-medium">Vue 3</span>
      <span class="bg-muted rounded-full px-3 py-1.5 font-medium">Tailwind v4</span>
      <span class="bg-muted rounded-full px-3 py-1.5 font-medium">TypeScript</span>
      <span class="bg-muted rounded-full px-3 py-1.5 font-medium">Pinia</span>
      <span class="bg-muted rounded-full px-3 py-1.5 font-medium">Vue Router</span>
    </div>

    <div class="border-border bg-surface rounded-2xl border p-5 text-left">
      <p class="text-text-secondary mb-3 text-xs font-semibold tracking-wider uppercase">
        Add components on demand
      </p>
      <pre
        class="text-text text-sm leading-relaxed"
      ><code><span class="text-success">$</span> pnpm add-component AppButton
<span class="text-success">$</span> pnpm add-component AppModal
<span class="text-success">$</span> pnpm add-composable useToast</code></pre>
    </div>
  </div>
</template>
<script setup lang="ts">
  import AppIcon from '@/components/ui/AppIcon.vue';
</script>
