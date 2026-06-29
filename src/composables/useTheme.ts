import { appConfig } from '@/config/app.config';
import { ThemePersistence, type ThemeMode } from '@/lib/ThemePersistence';
import { applyThemeToDOM, getColorValue, getSystemTheme, type ColorPalette } from '@/utils/theme';
import { computed, ref, watch } from 'vue';

const defaultMode: ThemeMode =
  ThemePersistence.readPersistedAppearancePreference() ?? appConfig.theme.defaultTheme ?? 'system';

const resolveTheme = (mode: ThemeMode | null): 'light' | 'dark' =>
  ThemePersistence.resolveEffectiveAppearance(mode);

// ─── Singleton theme state ───────────────────────────────────────────────────
// Shared across every `useTheme()` caller. The DOM is already in the right state
// at this point (the index.html pre-boot script + initializeConfig() apply the
// theme before any component mounts), so there is nothing to apply here.
const currentTheme = ref<'light' | 'dark'>(resolveTheme(defaultMode));
const themeMode = ref<ThemeMode>(defaultMode);

// ─── OS preference sync — registered ONCE at module scope ────────────────────
// This listener mutates the singleton refs above, so it belongs at module scope,
// not inside the composable. Registering it per `useTheme()` call (as before)
// added a duplicate listener for every component instance and never cleaned them
// up. As app-lifetime state, it intentionally lives without teardown.
if (typeof window !== 'undefined' && typeof window.matchMedia === 'function') {
  const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
  const onSchemeChange = (event: MediaQueryListEvent) => {
    if (themeMode.value === 'system') {
      currentTheme.value = event.matches ? 'dark' : 'light';
      applyThemeToDOM('system');
    }
  };
  if (mediaQuery.addEventListener) {
    mediaQuery.addEventListener('change', onSchemeChange);
  } else if (mediaQuery.addListener) {
    mediaQuery.addListener(onSchemeChange); // Safari < 14 fallback
  }
}

// Re-resolve the effective theme whenever the mode switches to `system`.
// Registered once for the singleton, not per component instance.
watch(themeMode, (newMode) => {
  if (newMode === 'system') currentTheme.value = getSystemTheme();
});

export const useTheme = () => {
  const isDark = computed(() => currentTheme.value === 'dark');
  const isLight = computed(() => currentTheme.value === 'light');
  const mode = computed(() => themeMode.value);

  const setTheme = (theme: ThemeMode) => {
    themeMode.value = theme;

    if (theme === 'system') {
      currentTheme.value = getSystemTheme();
      ThemePersistence.writeAppearancePreference(null);
    } else {
      currentTheme.value = theme;
      ThemePersistence.writeAppearancePreference(theme);
    }

    ThemePersistence.applyAppearanceToDocument(theme);
  };

  const toggleTheme = () => {
    setTheme(currentTheme.value === 'light' ? 'dark' : 'light');
  };

  const getColor = (colorKey: keyof ColorPalette): string =>
    getColorValue(colorKey, currentTheme.value);

  const colors = computed(() => appConfig.theme[currentTheme.value]);

  return {
    theme: currentTheme,
    mode,
    isDark,
    isLight,
    toggleTheme,
    setTheme,
    getColor,
    colors,
  };
};
