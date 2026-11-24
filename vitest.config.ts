import { defineConfig, mergeConfig } from 'vitest/config';
import viteConfig from './vite.config';

// Tests run through the app's own Vite config, so `@/` paths and auto-imports work as in src/.
export default mergeConfig(
  viteConfig,
  defineConfig({
    test: {
      environment: 'happy-dom',
      include: ['src/**/*.test.ts'],
      restoreMocks: true,
    },
  }),
);
