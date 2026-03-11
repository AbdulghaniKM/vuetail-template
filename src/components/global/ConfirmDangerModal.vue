<template>
  <AppModal :is-open="isOpen" :title="title" max-width="sm" @close="emit('close')">
    <div class="flex flex-col items-center gap-4 px-5 pt-2 pb-5">
      <!-- Danger icon -->
      <div class="flex size-14 items-center justify-center rounded-full bg-error/10 ring-4 ring-error/5">
        <div class="flex size-10 items-center justify-center rounded-full bg-error/15">
          <AppIcon name="icon-[heroicons--exclamation-triangle]" :size="1.375" class="text-error" />
        </div>
      </div>

      <div class="flex flex-col items-center gap-1.5 text-center">
        <h4 class="text-base font-bold text-text">{{ title }}</h4>
        <p class="max-w-[18rem] text-sm leading-relaxed text-text-secondary">{{ message }}</p>
      </div>

      <div class="mt-1 flex w-full gap-2.5">
        <AppButton
          variant="outline"
          icon="icon-[heroicons-outline--x-mark]"
          :label="cancelLabel"
          full-width
          size="md"
          class="flex-1"
          @click="emit('close')"
        />
        <button
          type="button"
          :disabled="loading"
          class="inline-flex h-10 flex-1 items-center justify-center gap-2 rounded-lg bg-error px-4 text-sm font-semibold text-white shadow-sm transition-all hover:bg-error/90 hover:shadow-md active:scale-[0.98] disabled:pointer-events-none disabled:opacity-50"
          @click="emit('confirm')"
        >
          <AppIcon v-if="!loading" name="icon-[heroicons-outline--check]" :size="1.125" />
          {{ loading ? loadingLabel : confirmLabel }}
        </button>
      </div>
    </div>
  </AppModal>
</template>

<script setup lang="ts">
import AppModal from './AppModal.vue'
import AppIcon from './AppIcon.vue'
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
