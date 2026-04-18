<template>
  <div class="mx-auto max-w-5xl p-6">
    <header class="mb-8">
      <h1 class="text-text text-2xl font-semibold">Theme studio</h1>
      <p class="text-text-secondary mt-1 text-sm">
        Dev-only. Live-preview brand / shape / theme combinations. Pick what you like, then write the
        result into <code class="bg-muted rounded px-1.5 py-0.5 text-xs">src/theme.ts</code>.
      </p>
    </header>

    <!-- Controls -->
    <section class="bg-surface border-border grid gap-6 rounded-2xl border p-5 sm:grid-cols-3">
      <div>
        <h2 class="text-text mb-3 text-sm font-semibold">Brand</h2>
        <div class="flex flex-wrap gap-2">
          <button
            v-for="b in brands"
            :key="b"
            type="button"
            class="rounded-lg border px-3 py-1.5 text-xs font-medium capitalize transition-colors"
            :class="brand === b
              ? 'border-primary bg-primary/10 text-primary'
              : 'border-border text-text-secondary hover:bg-muted'"
            @click="setBrand(b)"
          >
            {{ b }}
          </button>
        </div>
      </div>

      <div>
        <h2 class="text-text mb-3 text-sm font-semibold">Shape</h2>
        <div class="flex flex-wrap gap-2">
          <button
            v-for="s in shapes"
            :key="s"
            type="button"
            class="rounded-lg border px-3 py-1.5 text-xs font-medium capitalize transition-colors"
            :class="shape === s
              ? 'border-primary bg-primary/10 text-primary'
              : 'border-border text-text-secondary hover:bg-muted'"
            @click="setShape(s)"
          >
            {{ s }}
          </button>
        </div>
      </div>

      <div>
        <h2 class="text-text mb-3 text-sm font-semibold">Theme mode</h2>
        <div class="flex flex-wrap gap-2">
          <button
            v-for="m in ['system', 'light', 'dark'] as const"
            :key="m"
            type="button"
            class="rounded-lg border px-3 py-1.5 text-xs font-medium capitalize transition-colors"
            :class="mode === m
              ? 'border-primary bg-primary/10 text-primary'
              : 'border-border text-text-secondary hover:bg-muted'"
            @click="setTheme(m)"
          >
            {{ m }}
          </button>
        </div>
      </div>
    </section>

    <!-- Snippet -->
    <section class="mt-6">
      <h2 class="text-text mb-2 text-sm font-semibold">Paste into <code>src/theme.ts</code></h2>
      <pre class="bg-muted overflow-x-auto rounded-xl p-4 text-xs leading-relaxed"><code>export const theme: ThemeConfig = {
  brand: '{{ brand }}',
  shape: '{{ shape }}',
};</code></pre>
      <div class="mt-2 flex gap-2">
        <button
          type="button"
          class="bg-primary rounded-lg px-3 py-1.5 text-xs font-medium text-white transition-colors hover:bg-primary/90"
          @click="copy"
        >
          Copy snippet
        </button>
        <button
          type="button"
          class="border-border text-text-secondary rounded-lg border px-3 py-1.5 text-xs font-medium transition-colors hover:bg-muted"
          @click="reset"
        >
          Reset
        </button>
        <span v-if="copied" class="text-success self-center text-xs">Copied.</span>
      </div>
    </section>

    <!-- Gallery -->
    <section class="mt-8">
      <h2 class="text-text mb-3 text-sm font-semibold">Component gallery</h2>

      <div class="bg-surface border-border grid gap-6 rounded-2xl border p-5 sm:grid-cols-2">
        <!-- Buttons -->
        <div>
          <p class="text-text-secondary mb-2 text-xs font-medium uppercase tracking-wider">Buttons</p>
          <div class="flex flex-wrap gap-2">
            <button class="bg-primary rounded-lg px-4 py-2 text-sm font-medium text-white">Primary</button>
            <button class="bg-secondary rounded-lg px-4 py-2 text-sm font-medium text-white">Secondary</button>
            <button class="bg-muted text-text rounded-lg px-4 py-2 text-sm font-medium">Muted</button>
            <button class="border-border text-text rounded-lg border bg-transparent px-4 py-2 text-sm font-medium">Outline</button>
          </div>
        </div>

        <!-- Surface -->
        <div>
          <p class="text-text-secondary mb-2 text-xs font-medium uppercase tracking-wider">Surfaces</p>
          <div class="bg-surface border-border rounded-xl border p-4">
            <p class="text-text text-sm font-medium">Card title</p>
            <p class="text-text-secondary mt-0.5 text-xs">Body copy on a surface.</p>
            <a href="#" class="text-link hover:text-link-hover mt-2 inline-block text-xs">A link</a>
          </div>
        </div>

        <!-- States -->
        <div class="sm:col-span-2">
          <p class="text-text-secondary mb-2 text-xs font-medium uppercase tracking-wider">State colors</p>
          <div class="grid grid-cols-2 gap-2 sm:grid-cols-4">
            <div class="bg-success/10 text-success rounded-lg px-3 py-2 text-xs font-medium">Success</div>
            <div class="bg-warning/10 text-warning rounded-lg px-3 py-2 text-xs font-medium">Warning</div>
            <div class="bg-error/10 text-error rounded-lg px-3 py-2 text-xs font-medium">Error</div>
            <div class="bg-info/10 text-info rounded-lg px-3 py-2 text-xs font-medium">Info</div>
          </div>
        </div>

        <!-- Radius preview -->
        <div class="sm:col-span-2">
          <p class="text-text-secondary mb-2 text-xs font-medium uppercase tracking-wider">Radius scale (reflects shape)</p>
          <div class="flex items-end gap-3">
            <div class="bg-primary/20 size-12 rounded-sm" title="rounded-sm"></div>
            <div class="bg-primary/20 size-12 rounded-md" title="rounded-md"></div>
            <div class="bg-primary/20 size-12 rounded-lg" title="rounded-lg"></div>
            <div class="bg-primary/20 size-12 rounded-xl" title="rounded-xl"></div>
            <div class="bg-primary/20 size-12 rounded-2xl" title="rounded-2xl"></div>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { useAppUi } from '@/composables/useAppUi';
import { useTheme } from '@/composables/useTheme';

const { brand, shape, brands, shapes, setBrand, setShape, reset: resetUi } = useAppUi();
const { mode, setTheme } = useTheme();

const copied = ref(false);
const copy = async () => {
  const snippet = `export const theme: ThemeConfig = {\n  brand: '${brand.value}',\n  shape: '${shape.value}',\n};`;
  try {
    await navigator.clipboard.writeText(snippet);
    copied.value = true;
    setTimeout(() => (copied.value = false), 1500);
  } catch { /* ignore */ }
};

const reset = () => {
  resetUi();
  setTheme('system');
};
</script>
