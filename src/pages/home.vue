<template>
  <div class="bg-background text-text min-h-screen">
    <!-- Hero Section -->
    <section class="from-primary/10 via-secondary/10 to-accent/10 bg-gradient-to-br py-20">
      <div class="container mx-auto px-4">
        <div class="mx-auto max-w-3xl text-center">
          <h1 class="text-text mb-6 text-5xl font-bold md:text-6xl">
            {{ appTitle }}
          </h1>
          <p class="text-text-secondary mb-8 text-xl">
            {{ appDescription }}
          </p>
          <div class="flex flex-wrap justify-center gap-4">
            <button
              @click="showToast('success', 'Welcome to the showcase!')"
              class="bg-primary hover:bg-primary/90 rounded-lg px-6 py-3 font-semibold text-white transition-colors"
            >
              البدء
            </button>
            <button
              @click="scrollToFeatures"
              class="bg-surface border-border hover:bg-surface/80 text-text rounded-lg border px-6 py-3 font-semibold transition-colors"
            >
              Explore Features
            </button>
          </div>
        </div>
      </div>
    </section>

    <!-- Features Grid -->
    <section id="features" class="py-16">
      <div class="container mx-auto px-4">
        <h2 class="text-text mb-12 text-center text-4xl font-bold">Features</h2>
        <div class="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          <FeatureCard
            v-for="feature in features"
            :key="feature.id"
            :title="feature.title"
            :description="feature.description"
            :icon="feature.icon"
            :color="feature.color as 'primary' | 'secondary' | 'accent'"
          />
        </div>
      </div>
    </section>

    <!-- Theme & Color Customization -->
    <section class="bg-surface py-16">
      <div class="container mx-auto px-4">
        <h2 class="text-text mb-12 text-center text-4xl font-bold">Theme & Color Customization</h2>

        <!-- Theme Switcher -->
        <div class="mx-auto mb-12 max-w-2xl">
          <div class="bg-background border-border mb-6 rounded-lg border p-6">
            <h3 class="text-text mb-4 text-xl font-semibold">Current Theme: {{ theme }}</h3>
            <div class="flex gap-3">
              <button
                @click="setTheme('light')"
                class="rounded-lg px-4 py-2 transition-colors"
                :class="
                  theme === 'light'
                    ? 'bg-primary text-white'
                    : 'bg-surface border-border text-text border'
                "
              >
                Light
              </button>
              <button
                @click="setTheme('dark')"
                class="rounded-lg px-4 py-2 transition-colors"
                :class="
                  theme === 'dark'
                    ? 'bg-primary text-white'
                    : 'bg-surface border-border text-text border'
                "
              >
                Dark
              </button>
              <button
                @click="setTheme('system')"
                class="rounded-lg px-4 py-2 transition-colors"
                :class="
                  mode === 'system'
                    ? 'bg-primary text-white'
                    : 'bg-surface border-border text-text border'
                "
              >
                System
              </button>
            </div>
          </div>

          <!-- Color Palette Display -->
          <div class="bg-background border-border mb-6 rounded-lg border p-6">
            <h3 class="text-text mb-4 text-xl font-semibold">Color Palette</h3>
            <div class="grid grid-cols-2 gap-4 md:grid-cols-4">
              <div class="bg-primary rounded-lg p-4 text-center text-white">
                <div class="mb-1 font-semibold">Primary</div>
                <div class="text-xs opacity-90">{{ currentColors.primary }}</div>
              </div>
              <div class="bg-secondary rounded-lg p-4 text-center text-white">
                <div class="mb-1 font-semibold">Secondary</div>
                <div class="text-xs opacity-90">{{ currentColors.secondary }}</div>
              </div>
              <div class="bg-accent rounded-lg p-4 text-center text-white">
                <div class="mb-1 font-semibold">Accent</div>
                <div class="text-xs opacity-90">{{ currentColors.accent }}</div>
              </div>
              <div class="bg-success rounded-lg p-4 text-center text-white">
                <div class="mb-1 font-semibold">Success</div>
                <div class="text-xs opacity-90">{{ currentColors.success }}</div>
              </div>
            </div>
          </div>

          <!-- Color Customizer -->
          <div class="bg-background border-border rounded-lg border p-6">
            <div class="mb-4 flex items-center justify-between">
              <h3 class="text-text text-xl font-semibold">Customize Colors</h3>
              <button
                @click="resetColors"
                class="bg-surface border-border hover:bg-surface/80 text-text rounded-lg border px-3 py-1 text-sm transition-colors"
              >
                Reset
              </button>
            </div>
            <div class="space-y-4">
              <div class="flex items-center gap-4">
                <label class="text-text-secondary w-24 text-sm">Primary:</label>
                <input
                  type="color"
                  :value="currentColors.primary"
                  @input="updateColor('primary', ($event.target as HTMLInputElement).value)"
                  class="border-border h-10 w-20 cursor-pointer rounded border"
                />
                <input
                  type="text"
                  :value="currentColors.primary"
                  @input="updateColor('primary', ($event.target as HTMLInputElement).value)"
                  class="bg-surface border-border text-text flex-1 rounded-lg border px-3 py-2 font-mono text-sm"
                  placeholder="#3b82f6"
                />
              </div>
              <div class="flex items-center gap-4">
                <label class="text-text-secondary w-24 text-sm">Secondary:</label>
                <input
                  type="color"
                  :value="currentColors.secondary"
                  @input="updateColor('secondary', ($event.target as HTMLInputElement).value)"
                  class="border-border h-10 w-20 cursor-pointer rounded border"
                />
                <input
                  type="text"
                  :value="currentColors.secondary"
                  @input="updateColor('secondary', ($event.target as HTMLInputElement).value)"
                  class="bg-surface border-border text-text flex-1 rounded-lg border px-3 py-2 font-mono text-sm"
                  placeholder="#8b5cf6"
                />
              </div>
              <div class="flex items-center gap-4">
                <label class="text-text-secondary w-24 text-sm">Accent:</label>
                <input
                  type="color"
                  :value="currentColors.accent"
                  @input="updateColor('accent', ($event.target as HTMLInputElement).value)"
                  class="border-border h-10 w-20 cursor-pointer rounded border"
                />
                <input
                  type="text"
                  :value="currentColors.accent"
                  @input="updateColor('accent', ($event.target as HTMLInputElement).value)"
                  class="bg-surface border-border text-text flex-1 rounded-lg border px-3 py-2 font-mono text-sm"
                  placeholder="#f59e0b"
                />
              </div>
              <div class="flex items-center gap-4">
                <label class="text-text-secondary w-24 text-sm">Success:</label>
                <input
                  type="color"
                  :value="currentColors.success"
                  @input="updateColor('success', ($event.target as HTMLInputElement).value)"
                  class="border-border h-10 w-20 cursor-pointer rounded border"
                />
                <input
                  type="text"
                  :value="currentColors.success"
                  @input="updateColor('success', ($event.target as HTMLInputElement).value)"
                  class="bg-surface border-border text-text flex-1 rounded-lg border px-3 py-2 font-mono text-sm"
                  placeholder="#10b981"
                />
              </div>
              <div class="flex items-center gap-4">
                <label class="text-text-secondary w-24 text-sm">Warning:</label>
                <input
                  type="color"
                  :value="currentColors.warning"
                  @input="updateColor('warning', ($event.target as HTMLInputElement).value)"
                  class="border-border h-10 w-20 cursor-pointer rounded border"
                />
                <input
                  type="text"
                  :value="currentColors.warning"
                  @input="updateColor('warning', ($event.target as HTMLInputElement).value)"
                  class="bg-surface border-border text-text flex-1 rounded-lg border px-3 py-2 font-mono text-sm"
                  placeholder="#f59e0b"
                />
              </div>
              <div class="flex items-center gap-4">
                <label class="text-text-secondary w-24 text-sm">Error:</label>
                <input
                  type="color"
                  :value="currentColors.error"
                  @input="updateColor('error', ($event.target as HTMLInputElement).value)"
                  class="border-border h-10 w-20 cursor-pointer rounded border"
                />
                <input
                  type="text"
                  :value="currentColors.error"
                  @input="updateColor('error', ($event.target as HTMLInputElement).value)"
                  class="bg-surface border-border text-text flex-1 rounded-lg border px-3 py-2 font-mono text-sm"
                  placeholder="#ef4444"
                />
              </div>
            </div>
            <div class="bg-surface mt-6 rounded-lg p-4">
              <p class="text-text-secondary text-sm">
                💡 Colors update instantly! Changes apply to the current theme ({{ theme }}). Switch
                themes to customize both light and dark modes separately.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Component Showcases -->
    <section class="py-16">
      <div class="container mx-auto px-4">
        <h2 class="text-text mb-12 text-center text-4xl font-bold">Components</h2>

        <!-- AppTable Demo -->
        <div class="mb-16">
          <h3 class="text-text mb-4 text-2xl font-semibold">Data Table</h3>
          <div class="bg-surface border-border rounded-lg border p-6">
            <AppTable
              :columns="tableColumns"
              :data="tableData"
              :searchable="true"
              :paginated="true"
              :items-per-page="5"
              search-placeholder="Search products..."
            >
              <template #cell-price="{ value }">
                <span class="text-primary font-semibold">${{ value }}</span>
              </template>
              <template #cell-status="{ value }">
                <span
                  class="rounded px-2 py-1 text-sm"
                  :class="
                    value === 'In Stock' ? 'bg-success/20 text-success' : 'bg-error/20 text-error'
                  "
                >
                  {{ value }}
                </span>
              </template>
            </AppTable>
          </div>
        </div>

        <!-- AppIcon Demo -->
        <div class="mb-16">
          <h3 class="text-text mb-4 text-2xl font-semibold">Icons</h3>
          <div class="bg-surface border-border rounded-lg border p-6">
            <div class="grid grid-cols-4 gap-6 md:grid-cols-8">
              <div
                v-for="icon in demoIcons"
                :key="icon"
                class="hover:bg-background flex flex-col items-center gap-2 rounded-lg p-4 transition-colors"
              >
                <AppIcon :name="icon" :size="5" class="text-primary" />
                <span class="text-text-secondary text-center text-xs">
                  {{ icon.split(':')[1] || icon }}
                </span>
              </div>
            </div>
            <div class="mt-6 flex gap-4">
              <AppIcon name="icon-[mdi--heart]" :size="5" class="text-error" />
              <AppIcon name="icon-[mdi--star]" :size="5" class="text-warning" />
              <AppIcon name="icon-[mdi--check-circle]" :size="5" class="text-success" />
              <AppIcon name="icon-[mdi--information]" :size="5" class="text-info" />
            </div>
          </div>
        </div>

        <!-- AppSpinner Demo -->
        <div class="mb-16">
          <h3 class="text-text mb-4 text-2xl font-semibold">Loading Spinner</h3>
          <div class="bg-surface border-border rounded-lg border p-6">
            <div class="flex items-center gap-8">
              <div class="flex flex-col items-center gap-2">
                <AppSpinner size="xs" />
                <span class="text-text-secondary text-sm">Extra Small</span>
              </div>
              <div class="flex flex-col items-center gap-2">
                <AppSpinner size="sm" />
                <span class="text-text-secondary text-sm">Small</span>
              </div>
              <div class="flex flex-col items-center gap-2">
                <AppSpinner size="md" />
                <span class="text-text-secondary text-sm">Medium</span>
              </div>
              <div class="flex flex-col items-center gap-2">
                <AppSpinner size="lg" />
                <span class="text-text-secondary text-sm">Large</span>
              </div>
              <div class="flex flex-col items-center gap-2">
                <AppSpinner size="xl" />
                <span class="text-text-secondary text-sm">Extra Large</span>
              </div>
            </div>
          </div>
        </div>

        <!-- Image Modal Demo -->
        <div class="mb-16">
          <h3 class="text-text mb-4 text-2xl font-semibold">Image Modal</h3>
          <div class="bg-surface border-border rounded-lg border p-6">
            <p class="text-text-secondary mb-4">Click on an image to open the modal</p>
            <div class="grid grid-cols-3 gap-4">
              <img
                v-for="(img, index) in demoImages"
                :key="index"
                :src="img"
                alt="Demo image"
                class="h-32 w-full cursor-pointer rounded-lg object-cover transition-opacity hover:opacity-80"
                @click="openImageModal(index)"
              />
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Utilities Showcase -->
    <section class="bg-surface py-16">
      <div class="container mx-auto px-4">
        <h2 class="text-text mb-12 text-center text-4xl font-bold">Utilities</h2>

        <!-- Date Formatting -->
        <div class="mx-auto mb-16 max-w-2xl">
          <h3 class="text-text mb-4 text-2xl font-semibold">Date Formatting</h3>
          <div class="bg-background border-border rounded-lg border p-6">
            <div class="space-y-3">
              <div class="flex items-center justify-between">
                <span class="text-text-secondary">Short:</span>
                <span class="text-text font-mono">{{ shortDate }}</span>
              </div>
              <div class="flex items-center justify-between">
                <span class="text-text-secondary">Medium:</span>
                <span class="text-text font-mono">{{ mediumDate }}</span>
              </div>
              <div class="flex items-center justify-between">
                <span class="text-text-secondary">Long:</span>
                <span class="text-text font-mono">{{ longDate }}</span>
              </div>
              <div class="flex items-center justify-between">
                <span class="text-text-secondary">Relative:</span>
                <span class="text-text font-mono">{{ relativeDate }}</span>
              </div>
              <div class="flex items-center justify-between">
                <span class="text-text-secondary">Custom:</span>
                <span class="text-text font-mono">{{ customDate }}</span>
              </div>
            </div>
          </div>
        </div>

        <!-- Toast Demo -->
        <div class="mx-auto max-w-2xl">
          <h3 class="text-text mb-4 text-2xl font-semibold">Toast Notifications</h3>
          <div class="bg-background border-border rounded-lg border p-6">
            <div class="grid grid-cols-2 gap-3 md:grid-cols-4">
              <button
                @click="showToast('success', 'Operation completed successfully!')"
                class="bg-success hover:bg-success/90 rounded-lg px-4 py-2 text-white transition-colors"
              >
                Success
              </button>
              <button
                @click="showToast('error', 'Something went wrong!')"
                class="bg-error hover:bg-error/90 rounded-lg px-4 py-2 text-white transition-colors"
              >
                Error
              </button>
              <button
                @click="showToast('warning', 'Please check your input')"
                class="bg-warning hover:bg-warning/90 rounded-lg px-4 py-2 text-white transition-colors"
              >
                Warning
              </button>
              <button
                @click="showToast('info', 'Here is some information')"
                class="bg-info hover:bg-info/90 rounded-lg px-4 py-2 text-white transition-colors"
              >
                Info
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Config Showcase -->
    <section class="py-16">
      <div class="container mx-auto px-4">
        <h2 class="text-text mb-12 text-center text-4xl font-bold">Configuration</h2>
        <div class="mx-auto max-w-3xl">
          <div class="bg-surface border-border rounded-lg border p-6">
            <h3 class="text-text mb-4 text-xl font-semibold">Current Configuration</h3>
            <div class="text-text-secondary space-y-3">
              <div class="flex justify-between">
                <span>App Name:</span>
                <span class="text-text font-mono">{{ appName }}</span>
              </div>
              <div class="flex justify-between">
                <span>Version:</span>
                <span class="text-text font-mono">{{ app.version }}</span>
              </div>
              <div class="flex justify-between">
                <span>Primary Font:</span>
                <span class="text-text font-mono">{{ primaryFont }}</span>
              </div>
              <div class="flex justify-between">
                <span>Container Max Width:</span>
                <span class="text-text font-mono">{{ containerMaxWidth }}</span>
              </div>
            </div>
            <div class="bg-background mt-6 rounded-lg p-4">
              <p class="text-text-secondary mb-2 text-sm">
                All configuration is centralized in
                <code class="bg-surface rounded px-2 py-1">app.config.ts</code>
              </p>
              <p class="text-text-secondary text-sm">
                Customize colors, fonts, SEO, and more in one place!
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Image Modal -->
    <AppImageModal
      :images="demoImages"
      :is-open="isImageModalOpen"
      :initial-index="imageModalIndex"
      @update:is-open="isImageModalOpen = $event"
      @close="isImageModalOpen = false"
    />
  </div>
