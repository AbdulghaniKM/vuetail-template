import { ref, watch, computed } from 'vue';
import { appConfig } from '../config/app.config';
import { applyTheme } from '../utils/theme';
import type { ColorPalette, ThemeConfig } from '../config/types';
import { useTheme } from './useTheme';

// Initialize with a deep copy of the config theme
const getInitialTheme = (): ThemeConfig => {
  return {
    defaultTheme: appConfig.theme.defaultTheme,
    light: { ...appConfig.theme.light },
    dark: { ...appConfig.theme.dark },
  };
};

const customColors = ref<ThemeConfig>(getInitialTheme());

export const useColorCustomizer = () => {
  const { theme } = useTheme();

  const updateColor = (
    colorKey: keyof ColorPalette,
    value: string,
    themeMode: 'light' | 'dark' = theme.value
  ) => {
    if (customColors.value[themeMode]) {
      // Ensure value starts with # if it's a hex color
      const colorValue = value.startsWith('#') ? value : value.startsWith('rgb') ? value : `#${value}`;
      (customColors.value[themeMode] as any)[colorKey] = colorValue;
      // Apply the updated theme immediately
      applyTheme(customColors.value);
    }
  };

  const resetColors = () => {
    customColors.value = getInitialTheme();
    applyTheme(customColors.value);
  };

  const getColor = (colorKey: keyof ColorPalette, themeMode: 'light' | 'dark' = theme.value): string => {
    return customColors.value[themeMode]?.[colorKey] || '';
  };

  const getCurrentColors = (): ColorPalette => {
    return customColors.value[theme.value] || customColors.value.light;
  };

  // Watch for theme changes and reapply
  watch(
    () => theme.value,
    () => {
      applyTheme(customColors.value);
    }
  );

  return {
    colors: computed(() => customColors.value),
    updateColor,
    resetColors,
    getColor,
    getCurrentColors,
  };
};
