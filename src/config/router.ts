import type { RouteComponent, RouteRecordRaw } from 'vue-router';

// Eagerly import page components so we can read the route/head/layout/requiresAuth
// options injected by the `definePage` macro (see customRoutePlugin in vite.config.ts).
//
// Dev-only pages (filename prefixed with `_`, e.g. _theme.vue / _routes.vue) are
// excluded from the glob in production so they are never *bundled* — not merely
// left unregistered. `import.meta.env.DEV` is a compile-time constant, so the
// unused branch (and its imports) is eliminated from the production build.
const modules = (
  import.meta.env.DEV
    ? import.meta.glob('../pages/**/*.vue', { eager: true })
    : import.meta.glob(['../pages/**/*.vue', '!../pages/**/_*.vue'], { eager: true })
) as Record<string, { default: Record<string, unknown> }>;

// Convert a page path (relative to pages/) into a vue-router path.
// Handles nested directories, `[param]` -> `:param`, `[...all]` -> `:all(.*)*`,
// and drops a trailing `index` segment so:
//   index.vue            -> /
//   dashboard/index.vue  -> /dashboard
//   users/[id].vue       -> /users/:id
//   [...pathMatch].vue   -> /:pathMatch(.*)*
function fileToRoutePath(rel: string): string {
  const segments = rel.replace(/\.vue$/, '').split('/');
  const mapped: string[] = [];

  segments.forEach((seg, i) => {
    const catchAll = seg.match(/^\[\.\.\.(.+)\]$/);
    if (catchAll) return void mapped.push(`:${catchAll[1]}(.*)*`);

    const dynamic = seg.match(/^\[(.+)\]$/);
    if (dynamic) return void mapped.push(`:${dynamic[1]}`);

    // Drop a trailing `index` so it maps to its parent directory.
    if (seg === 'index' && i === segments.length - 1) return;

    mapped.push(seg.toLowerCase());
  });

  const joined = mapped.join('/');
  return joined ? `/${joined}` : '/';
}

// Stable, collision-free route name from the relative path (case preserved so
// named-route lookups like { name: 'Login' } keep working):
//   index.vue            -> 'index'
//   Login.vue            -> 'Login'
//   dashboard/index.vue  -> 'dashboard-index'
function fileToRouteName(rel: string): string {
  return rel.replace(/\.vue$/, '').split('/').join('-');
}

export const routes: RouteRecordRaw[] = [];

for (const fullPath in modules) {
  const rel = fullPath.replace('../pages/', '');

  const component = modules[fullPath].default;
  if (!component) continue;

  // Prefer an explicit `route` from definePage; otherwise derive from the path.
  let routePath = component.route as string | undefined;
  if (routePath) {
    if (!routePath.startsWith('/')) routePath = `/${routePath}`;
  } else {
    routePath = fileToRoutePath(rel);
  }

  routes.push({
    path: routePath,
    name: fileToRouteName(rel),
    component: component as unknown as RouteComponent,
    meta: {
      layout: (component.layout as string) || 'default',
      title: component.head as string | undefined,
      requiresAuth: (component.requiresAuth as boolean | undefined) ?? false,
    },
  });
}
