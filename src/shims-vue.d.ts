declare module '*.vue' {
  import type { DefineComponent } from 'vue';
  const component: DefineComponent<Record<string, unknown>, Record<string, unknown>, unknown>;
  export default component;
}

interface DefinePageConfig {
  /** Explicit URL path. If omitted, it is derived from the file path. */
  route?: string;
  /** Document title, applied on navigation. */
  head?: string;
  /** Layout override. `'blank'` renders the page with no layout chrome. */
  layout?: 'default' | 'auth' | 'dashboard' | 'blank';
  /** Require an auth token to enter this route (redirects to Login otherwise). */
  requiresAuth?: boolean;
}

declare global {
  function definePage(config: DefinePageConfig): void;
}

export {};
