<template>
  <div class="flex items-center gap-2">
    <input
      ref="inputRef"
      type="file"
      :accept="accept"
      class="hidden"
      @change="handleChange"
    />
    <AppButton
      type="button"
      variant="outline"
      :icon="'icon-[heroicons-outline--paper-clip]'"
      :disabled="disabled || loading"
      :label="loading ? loadingLabel : buttonLabel"
      @click="inputRef?.click()"
    />
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import AppButton from '../AppButton.vue'

withDefaults(
  defineProps<{
    accept?: string
    disabled?: boolean
    loading?: boolean
    buttonLabel?: string
    loadingLabel?: string
  }>(),
  {
    buttonLabel: 'Attach file',
    loadingLabel: 'Uploading...',
  }
)

const emit = defineEmits<{
  change: [file: File]
}>()

const inputRef = ref<HTMLInputElement | null>(null)

function handleChange(event: Event) {
  const input = event.target as HTMLInputElement
  const file = input.files?.[0]
  if (file) {
    emit('change', file)
    input.value = ''
  }
}
</script>
