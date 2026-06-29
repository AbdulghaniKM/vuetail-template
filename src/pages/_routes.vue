<template>
  <div class="mx-auto max-w-4xl p-6">
    <header class="mb-6">
      <div class="flex flex-wrap items-center gap-2">
        <UiAppIcon name="icon-[solar--routing-2-linear]" class="size-6 text-primary" />
        <h1 class="text-2xl font-semibold text-text">Route Explorer</h1>
        <span class="rounded-full bg-warning/10 px-2 py-0.5 text-xs font-medium text-warning">
          dev only
        </span>
      </div>
      <p class="mt-1 text-sm text-text-secondary">
        Every route registered by the compile-time registry — like a Swagger index for your pages.
        Excluded from production builds (the
        <code>_</code>
        filename prefix).
      </p>
    </header>

    <!-- Stats -->
    <div class="mb-4 grid grid-cols-3 gap-3">
      <div class="rounded-xl border border-border bg-surface p-3">
        <p class="text-2xl font-bold text-text">{{ stats.total }}</p>
        <p class="text-xs text-text-secondary">routes</p>
      </div>
      <div class="rounded-xl border border-border bg-surface p-3">
        <p class="text-2xl font-bold text-text">{{ stats.guarded }}</p>
        <p class="text-xs text-text-secondary">guarded</p>
      </div>
      <div class="rounded-xl border border-border bg-surface p-3">
        <p class="text-2xl font-bold text-text">{{ stats.dynamic }}</p>
        <p class="text-xs text-text-secondary">dynamic</p>
      </div>
    </div>

    <!-- Filter -->
    <input
      v-model="query"
      type="text"
      placeholder="Filter by path or name…"
      class="mb-3 w-full rounded-lg border border-border bg-background px-3 py-2 text-sm text-text outline-none focus:border-primary"
    />

    <!-- Auth status -->
    <div class="mb-4 flex items-center gap-2 text-xs text-text-secondary">
      <span
        class="inline-block size-2 rounded-full"
        :class="hasToken ? 'bg-success' : 'bg-border'"
      />
      Auth token {{ hasToken ? 'present' : 'absent' }} — guarded routes
      {{ hasToken ? 'are reachable' : 'redirect to Login' }}.
    </div>

    <!-- List -->
    <ul class="divide-y divide-border overflow-hidden rounded-lg border border-border">
      <li
        v-for="r in rows"
        :key="r.path + r.name"
        class="flex items-center gap-2 px-3 py-1.5 text-sm transition-colors"
        :class="r.active ? 'bg-primary/5' : 'bg-surface'"
      >
        <span
          class="size-1.5 shrink-0 rounded-full"
          :class="r.active ? 'bg-success' : 'bg-border'"
          :title="r.active ? 'active route' : 'inactive'"
        />
        <code class="shrink-0 font-mono text-text">{{ r.path }}</code>
        <span class="min-w-0 flex-1 truncate text-xs text-text-secondary">{{ r.name }}</span>

        <UiAppIcon
          v-if="r.requiresAuth"
          name="icon-[heroicons-outline--lock-closed]"
          class="size-3.5 shrink-0 text-error"
          title="requires auth"
        />
        <span
          v-if="r.dynamic"
          class="shrink-0 text-[10px] font-medium text-primary"
          title="dynamic — needs params"
        >
          :param
        </span>
        <span v-if="r.devOnly" class="shrink-0 text-[10px] font-medium text-warning">dev</span>
        <span class="shrink-0 text-[10px] text-text-secondary">{{ r.layout }}</span>

        <RouterLink
          v-if="!r.dynamic"
          :to="r.path"
          class="shrink-0 text-xs font-medium text-primary hover:underline"
        >
          visit →
        </RouterLink>
      </li>

      <li v-if="rows.length === 0" class="bg-surface px-3 py-6 text-center">
        <p class="text-sm text-text-secondary">No routes match “{{ query }}”.</p>
      </li>
    </ul>
  </div>
</template>

<script setup lang="ts">
  import { isAuthenticated } from '@/lib/authToken';

  definePage({
    head: 'Route Explorer',
    layout: 'blank',
  });

  interface Row {
    path: string;
    name: string;
    layout: string;
    title: string;
    requiresAuth: boolean;
    dynamic: boolean;
    devOnly: boolean;
    active: boolean;
  }

  const router = useRouter();
  const route = useRoute();
  const query = ref('');

  const hasToken = isAuthenticated();

  const rows = computed<Row[]>(() =>
    router
      .getRoutes()
      .map((r) => ({
        path: r.path,
        name: typeof r.name === 'string' ? r.name : '',
        layout: r.meta.layout || 'default',
        title: r.meta.title || '',
        requiresAuth: Boolean(r.meta.requiresAuth),
        dynamic: r.path.includes(':'),
        devOnly: r.path.includes('/_'),
        active: r.path === route.path,
      }))
      .filter((r) => {
        const q = query.value.trim().toLowerCase();
        if (!q) return true;
        return r.path.toLowerCase().includes(q) || r.name.toLowerCase().includes(q);
      })
      .sort((a, b) => a.path.localeCompare(b.path)),
  );

  const stats = computed(() => ({
    total: rows.value.length,
    guarded: rows.value.filter((r) => r.requiresAuth).length,
    dynamic: rows.value.filter((r) => r.dynamic).length,
  }));
</script>
