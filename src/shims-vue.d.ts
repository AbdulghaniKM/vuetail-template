declare module '*.vue' {
  import type { DefineComponent } from 'vue';
  const component: DefineComponent<Record<string, unknown>, Record<string, unknown>, unknown>;
  export default component;
}

interface DefinePageConfig {
  route: string;
  head?: string;
  layout?: 'default' | 'auth' | 'dashboard';
}

declare global {
  function definePage(config: DefinePageConfig): void;
}

export {};
