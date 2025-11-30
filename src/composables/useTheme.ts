import { ref, computed, watch, onMounted } from 'vue';
import {
  getCurrentTheme,
  setTheme as setThemeUtil,
  getSystemTheme,
  getColorValue,
  type ColorPalette,
} from '../utils/theme';
import { appConfig } from '../config/app.config';

type ThemeMode = 'light' | 'dark' | 'system';

const currentTheme = ref<'light' | 'dark'>(getCurrentTheme(appConfig.theme.defaultTheme));
const themeMode = ref<ThemeMode>(appConfig.theme.defaultTheme || 'system');

export const useTheme = () => {
  const isDark = computed(() => currentTheme.value === 'dark');
  const isLight = computed(() => currentTheme.value === 'light');
  const mode = computed(() => themeMode.value);

  const toggleTheme = () => {
    const newTheme = currentTheme.value === 'light' ? 'dark' : 'light';
    setTheme(newTheme);
  };

  const setTheme = (theme: 'light' | 'dark' | 'system') => {
    themeMode.value = theme;

    if (theme === 'system') {
      currentTheme.value = getSystemTheme();
      setThemeUtil('system');
    } else {
      currentTheme.value = theme;
      setThemeUtil(theme);
    }
  };

  const getColor = (colorKey: keyof ColorPalette): string => {
    return getColorValue(colorKey, currentTheme.value);
  };

  const colors = computed(() => {
    return appConfig.theme[currentTheme.value];
  });

  // Watch for system theme changes
  onMounted(() => {
    if (themeMode.value === 'system') {
      const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
      const handleChange = (e: MediaQueryListEvent) => {
        if (themeMode.value === 'system') {
          currentTheme.value = e.matches ? 'dark' : 'light';
          setThemeUtil('system');
        }
      };

      // Modern browsers
      if (mediaQuery.addEventListener) {
        mediaQuery.addEventListener('change', handleChange);
      } else {
        // Fallback for older browsers
        mediaQuery.addListener(handleChange);
      }
    }
  });

  // Watch for manual theme changes
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
