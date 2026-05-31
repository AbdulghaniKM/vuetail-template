import type { RouteRecordRaw } from 'vue-router';

// Eagerly import page components to extract route, head, and layout custom options
const modules = import.meta.glob('../pages/**/*.vue', { eager: true });

export const routes: RouteRecordRaw[] = [];

for (const path in modules) {
  // Skip dev-only pages (like _theme) in production
  if (!import.meta.env.DEV && path.includes('/_theme')) {
    continue;
  }

  const component = (modules[path] as any).default;
  if (!component) continue;

  let routePath = component.route;
  const title = component.head;
  const layout = component.layout || 'default';

  // Fallback to file-system paths if no explicit 'route' is declared
  if (!routePath) {
    const fileBase = path.split('/').pop()?.replace('.vue', '') || '';
    if (fileBase === 'index') {
      routePath = '/';
    } else if (fileBase.startsWith('[...') && fileBase.endsWith(']')) {
      routePath = '/:pathMatch(.*)*';
    } else {
      routePath = `/${fileBase.toLowerCase()}`;
    }
  } else {
    // Ensure leading slash
    if (!routePath.startsWith('/')) {
      routePath = `/${routePath}`;
    }
  }

  routes.push({
    path: routePath,
    name: path.split('/').pop()?.replace('.vue', '') || routePath,
    component: component,
    meta: {
      layout,
      title,
    },
  });
}
