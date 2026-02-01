<template>
  <div class="bg-background text-text min-h-screen">
    <!-- Hero Section -->
    <section class="from-primary/10 via-secondary/10 to-accent/10 bg-gradient-to-br py-20">
      <div class="container mx-auto px-4">
        <div class="mx-auto max-w-3xl text-center">
          <AppText
            variant="h1"
            :responsiveSize="{ sm: '4xl', md: '5xl', lg: '6xl' }"
            align="center"
            class="mb-6"
          >
            {{ appTitle }}
          </AppText>
          <AppText
            variant="p"
            size="xl"
            color="text-secondary"
            align="center"
            class="mb-8"
          >
            {{ appDescription }}
          </AppText>
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
        <AppText variant="h2" align="center" class="mb-12">Features</AppText>
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

    <!-- AppText Component Showcase -->
    <section class="py-16">
      <div class="container mx-auto px-4">
        <AppText variant="h2" align="center" class="mb-12">AppText Component Showcase</AppText>

        <div class="mx-auto max-w-4xl space-y-8">
          <!-- Variants -->
          <div class="bg-surface border-border rounded-lg border p-6">
            <AppText variant="h3" class="mb-4">Typography Variants</AppText>
            <div class="space-y-3">
              <AppText variant="h1">Heading 1 - Bold & Large</AppText>
              <AppText variant="h2" color="primary">Heading 2 - Primary Color</AppText>
              <AppText variant="h3" color="secondary">Heading 3 - Secondary Color</AppText>
              <AppText variant="h4">Heading 4 - Semibold</AppText>
              <AppText variant="h5">Heading 5 - Medium Weight</AppText>
              <AppText variant="h6">Heading 6 - Base Size</AppText>
              <AppText variant="p">Paragraph text with relaxed line height for better readability.</AppText>
              <AppText variant="label">Label Text - Small & Medium</AppText>
              <AppText variant="caption" color="text-secondary">Caption text - Extra small</AppText>
              <AppText variant="overline">Overline Text</AppText>
            </div>
          </div>

          <!-- Colors -->
          <div class="bg-surface border-border rounded-lg border p-6">
            <AppText variant="h3" class="mb-4">Color Variants</AppText>
            <div class="flex flex-wrap gap-3">
              <AppText color="primary" weight="semibold">Primary</AppText>
              <AppText color="secondary" weight="semibold">Secondary</AppText>
              <AppText color="accent" weight="semibold">Accent</AppText>
              <AppText color="success" weight="semibold">Success</AppText>
              <AppText color="warning" weight="semibold">Warning</AppText>
              <AppText color="error" weight="semibold">Error</AppText>
              <AppText color="info" weight="semibold">Info</AppText>
              <AppText color="text-secondary">Text Secondary</AppText>
            </div>
          </div>

          <!-- Sizes -->
          <div class="bg-surface border-border rounded-lg border p-6">
            <AppText variant="h3" class="mb-4">Size Variants</AppText>
            <div class="space-y-2">
              <AppText size="xs">Extra Small Text (xs)</AppText>
              <AppText size="sm">Small Text (sm)</AppText>
              <AppText size="base">Base Text (base)</AppText>
              <AppText size="lg">Large Text (lg)</AppText>
              <AppText size="xl">Extra Large Text (xl)</AppText>
              <AppText size="2xl">2XL Text (2xl)</AppText>
              <AppText size="3xl">3XL Text (3xl)</AppText>
              <AppText size="4xl">4XL Text (4xl)</AppText>
            </div>
          </div>

          <!-- Weights -->
          <div class="bg-surface border-border rounded-lg border p-6">
            <AppText variant="h3" class="mb-4">Font Weights</AppText>
            <div class="space-y-2">
              <AppText weight="light">Light Weight (300)</AppText>
              <AppText weight="normal">Normal Weight (400)</AppText>
              <AppText weight="medium">Medium Weight (500)</AppText>
              <AppText weight="semibold">Semibold Weight (600)</AppText>
              <AppText weight="bold">Bold Weight (700)</AppText>
            </div>
          </div>

          <!-- Truncation -->
          <div class="bg-surface border-border rounded-lg border p-6">
            <AppText variant="h3" class="mb-4">Truncation & Line Clamp</AppText>
            <div class="space-y-4">
              <div>
                <AppText variant="label" class="mb-2">Single Line Truncate:</AppText>
                <AppText :truncate="true" class="max-w-md">
                  This is a very long text that will be truncated with an ellipsis when it exceeds the container width. Only one line will be shown.
                </AppText>
              </div>
              <div>
                <AppText variant="label" class="mb-2">Line Clamp (3 lines):</AppText>
                <AppText :lineClamp="3" class="max-w-md">
                  This is a longer paragraph that demonstrates the line clamp feature. When text exceeds three lines, it will be truncated with an ellipsis. This is useful for card layouts, previews, and content that needs to maintain a consistent height across multiple items.
                </AppText>
              </div>
            </div>
          </div>

          <!-- Gradient Text -->
          <div class="bg-surface border-border rounded-lg border p-6">
            <AppText variant="h3" class="mb-4">Gradient Text</AppText>
            <div class="space-y-3">
              <AppText
                size="3xl"
                weight="bold"
                :gradient="true"
                gradientFrom="primary"
                gradientTo="secondary"
              >
                Primary to Secondary Gradient
              </AppText>
              <AppText
                size="2xl"
                weight="bold"
                :gradient="true"
                gradientFrom="accent"
                gradientVia="warning"
                gradientTo="error"
              >
                Multi-Color Gradient with Via
              </AppText>
            </div>
          </div>

          <!-- Text Transforms & Decorations -->
          <div class="bg-surface border-border rounded-lg border p-6">
            <AppText variant="h3" class="mb-4">Transforms & Decorations</AppText>
            <div class="space-y-2">
              <AppText transform="uppercase">Uppercase Text</AppText>
              <AppText transform="lowercase">LOWERCASE TEXT</AppText>
              <AppText transform="capitalize">capitalize each word</AppText>
              <AppText decoration="underline">Underlined Text</AppText>
              <AppText decoration="underline" decorationStyle="wavy" color="error">Wavy Underline</AppText>
              <AppText decoration="line-through" color="text-secondary">Strikethrough Text</AppText>
            </div>
          </div>

          <!-- Alignment & Spacing -->
          <div class="bg-surface border-border rounded-lg border p-6">
            <AppText variant="h3" class="mb-4">Alignment & Spacing</AppText>
            <div class="space-y-3">
              <AppText align="left">Left Aligned Text</AppText>
              <AppText align="center">Center Aligned Text</AppText>
              <AppText align="right">Right Aligned Text</AppText>
              <AppText tracking="widest" transform="uppercase">Wide Letter Spacing</AppText>
              <AppText tracking="tighter">Tight Letter Spacing</AppText>
            </div>
          </div>

          <!-- Font Families -->
          <div class="bg-surface border-border rounded-lg border p-6">
            <AppText variant="h3" class="mb-4">Font Families</AppText>
            <div class="space-y-2">
              <AppText font="primary">Primary Font (IBM Plex Sans)</AppText>
              <AppText font="secondary">Secondary Font (Georgia)</AppText>
              <AppText font="mono">Monospace Font (Fira Code)</AppText>
            </div>
          </div>

          <!-- Responsive Sizing -->
          <div class="bg-surface border-border rounded-lg border p-6">
            <AppText variant="h3" class="mb-4">Responsive Sizing</AppText>
            <AppText
              :responsiveSize="{ sm: 'base', md: 'lg', lg: 'xl', xl: '2xl' }"
              align="center"
              color="primary"
              weight="semibold"
            >
              Resize your browser to see this text grow!
            </AppText>
          </div>

          <!-- Max Width -->
          <div class="bg-surface border-border rounded-lg border p-6">
            <AppText variant="h3" class="mb-4">Max Width Control</AppText>
            <div class="space-y-4">
              <AppText maxWidth="xs" class="mx-auto">
                Extra small max width for very narrow content.
              </AppText>
              <AppText maxWidth="md" class="mx-auto">
                Medium max width is perfect for readable paragraphs. This ensures optimal line length for comfortable reading, typically 60-80 characters per line.
              </AppText>
            </div>
          </div>

          <!-- Text Wrapping -->
          <div class="bg-surface border-border rounded-lg border p-6">
            <AppText variant="h3" class="mb-4">Text Wrapping</AppText>
            <div class="space-y-4">
              <div>
                <AppText variant="label" class="mb-2">Balance (for headlines):</AppText>
                <AppText size="2xl" weight="bold" wrap="balance" maxWidth="md">
                  This Headline Uses Text Balance For Better Visual Appearance
                </AppText>
              </div>
              <div>
                <AppText variant="label" class="mb-2">Pretty (for paragraphs):</AppText>
                <AppText wrap="pretty" maxWidth="lg">
                  This paragraph uses text-wrap: pretty which prevents orphans and improves the overall text layout. It's particularly useful for body text where you want to avoid awkward line breaks.
                </AppText>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Theme & Color Customization -->
    <section class="bg-surface py-16">
      <div class="container mx-auto px-4">
        <AppText variant="h2" align="center" class="mb-12">Theme & Color Customization</AppText>

        <!-- Theme Switcher -->
        <div class="mx-auto mb-12 max-w-2xl">
          <div class="bg-background border-border mb-6 rounded-lg border p-6">
            <AppText variant="h3" class="mb-4">Current Theme: {{ theme }}</AppText>
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
            <AppText variant="h3" class="mb-4">Color Palette</AppText>
            <div class="grid grid-cols-2 gap-4 md:grid-cols-4">
              <div class="bg-primary rounded-lg p-4 text-center text-white">
                <AppText weight="semibold" class="mb-1">Primary</AppText>
                <AppText size="xs" class="opacity-90">{{ currentColors.primary }}</AppText>
              </div>
              <div class="bg-secondary rounded-lg p-4 text-center text-white">
                <AppText weight="semibold" class="mb-1">Secondary</AppText>
                <AppText size="xs" class="opacity-90">{{ currentColors.secondary }}</AppText>
              </div>
              <div class="bg-accent rounded-lg p-4 text-center text-white">
                <AppText weight="semibold" class="mb-1">Accent</AppText>
                <AppText size="xs" class="opacity-90">{{ currentColors.accent }}</AppText>
              </div>
              <div class="bg-success rounded-lg p-4 text-center text-white">
                <AppText weight="semibold" class="mb-1">Success</AppText>
                <AppText size="xs" class="opacity-90">{{ currentColors.success }}</AppText>
              </div>
            </div>
          </div>

          <!-- Color Customizer -->
          <div class="bg-background border-border rounded-lg border p-6">
            <div class="mb-4 flex items-center justify-between">
              <AppText variant="h3">Customize Colors</AppText>
              <button
                @click="resetColors"
                class="bg-surface border-border hover:bg-surface/80 text-text rounded-lg border px-3 py-1 text-sm transition-colors"
              >
                Reset
              </button>
            </div>
            <div class="space-y-4">
              <div class="flex items-center gap-4">
                <AppText variant="label" color="text-secondary" class="w-24">Primary:</AppText>
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
                <AppText variant="label" color="text-secondary" class="w-24">Secondary:</AppText>
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
                <AppText variant="label" color="text-secondary" class="w-24">Accent:</AppText>
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
                <AppText variant="label" color="text-secondary" class="w-24">Success:</AppText>
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

    <!-- AppForm Showcase -->
    <section class="py-16">
      <div class="container mx-auto px-4">
        <h2 class="text-text mb-12 text-center text-4xl font-bold">Form Builder</h2>

        <div class="mx-auto max-w-4xl space-y-8">
          <!-- Basic Form Example -->
          <div class="bg-surface border-border rounded-lg border p-6">
            <h3 class="text-text mb-4 text-2xl font-semibold">Basic Contact Form</h3>
            <p class="text-text-secondary mb-6">
              Simple form with validation using Zod schema
            </p>
            <AppForm
              v-model="contactForm"
              :fields="contactFields"
              :schema="contactSchema"
              @submitted="handleContactSubmit"
            />
          </div>

          <!-- Multi-Column Form Example -->
          <div class="bg-surface border-border rounded-lg border p-6">
            <h3 class="text-text mb-4 text-2xl font-semibold">User Registration Form</h3>
            <p class="text-text-secondary mb-6">
              Multi-column layout with various field types
            </p>
            <AppForm
              v-model="registrationForm"
              :fields="registrationFields"
              :schema="registrationSchema"
              @submitted="handleRegistrationSubmit"
            >
              <template #actions>
                <button
                  type="button"
                  @click="resetRegistrationForm"
                  class="rounded-lg border border-border bg-surface px-6 py-2.5 font-semibold text-text transition-all hover:bg-surface/80"
                >
                  Reset
                </button>
                <button
                  type="submit"
                  class="rounded-lg bg-primary px-6 py-2.5 font-semibold text-white transition-all hover:bg-primary/90"
                >
                  Register
                </button>
              </template>
            </AppForm>
          </div>

          <!-- Advanced Form with API Integration -->
          <div class="bg-surface border-border rounded-lg border p-6">
            <h3 class="text-text mb-4 text-2xl font-semibold">Profile Update Form</h3>
            <p class="text-text-secondary mb-6">
              Form with custom styling and readonly fields
            </p>
            <AppForm
              v-model="profileForm"
              :fields="profileFields"
              :schema="profileSchema"
              container-class="space-y-6"
              @submitted="handleProfileSubmit"
            />
          </div>

          <!-- Form with Custom Row Classes -->
          <div class="bg-surface border-border rounded-lg border p-6">
            <h3 class="text-text mb-4 text-2xl font-semibold">Feedback Form</h3>
            <p class="text-text-secondary mb-6">
              Custom layout with textarea and select fields
            </p>
            <AppForm
              v-model="feedbackForm"
              :fields="feedbackFields"
              :schema="feedbackSchema"
              @submitted="handleFeedbackSubmit"
            />
          </div>

          <!-- Form Submission Results -->
          <div v-if="lastSubmission" class="bg-success/10 border-success rounded-lg border p-6">
            <h3 class="text-success mb-4 text-xl font-semibold">Last Form Submission</h3>
            <pre class="text-text-secondary overflow-x-auto rounded bg-background p-4 text-sm">{{ JSON.stringify(lastSubmission, null, 2) }}</pre>
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
  import { z } from 'zod';
  import AppIcon from '../components/global/AppIcon.vue';
  import AppImageModal from '../components/global/AppImageModal.vue';
  import AppSpinner from '../components/global/AppSpinner.vue';
  import AppTable from '../components/global/AppTable.vue';
  import AppForm from '../components/global/Fields/AppForm.vue';
  import FeatureCard from '../components/FeatureCard.vue';
  import AppText from '../components/global/AppText.vue';
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

  // ===== AppForm Examples =====

  // Contact Form
  const contactForm = ref({
    name: '',
    email: '',
    message: '',
  });

  const contactFields = [
    [{ key: 'name', type: 'text' as const, label: 'Full Name', placeholder: 'Enter your name' }],
    [{ key: 'email', type: 'email' as const, label: 'Email Address', placeholder: 'your@email.com' }],
    [{ key: 'message', type: 'textarea' as const, label: 'Message', placeholder: 'Your message...', rows: 4 }],
  ];

  const contactSchema = z.object({
    name: z.string().min(2, 'Name must be at least 2 characters'),
    email: z.string().email('Invalid email address'),
    message: z.string().min(10, 'Message must be at least 10 characters'),
  });

  // Registration Form
  const registrationForm = ref({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
    country: '',
    bio: '',
  });

  const registrationFields = [
    [
      { key: 'firstName', type: 'text' as const, label: 'First Name', placeholder: 'John' },
      { key: 'lastName', type: 'text' as const, label: 'Last Name', placeholder: 'Doe' },
    ],
    [
      { key: 'email', type: 'email' as const, label: 'Email', placeholder: 'john@example.com' },
      { key: 'phone', type: 'phone' as const, label: 'Phone Number', placeholder: '+1234567890' },
    ],
    [
      { key: 'password', type: 'password' as const, label: 'Password', placeholder: '••••••••' },
      { key: 'confirmPassword', type: 'password' as const, label: 'Confirm Password', placeholder: '••••••••' },
    ],
    [
      {
        key: 'country',
        type: 'select' as const,
        label: 'Country',
        placeholder: 'Select your country',
        items: [
          { label: 'United States', value: 'us' },
          { label: 'United Kingdom', value: 'uk' },
          { label: 'Canada', value: 'ca' },
          { label: 'Australia', value: 'au' },
          { label: 'Germany', value: 'de' },
        ],
      },
    ],
    [{ key: 'bio', type: 'textarea' as const, label: 'Bio', placeholder: 'Tell us about yourself...', rows: 3 }],
  ];

  const registrationSchema = z.object({
    firstName: z.string().min(2, 'First name must be at least 2 characters'),
    lastName: z.string().min(2, 'Last name must be at least 2 characters'),
    email: z.string().email('Invalid email address'),
    phone: z.string().min(10, 'Phone number must be at least 10 digits'),
    password: z.string().min(8, 'Password must be at least 8 characters'),
    confirmPassword: z.string().min(8, 'Password must be at least 8 characters'),
    country: z.string().min(1, 'Please select a country'),
    bio: z.string().optional(),
  }).refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ['confirmPassword'],
  });

  const resetRegistrationForm = () => {
    registrationForm.value = {
      firstName: '',
      lastName: '',
      email: '',
      phone: '',
      password: '',
      confirmPassword: '',
      country: '',
      bio: '',
    };
  };

  // Profile Form
  const profileForm = ref({
    userId: 'USR-12345',
    username: 'johndoe',
    displayName: '',
    email: '',
    phone: '',
    website: '',
    bio: '',
  });

  const profileFields = [
    [
      { key: 'userId', type: 'text' as const, label: 'User ID', readonly: true, customClass: 'md:col-span-1' },
      { key: 'username', type: 'text' as const, label: 'Username', readonly: true, customClass: 'md:col-span-1' },
    ],
    [{ key: 'displayName', type: 'text' as const, label: 'Display Name', placeholder: 'John Doe' }],
    [
      { key: 'email', type: 'email' as const, label: 'Email', placeholder: 'john@example.com' },
      { key: 'phone', type: 'phone' as const, label: 'Phone', placeholder: '+1234567890' },
    ],
    [{ key: 'website', type: 'text' as const, label: 'Website', placeholder: 'https://example.com' }],
    [{ key: 'bio', type: 'textarea' as const, label: 'Biography', placeholder: 'Write something about yourself...', rows: 4 }],
  ];

  const profileSchema = z.object({
    userId: z.string(),
    username: z.string(),
    displayName: z.string().min(2, 'Display name must be at least 2 characters'),
    email: z.string().email('Invalid email address'),
    phone: z.string().min(10, 'Phone number must be at least 10 digits'),
    website: z.string().url('Invalid URL').optional().or(z.literal('')),
    bio: z.string().max(500, 'Bio must be less than 500 characters').optional(),
  });

  // Feedback Form
  const feedbackForm = ref({
    rating: '',
    category: '',
    subject: '',
    feedback: '',
  });

  const feedbackFields = [
    [
      {
        key: 'rating',
        type: 'select' as const,
        label: 'Rating',
        placeholder: 'How would you rate us?',
        items: ['⭐ 1 - Poor', '⭐⭐ 2 - Fair', '⭐⭐⭐ 3 - Good', '⭐⭐⭐⭐ 4 - Very Good', '⭐⭐⭐⭐⭐ 5 - Excellent'],
        customClass: 'md:col-span-1',
      },
      {
        key: 'category',
        type: 'select' as const,
        label: 'Category',
        placeholder: 'Select category',
        items: ['Bug Report', 'Feature Request', 'General Feedback', 'Complaint', 'Compliment'],
        customClass: 'md:col-span-1',
      },
    ],
    [{ key: 'subject', type: 'text' as const, label: 'Subject', placeholder: 'Brief summary of your feedback' }],
    [{ key: 'feedback', type: 'textarea' as const, label: 'Feedback', placeholder: 'Share your thoughts...', rows: 5 }],
  ];

  const feedbackSchema = z.object({
    rating: z.string().min(1, 'Please select a rating'),
    category: z.string().min(1, 'Please select a category'),
    subject: z.string().min(5, 'Subject must be at least 5 characters'),
    feedback: z.string().min(20, 'Feedback must be at least 20 characters'),
  });

  // Form submission handlers
  const lastSubmission = ref<any>(null);

  const handleContactSubmit = (data: any) => {
    lastSubmission.value = { form: 'Contact Form', data };
    showToast('success', 'Contact form submitted successfully!');
  };

  const handleRegistrationSubmit = (data: any) => {
    lastSubmission.value = { form: 'Registration Form', data };
    showToast('success', 'Registration completed successfully!');
  };

  const handleProfileSubmit = (data: any) => {
    lastSubmission.value = { form: 'Profile Form', data };
    showToast('success', 'Profile updated successfully!');
  };

  const handleFeedbackSubmit = (data: any) => {
    lastSubmission.value = { form: 'Feedback Form', data };
    showToast('success', 'Thank you for your feedback!');
  };

  onMounted(() => {
    useSeo({
      title: appTitle.value,
      description: appDescription.value,
    });
  });
</script>
