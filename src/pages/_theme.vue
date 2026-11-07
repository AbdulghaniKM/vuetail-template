<template>
  <div class="mx-auto max-w-5xl p-6">
    <header class="mb-8">
      <h1 class="font-display text-2xl font-semibold text-text">Theme studio</h1>
      <p class="mt-1 text-sm text-text-muted">
        Dev-only. Preview the presets and light/dark. The starting preset is set in
        <code class="rounded-sm bg-muted px-1.5 py-0.5 text-xs">src/theme.ts</code>
        and every value lives in
        <code class="rounded-sm bg-muted px-1.5 py-0.5 text-xs">src/styles/tokens.css</code>
      </p>
    </header>

    <!-- Controls -->
    <section class="grid gap-6 rounded-lg border border-border bg-surface p-5 sm:grid-cols-2">
      <div>
        <h2 class="mb-3 text-sm font-semibold text-text">Preset</h2>
        <div class="flex flex-wrap gap-2" role="radiogroup" aria-label="Preset">
          <button
            v-for="p in presets"
            :key="p"
            type="button"
            role="radio"
            :aria-checked="preset === p"
            :class="[chip, preset === p ? chipOn : chipOff]"
            @click="setPreset(p)"
          >
            {{ presetInfo[p].label }}
          </button>
        </div>
        <p class="mt-2 text-xs text-text-muted">{{ presetInfo[preset].description }}</p>
      </div>

      <div>
        <h2 class="mb-3 text-sm font-semibold text-text">Theme mode</h2>
        <div class="flex flex-wrap gap-2" role="radiogroup" aria-label="Theme mode">
          <button
            v-for="m in modes"
            :key="m"
            type="button"
            role="radio"
            :aria-checked="mode === m"
            :class="[chip, 'capitalize', mode === m ? chipOn : chipOff]"
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
        class="overflow-x-auto rounded-md bg-muted p-4 font-mono text-xs leading-relaxed text-text"
      ><code>export const theme: ThemeConfig = {
  preset: '{{ preset }}',
};</code></pre>
      <div class="mt-2 flex gap-2">
        <button type="button" :class="[btn, btnPrimary]" @click="copy">Copy snippet</button>
        <button type="button" :class="[btn, btnOutline]" @click="reset">Reset</button>
        <span v-if="copied" class="self-center text-xs text-success-text" role="status">
          Copied.
        </span>
      </div>
    </section>

    <!-- Controls on the tokens -->
    <section class="mt-8">
      <h2 class="mb-3 text-sm font-semibold text-text">Controls</h2>
      <div class="flex flex-wrap items-center gap-3 rounded-lg border border-border bg-surface p-5">
        <button type="button" :class="[btn, btnPrimary]">Primary</button>
        <button type="button" :class="[btn, btnOutline]">Outline</button>
        <button type="button" :class="[btn, 'text-text hover:bg-muted']">Ghost</button>
        <button type="button" :class="[btn, 'bg-danger text-danger-fg hover:bg-danger-hover']">
          Delete
        </button>
        <input
          type="text"
          placeholder="Text field"
          aria-label="Text field"
          class="h-control-md rounded-md border border-border-strong bg-surface px-3 text-control text-text placeholder:text-text-subtle focus-visible:border-ring"
        />
        <label class="flex items-center gap-2 text-control text-text">
          <input type="checkbox" class="size-4 accent-(--color-accent)" checked />
          Checkbox
        </label>
        <a href="#" class="text-control text-accent-text underline-offset-4 hover:underline">
          A link
        </a>
      </div>
    </section>

    <!-- Colour tokens -->
    <section class="mt-8">
      <h2 class="mb-3 text-sm font-semibold text-text">Colour tokens</h2>
      <div class="grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
        <div
          v-for="t in colorValues"
          :key="t.name"
          class="flex items-center gap-3 rounded-md border border-border bg-surface p-2"
        >
          <span
            class="size-9 shrink-0 rounded-sm border border-border"
            :style="{ backgroundColor: `var(--color-${t.name})` }"
          />
          <span class="min-w-0">
            <span class="block truncate font-mono text-xs text-text">{{ t.name }}</span>
            <span class="block truncate font-mono text-xs text-text-muted">{{ t.value }}</span>
          </span>
        </div>
      </div>
    </section>

    <!-- Type and radius -->
    <section class="mt-8 grid gap-6 sm:grid-cols-2">
      <div class="rounded-lg border border-border bg-surface p-5">
        <h2 class="mb-3 text-sm font-semibold text-text">Type</h2>
        <p class="font-display text-3xl font-semibold text-text">Display heading</p>
        <p class="mt-2 text-base text-text">Body text in --font-sans.</p>
        <p class="mt-1 text-sm text-text-muted">Muted secondary text.</p>
        <p class="mt-1 text-xs text-text-subtle">Subtle caption.</p>
        <p class="mt-2 font-mono text-sm text-text">const mono = '--font-mono';</p>
      </div>
      <div class="rounded-lg border border-border bg-surface p-5">
        <h2 class="mb-3 text-sm font-semibold text-text">Radius</h2>
        <div class="flex items-end gap-3">
          <div
            v-for="r in radii"
            :key="r"
            class="size-12 border border-border-strong bg-accent-subtle"
            :class="r"
            :title="r"
          />
        </div>
      </div>
    </section>
  </div>
</template>

<script setup lang="ts">
  import { nextTick, ref, watch } from 'vue';
  import { useAppUi } from '@/composables/useAppUi';
  import { useTheme } from '@/composables/useTheme';
  import { presetInfo } from '@/theme';

  const { preset, presets, setPreset, reset: resetUi } = useAppUi();
  const { theme, mode, setTheme } = useTheme();

  const modes = ['system', 'light', 'dark'] as const;
  const radii = ['rounded-sm', 'rounded-md', 'rounded-lg', 'rounded-xl', 'rounded-2xl'];

  const chip = 'rounded-md border px-3 py-1.5 text-xs font-medium transition-colors';
  const chipOn = 'border-accent bg-accent text-accent-fg';
  const chipOff = 'border-border-strong text-text-muted hover:bg-muted hover:text-text';
  const btn =
    'h-control-md px-control-pad text-control inline-flex items-center rounded-md font-medium transition-colors';
  const btnPrimary = 'bg-accent text-accent-fg hover:bg-accent-hover';
  const btnOutline = 'border-border-strong text-text hover:bg-muted border';

  const COLOR_TOKENS = [
    'bg',
    'surface',
    'surface-raised',
    'muted',
    'overlay',
    'border',
    'border-strong',
    'ring',
    'text',
    'text-muted',
    'text-subtle',
    'accent',
    'accent-hover',
    'accent-fg',
    'accent-subtle',
    'accent-text',
    'success',
    'success-subtle',
    'success-text',
    'warning',
    'warning-subtle',
    'warning-text',
    'danger',
    'danger-subtle',
    'danger-text',
    'info',
    'info-subtle',
    'info-text',
  ];

  // Resolved values for the active preset and theme, re-read after either changes.
  const colorValues = ref<{ name: string; value: string }[]>([]);
  const readColors = () => {
    const style = getComputedStyle(document.documentElement);
    colorValues.value = COLOR_TOKENS.map((name) => ({
      name,
      value: style.getPropertyValue(`--color-${name}`).trim(),
    }));
  };
  watch([preset, theme], () => nextTick(readColors), { immediate: true });

  const copied = ref(false);
  const copy = async () => {
    const snippet = `export const theme: ThemeConfig = {\n  preset: '${preset.value}',\n};`;
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
    setTheme('system');
  };
</script>
