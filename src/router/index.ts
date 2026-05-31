import { createRouter, createWebHistory } from "vue-router";
import { routes } from "vue-router/auto-routes";

const router = createRouter({
  history: createWebHistory(),
  routes: [
    ...routes,
    // Dev-only theme studio. Tree-shaken out of prod by import.meta.env.DEV.
    ...(import.meta.env.DEV
      ? [
          {
            path: "/_theme",
            name: "theme-studio",
            component: () => import("@/pages/_theme.vue"),
            meta: { layout: "default" },
          },
        ]
      : []),
  ],
  scrollBehavior() {
    return { top: 0, behavior: "smooth" };
  },
});

router.beforeEach((to) => {
  if (!to.meta.requiresAuth) return true;
  const token = typeof localStorage !== "undefined" ? localStorage.getItem("auth-token") : null;
  if (token) return true;
  return { name: "/Login", query: { redirect: to.fullPath } };
});

export default router;
