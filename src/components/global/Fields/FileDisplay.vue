<template>
  <div
    v-if="fileName"
    class="border-border bg-muted/50 flex items-center gap-2 rounded-lg border px-3 py-2"
  >
    <AppIcon name="icon-[heroicons-outline--document]" :size="1.25" class="text-text-secondary shrink-0" />
    <span class="text-text max-w-48 truncate text-sm">{{ displayName }}</span>
    <span v-if="loading" class="text-text-secondary shrink-0 text-xs">(Uploading...)</span>
    <AppButton
      v-if="!loading && showRemove"
      type="button"
      icon="icon-[heroicons-outline--x-mark]"
      icon-only
      tooltip="Remove file"
      variant="danger"
      class="shrink-0 p-1"
      aria-label="Remove file"
      @click="$emit('remove')"
    />
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import AppIcon from '../AppIcon.vue'
import AppButton from '../AppButton.vue'
import { display } from '../../../utils/display'

const props = withDefaults(
  defineProps<{
    fileName: string
    loading?: boolean
    showRemove?: boolean
    displayFn?: (v: unknown) => string
  }>(),
  {
    loading: false,
    showRemove: true,
    displayFn: (v: unknown) => display(v),
  }
)

defineEmits<{
  remove: []
}>()

const displayName = computed(() => props.displayFn(props.fileName))
</script>
