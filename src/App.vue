<template>
  <DefaultLayout>
    <RouterView/>
  </DefaultLayout>
  <AppToast :toasts="toasts" @remove="removeToast" />
</template>
<script setup lang="ts">
  import DefaultLayout from './layout/index.vue'
  import AppToast from './components/global/AppToast.vue'
  import { useToast } from './composables/useToast'

  const { toasts, remove: removeToast } = useToast()
</script>
