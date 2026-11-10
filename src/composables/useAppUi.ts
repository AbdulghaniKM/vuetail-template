import { ref, watch, type Ref } from 'vue';
import { theme as defaultTheme, presetFonts, type Preset } from '@/theme';

/**
 * Switches the app between the VueTail presets defined in styles/tokens.css.
 *
 * Ink is the default and carries no attribute, so a page with no `data-vt-preset` is Ink and
 * nothing flashes before this module runs. Pine and Console set `<html data-vt-preset="…">`,
 * which swaps colours, radius, density and fonts in one step. Light and dark stay with
 * useTheme: they are a separate axis.
 */

const PRESET_KEY = 'app-preset';
const ATTR = 'data-vt-preset';
const PRESETS: readonly Preset[] = ['ink', 'pine', 'console'] as const;

const isPreset = (v: string | null): v is Preset => v !== null && (PRESETS as readonly string[]).includes(v);

const readStored = (): Preset | null => {
  if (typeof localStorage === 'undefined') return null;
  try {
    const raw = localStorage.getItem(PRESET_KEY);
    return isPreset(raw) ? raw : null;
  } catch {
    return null;
  }
};

const writeStored = (value: Preset | null): void => {
  if (typeof localStorage === 'undefined') return;
  try {
    if (value === null) localStorage.removeItem(PRESET_KEY);
    else localStorage.setItem(PRESET_KEY, value);
  } catch { /* storage unavailable: the choice lasts for this page only */ }
};

const applyPreset = (value: Preset): void => {
  if (typeof document === 'undefined') return;
  if (value === 'ink') document.documentElement.removeAttribute(ATTR);
  else document.documentElement.setAttribute(ATTR, value);
  // A preset's faces load on first use; the default preset's ship with the app.
  void presetFonts[value]?.();
};

const preset: Ref<Preset> = ref(readStored() ?? defaultTheme.preset);
applyPreset(preset.value);

watch(preset, (v) => {
  applyPreset(v);
  writeStored(v === defaultTheme.preset ? null : v);
}, { flush: 'sync' });

export const useAppUi = () => {
  const setPreset = (value: Preset) => { preset.value = value; };
  const reset = () => { preset.value = defaultTheme.preset; };

  return {
    preset,
    presets: PRESETS,
    setPreset,
    reset,
  };
};
