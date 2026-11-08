<template>
  <UiAppEmptyState
    icon="icon-[heroicons--map]"
    title="Page not found"
    description="We couldn't find the page you're looking for. It may have been moved, renamed, or never existed."
    variant="neutral"
  >
    <RouterLink
      to="/"
      class="rounded-lg bg-accent px-4 py-2 text-sm font-medium text-accent-fg transition-colors hover:bg-accent-hover"
    >
      Go home
    </RouterLink>
  </UiAppEmptyState>
</template>
