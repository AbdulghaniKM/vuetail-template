<template>
  <div v-if="hasError" class="p-8 text-center">
    <div class="max-w-md mx-auto">
      <AppIcon name="mdi:alert-circle" size="xl" class="text-red-500 mb-4 mx-auto" />
      <h2 class="text-2xl font-bold text-gray-900 mb-2">Something went wrong</h2>
      <p class="text-gray-600 mb-4">{{ errorMessage }}</p>
      <div class="flex gap-2 justify-center">
        <button
          @click="handleReset"
          class="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          Try Again
        </button>
        <button
          v-if="showDetails"
          @click="showDetails = false"
          class="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
        >
          Hide Details
        </button>
        <button
          v-else
          @click="showDetails = true"
          class="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
        >
          Show Details
        </button>
      </div>
      <div v-if="showDetails && error" class="mt-4 p-4 bg-gray-100 rounded-lg text-left">
        <pre class="text-xs text-gray-700 whitespace-pre-wrap break-words">{{ error.stack || error.message }}</pre>
      </div>
    </div>
  </div>
  <slot v-else />
</template>

<script setup lang="ts">
import { ref, onErrorCaptured } from 'vue';
import AppIcon from './AppIcon.vue';

interface Props {
  fallback?: string;
  onError?: (error: Error) => void;
}

const props = withDefaults(defineProps<Props>(), {
  fallback: 'An unexpected error occurred',
});

const hasError = ref(false);
const error = ref<Error | null>(null);
const errorMessage = ref(props.fallback);
const showDetails = ref(false);

const handleReset = () => {
  hasError.value = false;
  error.value = null;
  errorMessage.value = props.fallback;
  showDetails.value = false;
};

onErrorCaptured((err: Error) => {
  hasError.value = true;
  error.value = err;
  errorMessage.value = err.message || props.fallback;

  if (props.onError) {
    props.onError(err);
  }

  return false; // Prevent error from propagating
});
</script>
