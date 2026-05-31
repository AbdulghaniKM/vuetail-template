<template>
  <div class="mx-auto max-w-5xl p-6">
    <header class="mb-8">
      <h1 class="text-2xl font-semibold text-text">Theme studio</h1>
      <p class="mt-1 text-sm text-text-secondary">
        Dev-only. Live-preview shape / theme mode. Colors come from
        <code class="rounded bg-muted px-1.5 py-0.5 text-xs">src/config/app.config.ts</code>
        .
      </p>
    </header>

    <!-- Controls -->
    <section class="grid gap-6 rounded-2xl border border-border bg-surface p-5 sm:grid-cols-2">
      <div>
        <h2 class="mb-3 text-sm font-semibold text-text">Shape</h2>
        <div class="flex flex-wrap gap-2">
          <button
            v-for="s in shapes"
            :key="s"
            type="button"
            class="rounded-lg border px-3 py-1.5 text-xs font-medium capitalize transition-colors"
            :class="
              shape === s
                ? 'border-primary bg-primary/10 text-primary'
                : 'border-border text-text-secondary hover:bg-muted'
            "
            @click="setShape(s)"
          >
            {{ s }}
          </button>
        </div>
      </div>

      <div>
        <h2 class="mb-3 text-sm font-semibold text-text">Theme mode</h2>
        <div class="flex flex-wrap gap-2">
          <button
            v-for="m in ['system', 'light', 'dark'] as const"
            :key="m"
            type="button"
            class="rounded-lg border px-3 py-1.5 text-xs font-medium capitalize transition-colors"
            :class="
              mode === m
                ? 'border-primary bg-primary/10 text-primary'
                : 'border-border text-text-secondary hover:bg-muted'
            "
            @click="setTheme(m)"
          >
            {{ m }}
          </button>
        </div>
      </div>
    </section>

    <!-- Snippet -->
    <section class="mt-6">
      <h2 class="mb-2 text-sm font-semibold text-text">
        Paste into
        <code>src/theme.ts</code>
      </h2>
      <pre
        class="overflow-x-auto rounded-xl bg-muted p-4 text-xs leading-relaxed"
      ><code>export const theme: UiThemeConfig = {
  shape: '{{ shape }}',
};</code></pre>
      <div class="mt-2 flex gap-2">
        <button
          type="button"
          class="rounded-lg bg-primary px-3 py-1.5 text-xs font-medium text-white transition-colors hover:bg-primary/90"
          @click="copy"
        >
          Copy snippet
        </button>
        <button
          type="button"
          class="rounded-lg border border-border px-3 py-1.5 text-xs font-medium text-text-secondary transition-colors hover:bg-muted"
          @click="reset"
        >
          Reset
        </button>
        <span v-if="copied" class="self-center text-xs text-success">Copied.</span>
      </div>
    </section>

    <!-- Gallery -->
    <section class="mt-8">
      <h2 class="mb-3 text-sm font-semibold text-text">Component gallery</h2>

      <div class="grid gap-6 rounded-2xl border border-border bg-surface p-5 sm:grid-cols-2">
        <!-- Buttons -->
        <div>
          <p class="mb-2 text-xs font-medium tracking-wider text-text-secondary uppercase">
            Buttons
          </p>
          <div class="flex flex-wrap gap-2">
            <button class="rounded-lg bg-primary px-4 py-2 text-sm font-medium text-white">
              Primary
            </button>
            <button class="rounded-lg bg-secondary px-4 py-2 text-sm font-medium text-white">
              Secondary
            </button>
            <button class="rounded-lg bg-muted px-4 py-2 text-sm font-medium text-text">
              Muted
            </button>
            <button
              class="rounded-lg border border-border bg-transparent px-4 py-2 text-sm font-medium text-text"
            >
              Outline
            </button>
          </div>
        </div>

        <!-- Surface -->
        <div>
          <p class="mb-2 text-xs font-medium tracking-wider text-text-secondary uppercase">
            Surfaces
          </p>
          <div class="rounded-xl border border-border bg-surface p-4">
            <p class="text-sm font-medium text-text">Card title</p>
            <p class="mt-0.5 text-xs text-text-secondary">Body copy on a surface.</p>
            <a href="#" class="mt-2 inline-block text-xs text-link hover:text-link-hover">A link</a>
          </div>
        </div>

        <!-- States -->
        <div class="sm:col-span-2">
          <p class="mb-2 text-xs font-medium tracking-wider text-text-secondary uppercase">
            State colors
          </p>
          <div class="grid grid-cols-2 gap-2 sm:grid-cols-4">
            <div class="rounded-lg bg-success/10 px-3 py-2 text-xs font-medium text-success">
              Success
            </div>
            <div class="rounded-lg bg-warning/10 px-3 py-2 text-xs font-medium text-warning">
              Warning
            </div>
            <div class="rounded-lg bg-error/10 px-3 py-2 text-xs font-medium text-error">Error</div>
            <div class="rounded-lg bg-info/10 px-3 py-2 text-xs font-medium text-info">Info</div>
          </div>
        </div>

        <!-- Radius preview -->
        <div class="sm:col-span-2">
          <p class="mb-2 text-xs font-medium tracking-wider text-text-secondary uppercase">
            Radius scale (reflects shape)
          </p>
          <div class="flex items-end gap-3">
            <div class="size-12 rounded-sm bg-primary/20" title="rounded-sm"></div>
            <div class="size-12 rounded-md bg-primary/20" title="rounded-md"></div>
            <div class="size-12 rounded-lg bg-primary/20" title="rounded-lg"></div>
            <div class="size-12 rounded-xl bg-primary/20" title="rounded-xl"></div>
            <div class="size-12 rounded-2xl bg-primary/20" title="rounded-2xl"></div>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>

<script setup lang="ts">
import { ref } from "vue";
import { useAppUi } from "@/composables/useAppUi";
import { useTheme } from "@/composables/useTheme";

const { shape, shapes, setShape, reset: resetUi } = useAppUi();
const { mode, setTheme } = useTheme();

const copied = ref(false);
const copy = async () => {
  const snippet = `export const theme: UiThemeConfig = {\n  shape: '${shape.value}',\n};`;
  try {
    await navigator.clipboard.writeText(snippet);
    copied.value = true;
    setTimeout(() => (copied.value = false), 1500);
  } catch {
    /* ignore */
  }
};

const reset = () => {
  resetUi();
  setTheme("system");
};
</script>
