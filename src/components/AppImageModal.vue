<template>
  <Teleport to="body">
    <Transition
      enter-active-class="transition-opacity duration-300"
      enter-from-class="opacity-0"
      enter-to-class="opacity-100"
      leave-active-class="transition-opacity duration-300"
      leave-from-class="opacity-100"
      leave-to-class="opacity-0"
    >
      <div
        v-if="isOpen"
        class="fixed inset-0 z-[9999] flex items-center justify-center bg-black/80 backdrop-blur-sm"
        @click.self="handleClose"
        @keydown.esc="handleClose"
      >
        <div class="relative w-full h-full flex items-center justify-center p-4">
          <!-- Close Button -->
          <button
            class="absolute top-4 right-4 z-10 w-12 h-12 flex items-center justify-center rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors backdrop-blur-sm"
            @click="handleClose"
            aria-label="Close modal"
          >
            <span class="icon-[mdi--close] text-2xl"></span>
          </button>

          <!-- Navigation Buttons -->
          <button
            v-if="images.length > 1"
            class="absolute left-4 z-10 w-12 h-12 flex items-center justify-center rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors backdrop-blur-sm"
            @click="previousImage"
            aria-label="Previous image"
          >
            <span class="icon-[mdi--chevron-left] text-2xl"></span>
          </button>

          <button
            v-if="images.length > 1"
            class="absolute right-4 z-10 w-12 h-12 flex items-center justify-center rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors backdrop-blur-sm"
            @click="nextImage"
            aria-label="Next image"
          >
            <span class="icon-[mdi--chevron-right] text-2xl"></span>
          </button>

          <!-- Image Counter -->
          <div
            v-if="images.length > 1"
            class="absolute top-4 left-1/2 -translate-x-1/2 z-10 px-4 py-2 rounded-full bg-white/10 text-white text-sm backdrop-blur-sm"
          >
            {{ currentIndex + 1 }} / {{ images.length }}
          </div>

          <!-- Image Container -->
          <Transition
            enter-active-class="transition-all duration-300"
            enter-from-class="opacity-0 scale-95"
            enter-to-class="opacity-100 scale-100"
            leave-active-class="transition-all duration-300"
            leave-from-class="opacity-100 scale-100"
            leave-to-class="opacity-0 scale-95"
            mode="out-in"
          >
            <div
              :key="currentIndex"
              class="relative max-w-full max-h-full overflow-auto"
              @wheel.prevent="handleZoom"
            >
              <img
                :src="currentImage"
                :alt="alt || `Image ${currentIndex + 1}`"
                class="max-w-full max-h-[90vh] object-contain select-none"
                :style="{
                  transform: `scale(${zoom})`,
                  transformOrigin: 'center center',
                  transition: zoomTransition ? 'transform 0.2s ease-out' : 'none',
                }"
                @mousedown="handleMouseDown"
                @mousemove="handleMouseMove"
                @mouseup="handleMouseUp"
                @mouseleave="handleMouseUp"
              />
            </div>
          </Transition>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<script setup lang="ts">
import { computed, ref, watch, onMounted, onUnmounted } from 'vue';

interface Props {
  images: string | string[];
  isOpen: boolean;
  initialIndex?: number;
  alt?: string;
}

const props = withDefaults(defineProps<Props>(), {
  initialIndex: 0,
  alt: '',
});

const emit = defineEmits<{
  close: [];
  'update:isOpen': [value: boolean];
}>();

const imagesArray = computed(() => {
  return Array.isArray(props.images) ? props.images : [props.images];
});

const currentIndex = ref(props.initialIndex);
const zoom = ref(1);
const zoomTransition = ref(false);
const isDragging = ref(false);
const dragStart = ref({ x: 0, y: 0 });
const imagePosition = ref({ x: 0, y: 0 });

const currentImage = computed(() => {
  return imagesArray.value[currentIndex.value] || '';
});

const handleClose = () => {
  emit('close');
  emit('update:isOpen', false);
  resetZoom();
};

const nextImage = () => {
  if (currentIndex.value < imagesArray.value.length - 1) {
    currentIndex.value++;
    resetZoom();
  } else {
    currentIndex.value = 0;
    resetZoom();
  }
};

const previousImage = () => {
  if (currentIndex.value > 0) {
    currentIndex.value--;
    resetZoom();
  } else {
    currentIndex.value = imagesArray.value.length - 1;
    resetZoom();
  }
};

const handleZoom = (event: WheelEvent) => {
  event.preventDefault();
  const delta = event.deltaY > 0 ? -0.1 : 0.1;
  zoom.value = Math.max(0.5, Math.min(3, zoom.value + delta));
  zoomTransition.value = true;
  setTimeout(() => {
    zoomTransition.value = false;
  }, 200);
};

const resetZoom = () => {
  zoom.value = 1;
  imagePosition.value = { x: 0, y: 0 };
};

const handleMouseDown = (event: MouseEvent) => {
  if (zoom.value > 1) {
    isDragging.value = true;
    dragStart.value = { x: event.clientX - imagePosition.value.x, y: event.clientY - imagePosition.value.y };
  }
};

const handleMouseMove = (event: MouseEvent) => {
  if (isDragging.value && zoom.value > 1) {
    imagePosition.value = {
      x: event.clientX - dragStart.value.x,
      y: event.clientY - dragStart.value.y,
    };
  }
};

const handleMouseUp = () => {
  isDragging.value = false;
};

const handleKeyDown = (event: KeyboardEvent) => {
  if (!props.isOpen) return;

  switch (event.key) {
    case 'Escape':
      handleClose();
      break;
    case 'ArrowLeft':
      previousImage();
      break;
    case 'ArrowRight':
      nextImage();
      break;
  }
};

watch(
  () => props.initialIndex,
  (newIndex) => {
    if (newIndex >= 0 && newIndex < imagesArray.value.length) {
      currentIndex.value = newIndex;
      resetZoom();
    }
  }
);

watch(
  () => props.isOpen,
  (isOpen) => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
      resetZoom();
    } else {
      document.body.style.overflow = '';
    }
  }
);

onMounted(() => {
  window.addEventListener('keydown', handleKeyDown);
});

onUnmounted(() => {
  window.removeEventListener('keydown', handleKeyDown);
  document.body.style.overflow = '';
});
</script>
