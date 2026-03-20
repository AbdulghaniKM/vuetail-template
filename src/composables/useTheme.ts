import { ref, computed, watch, onMounted } from 'vue';
import {
  applyThemeToDOM,
  getSystemTheme,
  getColorValue,
  type ColorPalette,
} from '../utils/theme';
import { useLocalStorage } from './useLocalStorage';
import { appConfig } from '../config/app.config';

type ThemeMode = 'light' | 'dark' | 'system';

// Persisted theme mode via useLocalStorage
const storedMode = useLocalStorage<ThemeMode | null>('app-theme', null);

const resolveTheme = (mode: ThemeMode | null): 'light' | 'dark' => {
  if (mode === 'light' || mode === 'dark') return mode;
  return getSystemTheme();
};

const defaultMode: ThemeMode = storedMode.value ?? appConfig.theme.defaultTheme ?? 'system';
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
      storedMode.value = null; // remove from storage
    } else {
      currentTheme.value = theme;
      storedMode.value = theme; // persist to storage
    }

    applyThemeToDOM(theme);
  };

  const getColor = (colorKey: keyof ColorPalette): string => {
    return getColorValue(colorKey, currentTheme.value);
  };

  const colors = computed(() => {
    return appConfig.theme[currentTheme.value];
  });

  // Watch for system theme changes
  onMounted(() => {
    // Apply initial theme to DOM
    applyThemeToDOM(themeMode.value);

    if (themeMode.value === 'system') {
      const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
      const handleChange = (e: MediaQueryListEvent) => {
        if (themeMode.value === 'system') {
          currentTheme.value = e.matches ? 'dark' : 'light';
          applyThemeToDOM('system');
        }
      };

      if (mediaQuery.addEventListener) {
        mediaQuery.addEventListener('change', handleChange);
      } else {
        mediaQuery.addListener(handleChange);
      }
    }
  });

  watch(
    () => themeMode.value,
    (newMode) => {
      if (newMode === 'system') {
        currentTheme.value = getSystemTheme();
      }
    }
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