</template>

<script setup lang="ts">
  import { computed, onMounted, ref } from 'vue';
  import AppIcon from '../components/AppIcon.vue';
  import AppImageModal from '../components/AppImageModal.vue';
  import AppSpinner from '../components/AppSpinner.vue';
  import AppTable from '../components/AppTable.vue';
  import FeatureCard from '../components/FeatureCard.vue';
  import { useAppConfig } from '../composables/useAppConfig';
  import { useColorCustomizer } from '../composables/useColorCustomizer';
  import { useDateFormat } from '../composables/useDateFormat';
  import { useTheme } from '../composables/useTheme';
  import { useToast } from '../composables/useToast';
  import { useSeo } from '../utils';

  const { appTitle, appDescription, appName, app, primaryFont, containerMaxWidth } = useAppConfig();
  const { theme, mode, setTheme } = useTheme();
  const { success, error, warning, info } = useToast();
  const { updateColor, resetColors, getCurrentColors } = useColorCustomizer();

  const currentColors = computed(() => getCurrentColors());

  const isImageModalOpen = ref(false);
  const imageModalIndex = ref(0);

  const demoImages = [
    'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800',
    'https://images.unsplash.com/photo-1518837695005-2083093ee35b?w=800',
    'https://images.unsplash.com/photo-1469474968028-56623f02e42e?w=800',
  ];

  const demoIcons = [
    'icon-[mdi--heart]',
    'icon-[mdi--star]',
    'icon-[mdi--check-circle]',
    'icon-[mdi--information]',
    'icon-[mdi--home]',
    'icon-[mdi--account]',
    'icon-[mdi--settings]',
    'icon-[mdi--menu]',
  ];

  const features = [
    {
      id: 1,
      title: 'Theme System',
      description:
        'Light/dark mode with system preference support. Customize colors in one config file.',
      icon: 'icon-[mdi--palette]',
      color: 'primary',
    },
    {
      id: 2,
      title: 'Components',
      description: 'Pre-built components: Table, Modal, Icons, Spinner, Toast, and more.',
      icon: 'icon-[mdi--puzzle]',
      color: 'secondary',
    },
    {
      id: 3,
      title: 'Utilities',
      description: 'Date formatting, file upload, validation helpers, and SEO utilities.',
      icon: 'icon-[mdi--tools]',
      color: 'accent',
    },
    {
      id: 4,
      title: 'Configuration',
      description: 'Centralized config for colors, fonts, SEO, and app metadata.',
      icon: 'icon-[mdi--cog]',
      color: 'primary',
    },
    {
      id: 5,
      title: 'TypeScript',
      description: 'Fully typed with TypeScript for better developer experience.',
      icon: 'icon-[mdi--language-typescript]',
      color: 'secondary',
    },
    {
      id: 6,
      title: 'Tailwind CSS v4',
      description: 'Modern utility-first CSS with native color classes and theme support.',
      icon: 'icon-[mdi--brush]',
      color: 'accent',
    },
  ];

  const tableColumns = [
    { key: 'name', label: 'Product', sortable: true },
    { key: 'category', label: 'Category', sortable: true },
    { key: 'price', label: 'Price', sortable: true },
    { key: 'status', label: 'Status', sortable: true },
  ];

  const tableData = [
    { id: 1, name: 'Laptop', category: 'Electronics', price: 999, status: 'In Stock' },
    { id: 2, name: 'Mouse', category: 'Accessories', price: 29, status: 'In Stock' },
    { id: 3, name: 'Keyboard', category: 'Accessories', price: 79, status: 'Out of Stock' },
    { id: 4, name: 'Monitor', category: 'Electronics', price: 299, status: 'In Stock' },
    { id: 5, name: 'Headphones', category: 'Audio', price: 149, status: 'In Stock' },
    { id: 6, name: 'Webcam', category: 'Accessories', price: 89, status: 'In Stock' },
    { id: 7, name: 'Speaker', category: 'Audio', price: 199, status: 'Out of Stock' },
    { id: 8, name: 'Tablet', category: 'Electronics', price: 499, status: 'In Stock' },
  ];

  const now = new Date();
  const dateFormatter = useDateFormat(now);

  const shortDate = computed(() => dateFormatter.formatPreset('short'));
  const mediumDate = computed(() => dateFormatter.formatPreset('medium'));
  const longDate = computed(() => dateFormatter.formatPreset('long'));
  const relativeDate = computed(() => dateFormatter.relative());
  const customDate = computed(() => dateFormatter.custom('MMM dd, yyyy HH:mm'));

  const showToast = (type: 'success' | 'error' | 'warning' | 'info', message: string) => {
    switch (type) {
      case 'success':
        success(message);
        break;
      case 'error':
        error(message);
        break;
      case 'warning':
        warning(message);
        break;
      case 'info':
        info(message);
        break;
    }
  };

  const openImageModal = (index: number) => {
    imageModalIndex.value = index;
    isImageModalOpen.value = true;
  };

  const scrollToFeatures = () => {
    document.getElementById('features')?.scrollIntoView({ behavior: 'smooth' });
  };

  onMounted(() => {
    useSeo({
      title: appTitle.value,
      description: appDescription.value,
    });
  });
</script>
