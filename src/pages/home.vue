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
            <AppButton
              variant="primary"
              icon="icon-[heroicons-outline--rocket-launch]"
              label="Get Started"
              size="lg"
              @click="showToast('success', 'Welcome to the showcase!')"
            />
            <AppButton
              variant="outline"
              icon="icon-[heroicons-outline--arrow-down]"
              label="Explore Features"
              size="lg"
              @click="scrollToFeatures"
            />
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

    <!-- AppButton Showcase -->
    <section class="bg-surface py-16">
      <div class="container mx-auto px-4">
        <AppText variant="h2" align="center" class="mb-12">AppButton Component</AppText>
        <div class="mx-auto max-w-4xl space-y-8">
          <!-- Variants -->
          <div class="bg-background border-border rounded-lg border p-6">
            <AppText variant="h3" class="mb-4">Button Variants</AppText>
            <div class="flex flex-wrap items-center gap-3">
              <AppButton variant="primary" label="Primary" icon="icon-[heroicons-outline--star]" />
              <AppButton variant="ghost" label="Ghost" icon="icon-[heroicons-outline--eye]" />
              <AppButton variant="muted" label="Muted" icon="icon-[heroicons-outline--minus-circle]" />
              <AppButton variant="danger" label="Danger" icon="icon-[heroicons-outline--trash]" />
              <AppButton variant="surface" label="Surface" icon="icon-[heroicons-outline--cube]" />
              <AppButton variant="outline" label="Outline" icon="icon-[heroicons-outline--pencil]" />
            </div>
          </div>

          <!-- Sizes -->
          <div class="bg-background border-border rounded-lg border p-6">
            <AppText variant="h3" class="mb-4">Button Sizes</AppText>
            <div class="flex flex-wrap items-center gap-3">
              <AppButton variant="primary" label="Extra Small" size="xs" />
              <AppButton variant="primary" label="Small" size="sm" />
              <AppButton variant="primary" label="Medium" size="md" />
              <AppButton variant="primary" label="Large" size="lg" />
            </div>
          </div>

          <!-- Icon-only with Tooltip -->
          <div class="bg-background border-border rounded-lg border p-6">
            <AppText variant="h3" class="mb-4">Icon-Only Buttons with Tooltips</AppText>
            <div class="flex items-center gap-2">
              <AppButton icon="icon-[heroicons-outline--pencil-square]" tooltip="Edit" icon-only variant="primary" />
              <AppButton icon="icon-[heroicons-outline--trash]" tooltip="Delete" icon-only variant="danger" />
              <AppButton icon="icon-[heroicons-outline--eye]" tooltip="View" icon-only variant="ghost" />
              <AppButton icon="icon-[heroicons-outline--document-duplicate]" tooltip="Duplicate" icon-only variant="muted" />
              <AppButton icon="icon-[heroicons-outline--arrow-down-tray]" tooltip="Download" icon-only variant="surface" />
              <AppButton icon="icon-[heroicons-outline--share]" tooltip="Share" icon-only variant="outline" />
            </div>
          </div>

          <!-- Disabled & Full Width -->
          <div class="bg-background border-border rounded-lg border p-6">
            <AppText variant="h3" class="mb-4">Disabled & Full Width</AppText>
            <div class="space-y-3">
              <div class="flex gap-3">
                <AppButton variant="primary" label="Disabled" disabled />
                <AppButton variant="outline" label="Disabled Outline" disabled />
              </div>
              <AppButton variant="outline" label="Full Width Button" icon="icon-[heroicons-outline--arrow-right]" full-width />
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- AppTooltip Showcase -->
    <section class="py-16">
      <div class="container mx-auto px-4">
        <AppText variant="h2" align="center" class="mb-12">AppTooltip Component</AppText>
        <div class="mx-auto max-w-2xl">
          <div class="bg-surface border-border rounded-lg border p-6">
            <AppText variant="h3" class="mb-4">Tooltip Placements</AppText>
            <div class="flex flex-wrap items-center justify-center gap-6 py-8">
              <AppTooltip content="Tooltip on top" placement="top">
                <span class="bg-primary/10 text-primary cursor-default rounded-lg px-4 py-2 text-sm font-medium">Top</span>
              </AppTooltip>
              <AppTooltip content="Tooltip on bottom" placement="bottom">
                <span class="bg-secondary/10 text-secondary cursor-default rounded-lg px-4 py-2 text-sm font-medium">Bottom</span>
              </AppTooltip>
              <AppTooltip content="Tooltip at start" placement="start">
                <span class="bg-accent/10 text-accent cursor-default rounded-lg px-4 py-2 text-sm font-medium">Start</span>
              </AppTooltip>
              <AppTooltip content="Tooltip at end" placement="end">
                <span class="bg-success/10 text-success cursor-default rounded-lg px-4 py-2 text-sm font-medium">End</span>
              </AppTooltip>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- AppModal & ConfirmDangerModal Showcase -->
    <section class="bg-surface py-16">
      <div class="container mx-auto px-4">
        <AppText variant="h2" align="center" class="mb-12">Modal Components</AppText>
        <div class="mx-auto max-w-4xl space-y-8">
          <div class="bg-background border-border rounded-lg border p-6">
            <AppText variant="h3" class="mb-4">AppModal</AppText>
            <AppText variant="p" color="text-secondary" class="mb-4">Animated modal with spring physics, backdrop blur, and accent gradient bar.</AppText>
            <div class="flex flex-wrap gap-3">
              <AppButton variant="primary" label="Small Modal" @click="demoModalSize = 'sm'; demoModalOpen = true" />
              <AppButton variant="outline" label="Medium Modal" @click="demoModalSize = 'md'; demoModalOpen = true" />
              <AppButton variant="outline" label="Large Modal" @click="demoModalSize = 'lg'; demoModalOpen = true" />
              <AppButton variant="outline" label="With Footer" @click="demoModalFooter = true; demoModalSize = 'md'; demoModalOpen = true" />
            </div>
          </div>

          <div class="bg-background border-border rounded-lg border p-6">
            <AppText variant="h3" class="mb-4">ConfirmDangerModal</AppText>
            <AppText variant="p" color="text-secondary" class="mb-4">Pre-built danger confirmation dialog with icon, message, and action buttons.</AppText>
            <div class="flex flex-wrap gap-3">
              <AppButton
                variant="danger"
                icon="icon-[heroicons-outline--trash]"
                label="Delete Item"
                @click="dangerModalOpen = true"
              />
              <AppButton
                variant="danger"
                icon="icon-[heroicons-outline--exclamation-triangle]"
                label="With Loading"
                @click="dangerLoadingModalOpen = true"
              />
            </div>
          </div>
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
              <AppButton
                :variant="theme === 'light' ? 'primary' : 'outline'"
                label="Light"
                icon="icon-[heroicons-outline--sun]"
                :class="theme === 'light' ? 'bg-primary text-white' : ''"
                @click="setTheme('light')"
              />
              <AppButton
                :variant="theme === 'dark' ? 'primary' : 'outline'"
                label="Dark"
                icon="icon-[heroicons-outline--moon]"
                :class="theme === 'dark' ? 'bg-primary text-white' : ''"
                @click="setTheme('dark')"
              />
              <AppButton
                :variant="mode === 'system' ? 'primary' : 'outline'"
                label="System"
                icon="icon-[heroicons-outline--computer-desktop]"
                :class="mode === 'system' ? 'bg-primary text-white' : ''"
                @click="setTheme('system')"
              />
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
              <AppButton variant="outline" label="Reset" icon="icon-[heroicons-outline--arrow-path]" @click="resetColors" />
            </div>
            <div class="space-y-4">
              <div v-for="colorKey in ['primary', 'secondary', 'accent', 'success', 'warning', 'error'] as const" :key="colorKey" class="flex items-center gap-4">
                <AppText variant="label" color="text-secondary" class="w-24 capitalize">{{ colorKey }}:</AppText>
                <input
                  type="color"
                  :value="(currentColors as any)[colorKey]"
                  @input="updateColor(colorKey, ($event.target as HTMLInputElement).value)"
                  class="border-border h-10 w-20 cursor-pointer rounded border"
                />
                <input
                  type="text"
                  :value="(currentColors as any)[colorKey]"
                  @input="updateColor(colorKey, ($event.target as HTMLInputElement).value)"
                  class="bg-surface border-border text-text flex-1 rounded-lg border px-3 py-2 font-mono text-sm"
                />
              </div>
            </div>
            <div class="bg-surface mt-6 rounded-lg p-4">
              <p class="text-text-secondary text-sm">
                Colors update instantly! Changes apply to the current theme ({{ theme }}). Switch
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
        <AppText variant="h2" align="center" class="mb-12">Components</AppText>

        <!-- AppTable Demo -->
        <div class="mb-16">
          <AppText variant="h3" class="mb-2">Data Table</AppText>
          <AppText variant="p" color="text-secondary" class="mb-4">
            Search, sort, paginate, toggle column visibility, truncate long text, and customize with toolbar slots.
          </AppText>
          <AppTable
            :columns="tableColumns"
            :data="tableData"
            :searchable="true"
            :paginated="true"
            :items-per-page="5"
            search-placeholder="Search products..."
            show-column-toggle
            columns-visibility-key="demo-products"
          >
            <template #toolbar-end>
              <AppButton
                variant="primary"
                icon="icon-[heroicons-outline--plus]"
                label="Add Product"
                @click="showToast('info', 'Add product clicked!')"
              />
            </template>
            <template #cell-price="{ value }">
              <span class="text-primary font-semibold">${{ value }}</span>
            </template>
            <template #cell-status="{ value }">
              <span
                class="rounded-full px-2.5 py-1 text-xs font-medium"
                :class="
                  value === 'In Stock' ? 'bg-success/15 text-success' : 'bg-error/15 text-error'
                "
              >
                {{ value }}
              </span>
            </template>
            <template #cell-actions="{ row }">
              <div class="flex items-center gap-1">
                <AppButton icon="icon-[heroicons-outline--pencil-square]" tooltip="Edit" icon-only variant="primary" @click="showToast('info', `Edit ${row.name}`)" />
                <AppButton icon="icon-[heroicons-outline--trash]" tooltip="Delete" icon-only variant="danger" @click="showToast('error', `Delete ${row.name}`)" />
              </div>
            </template>
          </AppTable>
        </div>

        <!-- AppIcon Demo -->
        <div class="mb-16">
          <AppText variant="h3" class="mb-4">Icons</AppText>
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
          <AppText variant="h3" class="mb-4">Loading Spinner</AppText>
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
          <AppText variant="h3" class="mb-4">Image Modal</AppText>
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
    <section class="bg-surface py-16">
      <div class="container mx-auto px-4">
        <AppText variant="h2" align="center" class="mb-12">Form Builder</AppText>

        <div class="mx-auto max-w-4xl space-y-8">
          <!-- Basic Form Example -->
          <div class="bg-background border-border rounded-lg border p-6">
            <AppText variant="h3" class="mb-2">Basic Contact Form</AppText>
            <AppText variant="p" color="text-secondary" class="mb-6">
              Simple form with validation using Zod schema
            </AppText>
            <AppForm
              v-model="contactForm"
              :fields="contactFields"
              :schema="contactSchema"
              @submitted="handleContactSubmit"
            />
          </div>

          <!-- Multi-Column Form Example -->
          <div class="bg-background border-border rounded-lg border p-6">
            <AppText variant="h3" class="mb-2">User Registration Form</AppText>
            <AppText variant="p" color="text-secondary" class="mb-6">
              Multi-column layout with password toggle, phone input, select dropdown, DatePicker, and datetime picker
            </AppText>
            <AppForm
              v-model="registrationForm"
              :fields="registrationFields"
              :schema="registrationSchema"
              @submitted="handleRegistrationSubmit"
            >
              <template #actions>
                <AppButton variant="outline" label="Reset" icon="icon-[heroicons-outline--arrow-path]" @click="resetRegistrationForm" />
                <button
                  type="submit"
                  class="rounded-lg bg-primary px-6 py-2.5 font-semibold text-white transition-all hover:bg-primary/90"
                >
                  Register
                </button>
              </template>
            </AppForm>
          </div>

          <!-- Feedback Form -->
          <div class="bg-background border-border rounded-lg border p-6">
            <AppText variant="h3" class="mb-2">Feedback Form</AppText>
            <AppText variant="p" color="text-secondary" class="mb-6">
              Custom layout with textarea and select fields
            </AppText>
            <AppForm
              v-model="feedbackForm"
              :fields="feedbackFields"
              :schema="feedbackSchema"
              @submitted="handleFeedbackSubmit"
            />
          </div>

          <!-- DatePicker Standalone Demo -->
          <div class="bg-background border-border rounded-lg border p-6">
            <AppText variant="h3" class="mb-2">DatePicker Component</AppText>
            <AppText variant="p" color="text-secondary" class="mb-6">
              Calendar date picker with month navigation, min/max constraints, and optional time selection via analog clock.
            </AppText>
            <div class="grid gap-4 md:grid-cols-2">
              <DatePicker
                v-model="demoDate"
                label="Date only"
                placeholder="Pick a date"
              />
              <DatePicker
                v-model="demoDateTime"
                label="Date & Time"
                mode="datetime"
                placeholder="Pick date and time"
              />
            </div>
            <div v-if="demoDate || demoDateTime" class="bg-muted/50 mt-4 rounded-lg p-3">
              <AppText variant="label" color="text-secondary">Selected values:</AppText>
              <div class="mt-1 space-y-1 font-mono text-sm">
                <div v-if="demoDate">Date: <span class="text-primary">{{ demoDate }}</span></div>
                <div v-if="demoDateTime">DateTime: <span class="text-primary">{{ demoDateTime }}</span></div>
              </div>
            </div>
          </div>

          <!-- FileInput & FileDisplay Demo -->
          <div class="bg-background border-border rounded-lg border p-6">
            <AppText variant="h3" class="mb-2">File Upload Components</AppText>
            <AppText variant="p" color="text-secondary" class="mb-6">
              FileInput for selecting files and FileDisplay for showing the attached file with a remove option.
            </AppText>
            <div class="flex flex-wrap items-start gap-4">
              <FileInput
                accept=".pdf,.doc,.docx,.jpg,.png"
                button-label="Choose File"
                @change="handleFileSelect"
              />
              <FileDisplay
                v-if="selectedFileName"
                :file-name="selectedFileName"
                @remove="selectedFileName = ''"
              />
              <span v-else class="text-text-secondary text-sm italic">No file selected</span>
            </div>
          </div>

          <!-- Form Submission Results -->
          <div v-if="lastSubmission" class="bg-success/10 border-success rounded-lg border p-6">
            <AppText variant="h3" color="success" class="mb-4">Last Form Submission</AppText>
            <pre class="text-text-secondary overflow-x-auto rounded bg-background p-4 text-sm">{{ JSON.stringify(lastSubmission, null, 2) }}</pre>
          </div>
        </div>
      </div>
    </section>

    <!-- Utilities Showcase -->
    <section class="py-16">
      <div class="container mx-auto px-4">
        <AppText variant="h2" align="center" class="mb-12">Utilities</AppText>

        <div class="mx-auto max-w-2xl space-y-16">
          <!-- Date Formatting -->
          <div>
            <AppText variant="h3" class="mb-4">Date Formatting</AppText>
            <div class="bg-surface border-border rounded-lg border p-6">
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

          <!-- display() Utility -->
          <div>
            <AppText variant="h3" class="mb-4">display() Utility</AppText>
            <div class="bg-surface border-border rounded-lg border p-6">
              <AppText variant="p" color="text-secondary" class="mb-4">
                Safely renders values with a fallback for null, undefined, empty strings, or "N/A".
              </AppText>
              <div class="space-y-3">
                <div class="flex items-center justify-between">
                  <span class="text-text-secondary font-mono text-sm">display("Hello")</span>
                  <span class="text-text font-mono">{{ displayUtil("Hello") }}</span>
                </div>
                <div class="flex items-center justify-between">
                  <span class="text-text-secondary font-mono text-sm">display(null)</span>
                  <span class="text-text font-mono">{{ displayUtil(null) }}</span>
                </div>
                <div class="flex items-center justify-between">
                  <span class="text-text-secondary font-mono text-sm">display("")</span>
                  <span class="text-text font-mono">{{ displayUtil("") }}</span>
                </div>
                <div class="flex items-center justify-between">
                  <span class="text-text-secondary font-mono text-sm">display("N/A")</span>
                  <span class="text-text font-mono">{{ displayUtil("N/A") }}</span>
                </div>
                <div class="flex items-center justify-between">
                  <span class="text-text-secondary font-mono text-sm">display(undefined, "—")</span>
                  <span class="text-text font-mono">{{ displayUtil(undefined, "—") }}</span>
                </div>
              </div>
            </div>
          </div>

          <!-- Toast Demo -->
          <div>
            <AppText variant="h3" class="mb-4">Toast Notifications</AppText>
            <div class="bg-surface border-border rounded-lg border p-6">
              <div class="grid grid-cols-2 gap-3 md:grid-cols-4">
                <button
                  class="inline-flex h-10 items-center justify-center gap-2 rounded-lg bg-success px-4 text-sm font-medium text-white transition-colors hover:bg-success/90 active:scale-[0.97]"
                  @click="showToast('success', 'Operation completed successfully!')"
                >
                  <AppIcon name="icon-[heroicons-outline--check-circle]" :size="1.125" />
                  Success
                </button>
                <button
                  class="inline-flex h-10 items-center justify-center gap-2 rounded-lg bg-error px-4 text-sm font-medium text-white transition-colors hover:bg-error/90 active:scale-[0.97]"
                  @click="showToast('error', 'Something went wrong!')"
                >
                  <AppIcon name="icon-[heroicons-outline--x-circle]" :size="1.125" />
                  Error
                </button>
                <button
                  class="inline-flex h-10 items-center justify-center gap-2 rounded-lg bg-warning px-4 text-sm font-medium text-white transition-colors hover:bg-warning/90 active:scale-[0.97]"
                  @click="showToast('warning', 'Please check your input')"
                >
                  <AppIcon name="icon-[heroicons-outline--exclamation-triangle]" :size="1.125" />
                  Warning
                </button>
                <button
                  class="inline-flex h-10 items-center justify-center gap-2 rounded-lg bg-info px-4 text-sm font-medium text-white transition-colors hover:bg-info/90 active:scale-[0.97]"
                  @click="showToast('info', 'Here is some information')"
                >
                  <AppIcon name="icon-[heroicons-outline--information-circle]" :size="1.125" />
                  Info
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Config Showcase -->
    <section class="bg-surface py-16">
      <div class="container mx-auto px-4">
        <AppText variant="h2" align="center" class="mb-12">Configuration</AppText>
        <div class="mx-auto max-w-3xl">
          <div class="bg-background border-border rounded-lg border p-6">
            <AppText variant="h3" class="mb-4">Current Configuration</AppText>
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
            <div class="bg-surface mt-6 rounded-lg p-4">
              <p class="text-text-secondary text-sm">
                All configuration is centralized in
                <code class="bg-muted rounded px-2 py-1">app.config.ts</code>
                — customize colors, fonts, SEO, and more in one place.
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

    <!-- Demo Modal -->
    <AppModal
      :is-open="demoModalOpen"
      title="Demo Modal"
      :max-width="demoModalSize"
      @close="demoModalOpen = false; demoModalFooter = false"
    >
      <div class="p-5">
        <AppText variant="p" class="mb-3">This is a {{ demoModalSize }} modal with spring-physics animation, backdrop blur, and a gradient accent bar.</AppText>
        <AppText variant="p" color="text-secondary">You can put any content here — forms, tables, images, or other components.</AppText>
      </div>
      <template v-if="demoModalFooter" #footer>
        <div class="flex justify-end gap-2">
          <AppButton variant="outline" label="Cancel" @click="demoModalOpen = false; demoModalFooter = false" />
          <AppButton variant="primary" label="Confirm" @click="demoModalOpen = false; demoModalFooter = false; showToast('success', 'Confirmed!')" />
        </div>
      </template>
    </AppModal>

    <!-- Danger Modal -->
    <ConfirmDangerModal
      :is-open="dangerModalOpen"
      title="Delete Item"
      message="This will permanently delete the item. This action cannot be undone."
      confirm-label="Delete"
      @close="dangerModalOpen = false"
      @confirm="dangerModalOpen = false; showToast('success', 'Item deleted!')"
    />

    <!-- Danger Modal with Loading -->
    <ConfirmDangerModal
      :is-open="dangerLoadingModalOpen"
      title="Delete Account"
      message="All your data will be permanently removed. This cannot be undone."
      confirm-label="Delete Account"
      :loading="dangerLoading"
      loading-label="Deleting..."
      @close="dangerLoadingModalOpen = false"
      @confirm="simulateDangerLoading"
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
  import AppButton from '../components/global/AppButton.vue';
  import AppTooltip from '../components/global/AppTooltip.vue';
  import AppModal from '../components/global/AppModal.vue';
  import ConfirmDangerModal from '../components/global/ConfirmDangerModal.vue';
  import AppForm from '../components/global/Fields/AppForm.vue';
  import DatePicker from '../components/global/Fields/DatePicker.vue';
  import FileInput from '../components/global/Fields/FileInput.vue';
  import FileDisplay from '../components/global/Fields/FileDisplay.vue';
  import FeatureCard from '../components/FeatureCard.vue';
  import AppText from '../components/global/AppText.vue';
  import { useAppConfig } from '../composables/useAppConfig';
  import { useColorCustomizer } from '../composables/useColorCustomizer';
  import { useDateFormat } from '../composables/useDateFormat';
  import { useTheme } from '../composables/useTheme';
  import { useToast } from '../composables/useToast';
  import { useSeo } from '../utils';
  import { display as displayUtil } from '../utils/display';

  const { appTitle, appDescription, appName, app, primaryFont, containerMaxWidth } = useAppConfig();
  const { theme, mode, setTheme } = useTheme();
  const { success, error, warning, info } = useToast();
  const { updateColor, resetColors, getCurrentColors } = useColorCustomizer();

  const currentColors = computed(() => getCurrentColors());

  // Image Modal
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
      description: 'Light/dark mode with system preference support. Customize colors in one config file.',
      icon: 'icon-[mdi--palette]',
      color: 'primary',
    },
    {
      id: 2,
      title: 'Components',
      description: 'Pre-built components: Table, Modal, Buttons, Icons, Spinner, Toast, and more.',
      icon: 'icon-[mdi--puzzle]',
      color: 'secondary',
    },
    {
      id: 3,
      title: 'Utilities',
      description: 'Date formatting, error handling, display helpers, validation, and SEO utilities.',
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

  // ===== Table Demo =====
  const tableColumns = [
    { key: 'name', label: 'Product', sortable: true },
    { key: 'category', label: 'Category', sortable: true, hideable: true },
    { key: 'description', label: 'Description', truncate: true, hideable: true, defaultHidden: false },
    { key: 'price', label: 'Price', sortable: true },
    { key: 'stock', label: 'Stock', sortable: true, hideable: true },
    { key: 'status', label: 'Status', sortable: true },
    { key: 'actions', label: 'Actions' },
  ];

  const tableData = [
    { id: 1, name: 'Laptop Pro 16"', category: 'Electronics', description: 'High-performance laptop with M3 chip, 32GB RAM, and 1TB SSD storage for professional use', price: 2499, stock: 12, status: 'In Stock' },
    { id: 2, name: 'Wireless Mouse', category: 'Accessories', description: 'Ergonomic wireless mouse with precision tracking', price: 29, stock: 150, status: 'In Stock' },
    { id: 3, name: 'Mechanical Keyboard', category: 'Accessories', description: 'Cherry MX Blue switches with RGB backlighting and customizable macros for gaming and typing', price: 149, stock: 0, status: 'Out of Stock' },
    { id: 4, name: '4K Monitor 27"', category: 'Electronics', description: 'Ultra-sharp 4K IPS display with HDR support', price: 599, stock: 24, status: 'In Stock' },
    { id: 5, name: 'Noise-Cancelling Headphones', category: 'Audio', description: 'Premium over-ear headphones with active noise cancellation and 30-hour battery life', price: 349, stock: 45, status: 'In Stock' },
    { id: 6, name: 'USB-C Hub', category: 'Accessories', description: 'Multi-port adapter with HDMI, USB-A, and SD card reader', price: 49, stock: 200, status: 'In Stock' },
    { id: 7, name: 'Studio Monitor Speaker', category: 'Audio', description: 'Professional studio reference monitors with flat frequency response for mixing and mastering', price: 299, stock: 0, status: 'Out of Stock' },
    { id: 8, name: 'Tablet 11"', category: 'Electronics', description: 'Lightweight tablet with stylus support for drawing and note-taking', price: 499, stock: 67, status: 'In Stock' },
    { id: 9, name: 'Webcam HD', category: 'Accessories', description: 'Full HD 1080p webcam with built-in microphone and auto-focus', price: 79, stock: 88, status: 'In Stock' },
    { id: 10, name: 'Bluetooth Speaker', category: 'Audio', description: 'Portable waterproof speaker with 20-hour battery and deep bass', price: 89, stock: 120, status: 'In Stock' },
    { id: 11, name: 'SSD 2TB', category: 'Electronics', description: 'NVMe M.2 solid state drive with sequential read speeds up to 7000 MB/s', price: 179, stock: 55, status: 'In Stock' },
    { id: 12, name: 'Desk Lamp', category: 'Accessories', description: 'LED desk lamp with adjustable color temperature and brightness', price: 39, stock: 0, status: 'Out of Stock' },
  ];

  // ===== Date Formatting =====
  const now = new Date();
  const dateFormatter = useDateFormat(now);

  const shortDate = computed(() => dateFormatter.formatPreset('short'));
  const mediumDate = computed(() => dateFormatter.formatPreset('medium'));
  const longDate = computed(() => dateFormatter.formatPreset('long'));
  const relativeDate = computed(() => dateFormatter.relative());
  const customDate = computed(() => dateFormatter.custom('MMM dd, yyyy HH:mm'));

  // ===== Toast =====
  const showToast = (type: 'success' | 'error' | 'warning' | 'info', message: string) => {
    switch (type) {
      case 'success': success(message); break;
      case 'error': error(message); break;
      case 'warning': warning(message); break;
      case 'info': info(message); break;
    }
  };

  // ===== Image Modal =====
  const openImageModal = (index: number) => {
    imageModalIndex.value = index;
    isImageModalOpen.value = true;
  };

  const scrollToFeatures = () => {
    document.getElementById('features')?.scrollIntoView({ behavior: 'smooth' });
  };

  // ===== Demo Modal =====
  const demoModalOpen = ref(false);
  const demoModalSize = ref<'sm' | 'md' | 'lg'>('md');
  const demoModalFooter = ref(false);

  // ===== Danger Modal =====
  const dangerModalOpen = ref(false);
  const dangerLoadingModalOpen = ref(false);
  const dangerLoading = ref(false);

  const simulateDangerLoading = () => {
    dangerLoading.value = true;
    setTimeout(() => {
      dangerLoading.value = false;
      dangerLoadingModalOpen.value = false;
      showToast('success', 'Account deleted successfully!');
    }, 2000);
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
    birthDate: '',
    meetingTime: '',
  });

  const registrationFields = [
    [
      { key: 'firstName', type: 'text' as const, label: 'First Name', placeholder: 'John' },
      { key: 'lastName', type: 'text' as const, label: 'Last Name', placeholder: 'Doe' },
    ],
    [
      { key: 'email', type: 'email' as const, label: 'Email', placeholder: 'john@example.com' },
      { key: 'phone', type: 'phone' as const, label: 'Phone Number', placeholder: '1234567890' },
    ],
    [
      { key: 'password', type: 'password' as const, label: 'Password', placeholder: 'Enter password' },
      { key: 'confirmPassword', type: 'password' as const, label: 'Confirm Password', placeholder: 'Confirm password' },
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
      { key: 'birthDate', type: 'date' as const, label: 'Date of Birth', placeholder: 'Select date' },
    ],
    [
      { key: 'meetingTime', type: 'datetime' as const, label: 'Preferred Meeting Time', placeholder: 'Select date and time' },
    ],
  ];

  const registrationSchema = z.object({
    firstName: z.string().min(2, 'First name must be at least 2 characters'),
    lastName: z.string().min(2, 'Last name must be at least 2 characters'),
    email: z.string().email('Invalid email address'),
    phone: z.string().min(10, 'Phone number must be at least 10 digits'),
    password: z.string().min(8, 'Password must be at least 8 characters'),
    confirmPassword: z.string().min(8, 'Password must be at least 8 characters'),
    country: z.string().min(1, 'Please select a country'),
    birthDate: z.string().optional(),
    meetingTime: z.string().optional(),
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
      birthDate: '',
      meetingTime: '',
    };
  };

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
        items: ['1 - Poor', '2 - Fair', '3 - Good', '4 - Very Good', '5 - Excellent'],
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

  // ===== DatePicker Demo =====
  const demoDate = ref('');
  const demoDateTime = ref('');

  // ===== File Upload Demo =====
  const selectedFileName = ref('');

  const handleFileSelect = (file: File) => {
    selectedFileName.value = file.name;
    showToast('success', `File selected: ${file.name}`);
  };

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
