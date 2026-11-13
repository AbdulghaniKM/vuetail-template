<template>
  <UiAppPageLoader ref="pageLoaderRef" />
  <component :is="Layout" v-if="Layout">
    <RouterView />
  </component>
  <RouterView v-else />
  <UiAppToast :toasts="toasts" @remove="remove" @pause="pause" @resume="resume" />
</template>

<script setup lang="ts">
  import AppPageLoader from '@/components/ui/AppPageLoader.vue';
  import { appIdentity } from '@/config/identity';
  import DefaultLayout from '@/layouts/DefaultLayout.vue';
  import AuthLayout from '@/layouts/AuthLayout.vue';
  import DashboardLayout from '@/layouts/DashboardLayout.vue';
  type LayoutName = 'default' | 'auth' | 'dashboard';

  const layouts: Record<LayoutName, unknown> = {
    default: DefaultLayout,
    auth: AuthLayout,
    dashboard: DashboardLayout,
  };

  const route = useRoute();
  const router = useRouter();

  const Layout = computed(() => {
    const name = route.meta.layout;
    if (name === 'blank') return null; // render the page with no layout chrome
    return layouts[name ?? 'default'] ?? DefaultLayout;
  });

  const { toasts, remove, pause, resume } = useToast();

  // Router-wired page loader
  const pageLoaderRef = ref<InstanceType<typeof AppPageLoader> | null>(null);

  router.beforeEach(() => {
    pageLoaderRef.value?.start();
  });

  router.afterEach(() => {
    pageLoaderRef.value?.done();
  });

  router.onError(() => {
    pageLoaderRef.value?.done();
  });

  // Simple online/offline routing — redirects to /offline when disconnected
  const onOffline = () => {
    if (route.name !== 'Offline') router.push({ name: 'Offline' });
  };
  const onOnline = () => {
    if (route.name === 'Offline') router.push({ path: '/' });
  };

  onMounted(() => {
    window.addEventListener('offline', onOffline);
    window.addEventListener('online', onOnline);
  });

  onUnmounted(() => {
    window.removeEventListener('offline', onOffline);
    window.removeEventListener('online', onOnline);
  });

  // The tab title follows the route: a page's `head` plus the app name, or the site title when
  // the page sets none (otherwise the last page's title stayed on every page without one).
  watch(
    () => route.meta.title,
    (title) => {
      document.title =
        typeof title === 'string' && title ? `${title} — ${appIdentity.name}` : appIdentity.title;
    },
    { immediate: true },
  );
</script>
