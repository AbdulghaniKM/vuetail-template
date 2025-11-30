import { watch, onBeforeUnmount } from 'vue';
import { useRoute } from 'vue-router';
import { useSeo, clearSeo, type SeoConfig } from '../utils/seo';

export const useSeoComposable = (config: SeoConfig | (() => SeoConfig)) => {
  const route = useRoute();

  const applySeo = () => {
    const seoConfig = typeof config === 'function' ? config() : config;
    useSeo(seoConfig);
  };

  // Apply SEO on mount and route changes
  applySeo();
  watch(() => route.path, applySeo);

  // Cleanup on unmount
  onBeforeUnmount(() => {
    clearSeo();
  });

  return {
    updateSeo: applySeo,
  };
};
