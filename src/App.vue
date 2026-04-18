<template>
  <AppPageLoader ref="pageLoaderRef" />
  <component :is="Layout">
    <RouterView />
  </component>
  <AppToast
    :toasts="toasts"
    @remove="remove"
    @pause="pause"
    @resume="resume"
  />
</template>

<script setup lang="ts">
import { computed, onMounted, onUnmounted, ref, watch } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import MarketingLayout from '@/layouts/MarketingLayout.vue';
import AuthLayout from '@/layouts/AuthLayout.vue';
import DashboardLayout from '@/layouts/DashboardLayout.vue';
import AppToast from '@/components/ui/AppToast.vue';
import AppPageLoader from '@/components/ui/AppPageLoader.vue';
import { useToast } from '@/composables/useToast';

type LayoutName = 'marketing' | 'auth' | 'dashboard';

const layouts: Record<LayoutName, unknown> = {
  marketing: MarketingLayout,
  auth: AuthLayout,
  dashboard: DashboardLayout,
};

const route = useRoute();
const router = useRouter();

const Layout = computed(() => {
  const name = (route.meta.layout as LayoutName) ?? 'marketing';
  return layouts[name] ?? MarketingLayout;
});

const { toasts, remove, pause, resume } = useToast();

// Router-wired page loader
const pageLoaderRef = ref<InstanceType<typeof AppPageLoader> | null>(null);

router.beforeEach((_to, _from, next) => {
  pageLoaderRef.value?.start();
  next();
});

router.afterEach(() => {
  pageLoaderRef.value?.done();
});

router.onError(() => {
  pageLoaderRef.value?.done();
});

// Simple online/offline routing — redirects to /offline when disconnected
const onOffline = () => {
  if (route.name !== 'offline') router.push({ name: 'offline' });
};
const onOnline = () => {
  if (route.name === 'offline') router.push({ path: '/' });
};

onMounted(() => {
  window.addEventListener('offline', onOffline);
  window.addEventListener('online', onOnline);
});

onUnmounted(() => {
  window.removeEventListener('offline', onOffline);
  window.removeEventListener('online', onOnline);
});

// Keep `<html lang>` in sync with future i18n; no-op today.
watch(
  () => route.meta.title,
  (title) => {
    if (typeof title === 'string' && title) document.title = title;
  },
  { immediate: true },
);
</script>
