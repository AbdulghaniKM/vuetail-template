import { appConfig } from '@/config/app.config';
import { applyThemeToDOM, getColorValue, getSystemTheme, type ColorPalette } from '@/utils/theme';
import { computed, onMounted, ref, watch } from 'vue';

type ThemeMode = 'light' | 'dark' | 'system';

const STORAGE_KEY = 'app-theme';
const readStored = (): ThemeMode | null => {
  if (typeof localStorage === 'undefined') return null;
  const raw = localStorage.getItem(STORAGE_KEY);
  if (raw === 'light' || raw === 'dark') return raw;
  if (raw && raw.startsWith('"')) {
    const unquoted = raw.slice(1, -1);
    if (unquoted === 'light' || unquoted === 'dark') return unquoted;
  }
  return null;
};
const writeStored = (value: ThemeMode | null): void => {
  if (typeof localStorage === 'undefined') return;
  if (value === null || value === 'system') {
    localStorage.removeItem(STORAGE_KEY);
  } else {
    localStorage.setItem(STORAGE_KEY, value);
  }
};

const resolveTheme = (mode: ThemeMode | null): 'light' | 'dark' => {
  if (mode === 'light' || mode === 'dark') return mode;
  return getSystemTheme();
};

const defaultMode: ThemeMode = readStored() ?? appConfig.theme.defaultTheme ?? 'system';
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
      writeStored(null);
    } else {
      currentTheme.value = theme;
      writeStored(theme);
    }

    applyThemeToDOM(theme);
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
