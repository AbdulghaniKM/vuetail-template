import { createRouter, createWebHistory } from "vue-router";

const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: "/",
      name: "home",
      component: () => import("@/pages/home.vue"),
      meta: { layout: "default" },
    },
    {
      path: "/login",
      name: "login",
      component: () => import("@/pages/Login.vue"),
      meta: { layout: "auth" },
    },
    {
      path: "/500",
      name: "server-error",
      component: () => import("@/pages/ServerError.vue"),
      meta: { layout: "default" },
    },
    {
      path: "/offline",
      name: "offline",
      component: () => import("@/pages/Offline.vue"),
      meta: { layout: "default" },
    },
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
    {
      path: "/:pathMatch(.*)*",
      name: "not-found",
      component: () => import("@/pages/NotFound.vue"),
      meta: { layout: "default" },
    },
  ],
  scrollBehavior() {
    return { top: 0, behavior: "smooth" };
  },
});

router.beforeEach((to) => {
  if (!to.meta.requiresAuth) return true;
  const token = typeof localStorage !== "undefined" ? localStorage.getItem("auth-token") : null;
  if (token) return true;
  return { name: "login", query: { redirect: to.fullPath } };
});

export default router;
