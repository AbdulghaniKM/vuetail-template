import { VueQueryPlugin } from '@tanstack/vue-query';
import { createPinia } from 'pinia';
import { createApp, watch } from 'vue';

// Define definePage globally at runtime as a no-op to prevent ReferenceError in pages
(window as any).definePage = () => {};

import App from './App.vue';
import router from './router';
// Ink's faces ship with the app; Pine and Console load theirs on first use (src/theme.ts).
import '@fontsource-variable/schibsted-grotesk';
import '@fontsource-variable/spline-sans-mono';
import './style.css';
import { initializeConfig } from './config';
import { useToast } from './composables/useToast';
import { registerErrorToasts, setAuthProvider } from './plugins/axios';
import { clearAuthToken, getAuthToken, isAuthenticated } from './lib/authToken';
import { reportError } from './lib/errorReporter';
import { queryClient } from './queries/client';
// Side-effect import — applies the stored or default preset (`data-vt-preset`) to <html> at boot.
// Paired with the pre-boot script in index.html, which does the same before first paint.
import '@/composables/useAppUi';

// Initialize app configuration (theme, SEO, fonts, etc.)
initializeConfig();

const pinia = createPinia();
const app = createApp(App);

// ─── Global error handling ──────────────────────────────────────────────────
// Every unexpected error goes to reportError (src/lib/errorReporter.ts): the console by default,
// your tracker once you call setErrorReporter. Dev also shows it as a toast so it can't be missed.
const toast = useToast();

app.config.errorHandler = (err, _instance, info) => {
  reportError(err, { source: 'vue', info });
  if (import.meta.env.DEV) {
    const message = err instanceof Error ? err.message : String(err);
    toast.error(message, { title: 'Render error' });
  }
};

window.addEventListener('unhandledrejection', (event) => {
  reportError(event.reason, { source: 'unhandledrejection' });
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

// Wire the in-memory auth token (src/lib/authToken.ts) into axios: attach it as
// a Bearer token on every request, and on an unrecoverable 401 clear it and —
// only when the user is on a guarded route — bounce to Login. To enable silent
// refresh, add `refreshToken: async () => { ...; return newAccessToken; }`.
setAuthProvider({
  getToken: getAuthToken,
  onUnauthorized: () => {
    clearAuthToken();
    const current = router.currentRoute.value;
    if (current.meta.requiresAuth) {
      router.push({ name: 'Login', query: { redirect: current.fullPath } });
    }
  },
});

// Cached server data belongs to whoever was signed in. Drop all of it the moment the token goes
// away (sign-out, a failed refresh), so the next person on this tab never sees it.
watch(isAuthenticated, (signedIn) => {
  if (!signedIn) queryClient.clear();
});

app.use(pinia); // client-only state (UI, preferences); server data lives in src/queries/
app.use(VueQueryPlugin, { queryClient });
app.use(router);

// Debug-print the registered routes — dev only (stripped from production builds).
if (import.meta.env.DEV) {
  console.log(
    '[Router Registry]:',
    router.getRoutes().map((r) => ({
      path: r.path,
      name: r.name,
      meta: r.meta,
    })),
  );
}

app.mount('#app');
