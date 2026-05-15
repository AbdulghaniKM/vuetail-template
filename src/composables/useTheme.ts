import { appConfig } from '@/config/app.config';
import { ThemePersistence, type ThemeMode } from '@/lib/ThemePersistence';
import { applyThemeToDOM, getColorValue, getSystemTheme, type ColorPalette } from '@/utils/theme';
import { computed, onMounted, ref, watch } from 'vue';

const defaultMode: ThemeMode =
  ThemePersistence.readPersistedAppearancePreference() ?? appConfig.theme.defaultTheme ?? 'system';

const resolveTheme = (mode: ThemeMode | null): 'light' | 'dark' =>
  ThemePersistence.resolveEffectiveAppearance(mode);

const currentTheme = ref<'light' | 'dark'>(resolveTheme(defaultMode));
const themeMode = ref<ThemeMode>(defaultMode);

export const useTheme = () => {
  const isDark = computed(() => currentTheme.value === 'dark');
  const isLight = computed(() => currentTheme.value === 'light');
  const mode = computed(() => themeMode.value);

  const toggleTheme = () => {
    const newTheme = currentTheme.value === 'light' ? 'dark' : 'light';
    setTheme(newTheme);
  };

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

  const getColor = (colorKey: keyof ColorPalette): string => {
    return getColorValue(colorKey, currentTheme.value);
  };

  const colors = computed(() => {
    return appConfig.theme[currentTheme.value];
  });

  onMounted(() => {
    applyThemeToDOM(themeMode.value);

    if (themeMode.value === 'system') {
      const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
      const handlePreferredSchemeChange = (event: MediaQueryListEvent) => {
        if (themeMode.value === 'system') {
          currentTheme.value = event.matches ? 'dark' : 'light';
          applyThemeToDOM('system');
        }
      };

      if (mediaQuery.addEventListener) {
        mediaQuery.addEventListener('change', handlePreferredSchemeChange);
      } else {
        mediaQuery.addListener(handlePreferredSchemeChange);
      }
    }
  });

  watch(
    () => themeMode.value,
    (newMode) => {
      if (newMode === 'system') {
        currentTheme.value = getSystemTheme();
      }
    },
  );

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
