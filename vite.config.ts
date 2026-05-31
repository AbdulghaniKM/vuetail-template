import { DevTools } from '@vitejs/devtools';
import tailwindcss from '@tailwindcss/vite';
import vue from '@vitejs/plugin-vue';
import { fileURLToPath, URL } from 'node:url';
import AutoImport from 'unplugin-auto-import/vite';
import Components from 'unplugin-vue-components/vite';
import { defineConfig } from 'vite';

export default defineConfig({
  plugins: [
    DevTools(),
    vue(),
    tailwindcss(),
    AutoImport({
      imports: [
        'vue',
        'vue-router',
        'pinia',
        '@vueuse/core',
        {
          axios: [['default', 'axios'], 'isAxiosError', 'AxiosError'],
          '@/plugins/axios': ['api', 'apiGet', 'apiPost', 'apiPut', 'apiPatch', 'apiDelete'],
        },
      ],
      dirs: ['src/composables/**', 'src/stores/**', 'src/types/**', 'src/config/**'],
      dirsScanOptions: {
        fileFilter: (file) => !file.endsWith('index.ts'),
      },
      dts: 'src/auto-imports.d.ts',
      vueTemplate: true,
    }),

    Components({
      dirs: ['src/components'],
      extensions: ['vue'],
      dts: 'src/components.d.ts',
      directoryAsNamespace: true,
    }),
  ],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
    },
  },
  build: {
    rolldownOptions: {
      devtools: {},
    },
  },
});
