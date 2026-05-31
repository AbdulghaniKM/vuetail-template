import { createRouter, createWebHistory } from "vue-router";
import { routes } from "@/config/router";

const router = createRouter({
  history: createWebHistory(),
  routes: [...routes],
  scrollBehavior() {
    return { top: 0, behavior: "smooth" };
  },
});

router.beforeEach((to) => {
  if (!to.meta.requiresAuth) return true;
  const token = typeof localStorage !== "undefined" ? localStorage.getItem("auth-token") : null;
  if (token) return true;
  return { name: "Login", query: { redirect: to.fullPath } };
});

export default router;
