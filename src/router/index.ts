import { createRouter, createWebHistory } from 'vue-router';
import { routes } from '@/config/router';
import { isAuthenticated } from '@/lib/authToken';

const router = createRouter({
  history: createWebHistory(),
  routes: [...routes],
  scrollBehavior() {
    return { top: 0, behavior: 'smooth' };
  },
});

router.beforeEach((to) => {
  if (!to.meta.requiresAuth) return true;
  if (isAuthenticated()) return true;
  return { name: 'Login', query: { redirect: to.fullPath } };
});

export default router;
