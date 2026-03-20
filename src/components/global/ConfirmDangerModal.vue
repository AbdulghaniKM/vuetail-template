<template>
  <AppModal
    :is-open="isOpen"
    :title="title"
    :description="message"
    icon="icon-[heroicons--exclamation-triangle]"
    icon-variant="danger"
    max-width="sm"
    hide-close
    @close="emit('close')"
  >
    <template #default>
      <!-- intentionally empty — description in header is enough -->
    </template>
    <template #footer>
      <div class="flex gap-2.5">
        <AppButton
          variant="outline"
          :label="cancelLabel"
          full-width
          size="md"
          class="flex-1"
          @click="emit('close')"
        />
        <AppButton
          variant="danger"
          :label="loading ? loadingLabel : confirmLabel"
          :loading="loading"
          :loading-label="loadingLabel"
          icon="icon-[heroicons-outline--trash]"
          full-width
          size="md"
          class="flex-1 !bg-error !text-white !shadow-sm hover:!bg-error/90"
          @click="emit('confirm')"
        />
      </div>
    </template>
  </AppModal>
</template>

<script setup lang="ts">
import AppModal from './AppModal.vue'
import AppButton from './AppButton.vue'

withDefaults(
  defineProps<{
    isOpen: boolean
    title?: string
    message?: string
    confirmLabel?: string
    cancelLabel?: string
    loading?: boolean
    loadingLabel?: string
  }>(),
  {
    title: 'Confirm',
    message: 'Are you sure? This action cannot be undone.',
    confirmLabel: 'Yes, confirm',
    cancelLabel: 'Cancel',
    loading: false,
    loadingLabel: 'Processing...',
  }
)

const emit = defineEmits<{ close: []; confirm: [] }>()
</script>
