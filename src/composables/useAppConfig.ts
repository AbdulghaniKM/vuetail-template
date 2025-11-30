import { computed } from 'vue';
import { appConfig } from '../config/app.config';
import type { AppConfig } from '../config/types';

export const useAppConfig = () => {
  const config = computed(() => appConfig);

  const app = computed(() => appConfig.app);
  const theme = computed(() => appConfig.theme);
  const typography = computed(() => appConfig.typography);
  const icons = computed(() => appConfig.icons);
  const seo = computed(() => appConfig.seo);
  const layout = computed(() => appConfig.layout);

  const appName = computed(() => appConfig.app.name);
  const appTitle = computed(() => appConfig.app.title);
  const appDescription = computed(() => appConfig.app.description);
  const appUrl = computed(() => appConfig.app.url);

  const primaryFont = computed(() => appConfig.typography.primary.family);
  const secondaryFont = computed(() => appConfig.typography.secondary?.family);
  const monoFont = computed(() => appConfig.typography.mono?.family);

  const containerMaxWidth = computed(() => appConfig.layout?.containerMaxWidth || '1280px');

  return {
    config,
    app,
    theme,
    typography,
    icons,
    seo,
    layout,
    appName,
    appTitle,
    appDescription,
    appUrl,
    primaryFont,
    secondaryFont,
    monoFont,
    containerMaxWidth,
  };
};
