declare module '*.vue' {
  import type { DefineComponent } from 'vue';
  const component: DefineComponent<Record<string, unknown>, Record<string, unknown>, unknown>;
  export default component;
}

type LayoutName = 'default' | 'auth' | 'dashboard' | 'blank';

interface DefinePageConfig {
  /** Explicit URL path. If omitted, it is derived from the file path. */
  route?: string;
  /** Document title, applied on navigation. */
  head?: string;
  /** Layout override. `'blank'` renders the page with no layout chrome. */
  layout?: LayoutName;
  /** Require an auth token to enter this route (redirects to Login otherwise). */
  requiresAuth?: boolean;
}

declare global {
  function definePage(config: DefinePageConfig): void;
}

// Strongly-typed route meta: `to.meta.layout` / `.title` / `.requiresAuth` are
// checked everywhere (App.vue, navigation guards, the route registry) instead of
// being loosely typed `unknown`. A typo like `requireAuth` is now a compile error.
declare module 'vue-router' {
  interface RouteMeta {
    layout?: LayoutName;
    title?: string;
    requiresAuth?: boolean;
  }
}

export {};
