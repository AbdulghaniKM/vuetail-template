import { createPinia } from 'pinia';
import { createApp } from 'vue';
import App from './App.vue';
import router from './router';
import './style.css';
import { initializeConfig } from './config';
import { useToast } from './composables/useToast';
import { registerErrorToasts } from './plugins/axios';
// Side-effect import — applies `data-brand` / `data-shape` from `theme.ts`
// and localStorage to <html> at boot. Paired with the pre-boot script in
// index.html which does the same before Vue mounts to avoid FOUC.
import '@/composables/useAppUi';

// Initialize app configuration (theme, SEO, fonts, etc.)
initializeConfig();

const pinia = createPinia();
const app = createApp(App);

// ─── Global error handling ──────────────────────────────────────────────────
// Dev: surface via toast so issues are obvious during development.
// Prod: log to console (replace with Sentry / your own reporter).
const toast = useToast();

app.config.errorHandler = (err, _instance, info) => {
  console.error('[vue:error]', info, err);
  if (import.meta.env.DEV) {
    const message = err instanceof Error ? err.message : String(err);
    toast.error(message, { title: 'Render error' });
  }
};

window.addEventListener('unhandledrejection', (event) => {
  console.error('[unhandledrejection]', event.reason);
  if (import.meta.env.DEV) {
    const reason = event.reason;
    const message = reason instanceof Error ? reason.message : String(reason);
    toast.error(message, { title: 'Unhandled promise rejection' });
  }
});

// Dispatch 4xx/5xx axios errors to the toast layer. Opt out by removing
// this call or replacing with your own reporter.
registerErrorToasts({
  onError: (message, opts) => toast.error(message, opts),
});

app.use(pinia);
app.use(router);
app.mount('#app');
