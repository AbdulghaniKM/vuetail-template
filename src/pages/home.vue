<template>
  <div class="flex min-h-screen flex-col items-center justify-center gap-6 bg-background px-4 text-center">
    <div class="flex size-16 items-center justify-center rounded-2xl bg-primary/10">
      <span class="text-3xl">⚡</span>
    </div>

    <div class="space-y-2">
      <h1 class="text-4xl font-extrabold tracking-tight text-text sm:text-5xl">
        VueTail
      </h1>
      <p class="mx-auto max-w-sm text-base text-text-secondary">
        Vue 3 + Tailwind v4 + TypeScript. Clean and ready to build.
      </p>
    </div>

    <div class="flex flex-wrap justify-center gap-2 text-xs text-text-secondary">
      <span class="rounded-full bg-muted px-3 py-1.5 font-medium">Vue 3</span>
      <span class="rounded-full bg-muted px-3 py-1.5 font-medium">Tailwind v4</span>
      <span class="rounded-full bg-muted px-3 py-1.5 font-medium">TypeScript</span>
      <span class="rounded-full bg-muted px-3 py-1.5 font-medium">Pinia</span>
      <span class="rounded-full bg-muted px-3 py-1.5 font-medium">Vue Router</span>
    </div>

    <div class="rounded-2xl border border-border bg-surface p-5 text-left">
      <p class="mb-3 text-xs font-semibold uppercase tracking-wider text-text-secondary">Add components on demand</p>
      <pre class="text-sm leading-relaxed text-text"><code><span class="text-success">$</span> pnpm add-component AppButton
<span class="text-success">$</span> pnpm add-component AppModal
<span class="text-success">$</span> pnpm add-composable useToast</code></pre>
    </div>
  </div>
</template>
