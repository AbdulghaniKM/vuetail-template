import { createPinia } from "pinia";
import { createApp } from "vue";

// Define definePage globally at runtime as a no-op to prevent ReferenceError in pages
(window as any).definePage = () => {};

import App from "./App.vue";
import router from "./router";
import "./style.css";
import { initializeConfig } from "./config";
import { useToast } from "./composables/useToast";
import { registerErrorToasts, setAuthProvider } from "./plugins/axios";
import { clearAuthToken, getAuthToken } from "./lib/authToken";
// Side-effect import — applies `data-shape` from `theme.ts` and localStorage
// to <html> at boot. Paired with the pre-boot script in index.html which
// does the same before Vue mounts to avoid FOUC.
import "@/composables/useAppUi";

// Initialize app configuration (theme, SEO, fonts, etc.)
initializeConfig();

const pinia = createPinia();
const app = createApp(App);

// ─── Global error handling ──────────────────────────────────────────────────
// Dev: surface via toast so issues are obvious during development.
// Prod: log to console (replace with Sentry / your own reporter).
const toast = useToast();

app.config.errorHandler = (err, _instance, info) => {
  console.error("[vue:error]", info, err);
  if (import.meta.env.DEV) {
    const message = err instanceof Error ? err.message : String(err);
    toast.error(message, { title: "Render error" });
  }
};

window.addEventListener("unhandledrejection", (event) => {
  console.error("[unhandledrejection]", event.reason);
  if (import.meta.env.DEV) {
    const reason = event.reason;
    const message = reason instanceof Error ? reason.message : String(reason);
    toast.error(message, { title: "Unhandled promise rejection" });
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
      router.push({ name: "Login", query: { redirect: current.fullPath } });
    }
  },
});

app.use(pinia);
app.use(router);

// Debug-print the registered routes — dev only (stripped from production builds).
if (import.meta.env.DEV) {
  console.log(
    "[Router Registry]:",
    router.getRoutes().map((r) => ({
      path: r.path,
      name: r.name,
      meta: r.meta,
    })),
  );
}

app.mount("#app");
