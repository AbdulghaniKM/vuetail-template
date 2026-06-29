import { DevTools } from '@vitejs/devtools';
import tailwindcss from '@tailwindcss/vite';
import vue from '@vitejs/plugin-vue';
import { fileURLToPath, URL } from 'node:url';
import AutoImport from 'unplugin-auto-import/vite';
import Components from 'unplugin-vue-components/vite';
import { defineConfig } from 'vite';

// Compile-time parser for the `definePage` macro. When a page calls
// `definePage({ ... })`, this extracts the known fields and re-emits them as a
// plain `<script>` default export so the route registry (src/config/router.ts)
// can read them off the component at build time.
function customRoutePlugin() {
  return {
    name: 'custom-route-plugin',
    transform(code: string, id: string) {
      // Cheap guard: skip every file that can't contain the macro.
      if (!id.endsWith('.vue') || !code.includes('definePage(')) return;

      const match = code.match(/definePage\(\s*(\{[\s\S]*?\})\s*\)/);
      if (!match) return;
      const cfg = match[1];

      const str = (key: string) =>
        cfg.match(new RegExp(`${key}\\s*:\\s*["']([^"']+)["']`))?.[1];
      const bool = (key: string) => {
        const m = cfg.match(new RegExp(`${key}\\s*:\\s*(true|false)`));
        return m ? m[1] === 'true' : undefined;
      };

      const fields: Record<string, string | boolean> = {};
      const route = str('route');
      const head = str('head');
      const layout = str('layout');
      const requiresAuth = bool('requiresAuth');
      if (route !== undefined) fields.route = route;
      if (head !== undefined) fields.head = head;
      if (layout !== undefined) fields.layout = layout;
      if (requiresAuth !== undefined) fields.requiresAuth = requiresAuth;

      const opts = Object.entries(fields)
        .map(([k, v]) => `  ${k}: ${JSON.stringify(v)},`)
        .join('\n');

      return {
        code: `${code}\n<script lang="ts">\nexport default {\n${opts}\n};\n</script>\n`,
        map: null,
      };
    },
  };
}

export default defineConfig(async () => ({
  plugins: [
    ...(await DevTools()),
    customRoutePlugin(),
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
}));
