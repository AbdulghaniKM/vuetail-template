import fs from 'node:fs';
import type { Plugin, ViteDevServer } from 'vite';

const FIELDS = ['route', 'head', 'layout', 'requiresAuth'] as const;
const LAYOUTS = ['default', 'auth', 'dashboard', 'blank'];

/**
 * Compile-time `definePage` macro for the file-based router.
 *
 * When a page's `<script setup>` calls `definePage({ route, head, layout,
 * requiresAuth })`, this extracts the static fields and re-emits them as a plain
 * `<script>` default export so `src/config/router.ts` can read them off the
 * component at build time. Invalid usage is reported as Vite warnings.
 *
 * It also prints the `/_routes` explorer URL in the dev banner.
 *
 * You shouldn't need to edit this file — configure pages with the `definePage`
 * macro instead. See README → Routing.
 */
export function definePagePlugin(): Plugin {
  return {
    name: 'vuetail:define-page',

    transform(code: string, id: string) {
      // Cheap guard: skip every file that can't contain the macro.
      if (!id.endsWith('.vue') || !code.includes('definePage(')) return;

      const match = code.match(/definePage\(\s*(\{[\s\S]*?\})\s*\)/);
      if (!match) return;
      const cfg = match[1];
      const where = id.split(/[\\/]/).slice(-2).join('/'); // e.g. pages/Login.vue

      const str = (key: string) => cfg.match(new RegExp(`${key}\\s*:\\s*["']([^"']+)["']`))?.[1];
      const bool = (key: string) => {
        const m = cfg.match(new RegExp(`${key}\\s*:\\s*(true|false)`));
        return m ? m[1] === 'true' : undefined;
      };

      // ── Validation ───────────────────────────────────────────────────────
      // Detect top-level keys with string VALUES stripped first, so a colon
      // inside a title (e.g. head: 'Time: now') isn't mistaken for a key.
      const cfgNoStrings = cfg.replace(/(['"])(?:\\.|(?!\1).)*\1/g, "''");
      const keys = [...cfgNoStrings.matchAll(/([A-Za-z_$][\w$]*)\s*:/g)].map((m) => m[1]);

      for (const key of keys) {
        if (!FIELDS.includes(key as (typeof FIELDS)[number])) {
          this.warn(
            `definePage in ${where}: unknown field "${key}" — valid fields are ${FIELDS.join(', ')}.`,
          );
        }
      }

      const route = str('route');
      const head = str('head');
      const layout = str('layout');
      const requiresAuth = bool('requiresAuth');

      if (layout !== undefined && !LAYOUTS.includes(layout)) {
        this.warn(
          `definePage in ${where}: invalid layout "${layout}" — expected one of ${LAYOUTS.join(', ')}.`,
        );
      }
      // Present-but-unparseable (non-static) values are silently dropped — warn.
      for (const key of ['route', 'head', 'layout'] as const) {
        if (keys.includes(key) && str(key) === undefined) {
          this.warn(
            `definePage in ${where}: "${key}" is not a static string literal and was ignored — use a plain quoted string.`,
          );
        }
      }
      if (keys.includes('requiresAuth') && requiresAuth === undefined) {
        this.warn(
          `definePage in ${where}: "requiresAuth" must be a literal true/false and was ignored.`,
        );
      }

      const fields: Record<string, string | boolean> = {};
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

    // Dev-only: after Vite prints its URLs, append a pointer to the route
    // explorer so developers discover the custom compile-time route registry.
    configureServer(server: ViteDevServer) {
      if (!fs.existsSync('src/pages/_routes.vue')) return;

      server.httpServer?.once('listening', () => {
        // Defer so this prints after Vite's own Local/Network banner.
        setTimeout(() => {
          const base = server.resolvedUrls?.local?.[0] ?? 'http://localhost:5173/';
          const url = `${base.replace(/\/$/, '')}/_routes`;
          console.log(
            `  \x1b[32m➜\x1b[39m  \x1b[1mRoutes\x1b[22m:  \x1b[36m${url}\x1b[39m \x1b[2m(custom route registry)\x1b[22m`,
          );
        }, 0);
      });
    },
  };
}
