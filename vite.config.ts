import { DevTools } from '@vitejs/devtools';
import tailwindcss from '@tailwindcss/vite';
import vue from '@vitejs/plugin-vue';
import { fileURLToPath, URL } from 'node:url';
import AutoImport from 'unplugin-auto-import/vite';
import Components from 'unplugin-vue-components/vite';
import { defineConfig } from 'vite';

// Tiny, highly optimized custom Vite plugin to compile-time parse definePage macro
function customRoutePlugin() {
  return {
    name: 'custom-route-plugin',
    transform(code: string, id: string) {
      if (!id.endsWith('.vue')) return;
      
      const match = code.match(/definePage\(\s*(\{[\s\S]*?\})\s*\)/);
      if (match) {
        const configStr = match[1];
        
        const routeMatch = configStr.match(/route:\s*["']([^"']+)["']/);
        const headMatch = configStr.match(/head:\s*["']([^"']+)["']/);
        const layoutMatch = configStr.match(/layout:\s*["']([^"']+)["']/);
        
        const route = routeMatch ? routeMatch[1] : null;
        const head = headMatch ? headMatch[1] : null;
        const layout = layoutMatch ? layoutMatch[1] : null;
        
        console.log(`\n[customRoutePlugin] File matched: ${id}`);
        console.log(`  Extracted => route: ${route}, head: ${head}, layout: ${layout}\n`);
        
        let injectScript = `\n<script lang="ts">\nexport default {\n`;
        if (route) injectScript += `  route: ${JSON.stringify(route)},\n`;
        if (head) injectScript += `  head: ${JSON.stringify(head)},\n`;
        if (layout) injectScript += `  layout: ${JSON.stringify(layout)},\n`;
        injectScript += `};\n</script>\n`;
        
        return {
          code: code + injectScript,
          map: null
        };
      }
    }
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
