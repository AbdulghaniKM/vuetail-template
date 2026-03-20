<template>
  <div class="bg-background text-text min-h-screen">
    <!-- Hero Section -->
    <section class="relative overflow-hidden py-24 md:py-32">
      <!-- Animated background blobs -->
      <div class="pointer-events-none absolute inset-0 overflow-hidden">
        <div class="bg-primary/15 absolute -top-24 -left-24 h-96 w-96 animate-pulse rounded-full blur-3xl" />
        <div
          class="bg-secondary/15 absolute -right-24 -bottom-24 h-96 w-96 rounded-full blur-3xl"
          style="animation: pulse 3s ease-in-out infinite 1s"
        />
        <div
          class="bg-accent/10 absolute top-1/2 left-1/2 h-64 w-64 -translate-x-1/2 -translate-y-1/2 rounded-full blur-3xl"
          style="animation: pulse 4s ease-in-out infinite 0.5s"
        />
      </div>

      <div class="container relative z-10 mx-auto px-4">
        <div class="mx-auto max-w-3xl text-center">
          <!-- Badge -->
          <div class="mb-6 inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/10 px-4 py-1.5">
            <span class="bg-primary inline-block h-2 w-2 rounded-full" />
            <span class="text-primary text-sm font-medium">v1.0 &mdash; Production Ready</span>
          </div>

          <AppText
            variant="h1"
            :responsiveSize="{ sm: '4xl', md: '5xl', lg: '6xl' }"
            align="center"
            class="mb-6"
          >
            Build Beautiful Apps with
            <AppText
              variant="span"
              :gradient="true"
              gradientFrom="primary"
              gradientVia="secondary"
              gradientTo="accent"
              weight="bold"
              :responsiveSize="{ sm: '4xl', md: '5xl', lg: '6xl' }"
            >
              VueTail
            </AppText>
          </AppText>

          <AppText variant="p" size="lg" color="text-secondary" align="center" class="mx-auto mb-10 max-w-2xl">
            A modern Vue 3 starter template with Tailwind CSS v4, TypeScript, and a complete
            component library. Ship faster with pre-built, themeable components.
          </AppText>

          <div class="flex flex-wrap justify-center gap-4">
            <AppButton
              variant="primary"
              icon="icon-[heroicons-outline--rocket-launch]"
              label="Get Started"
              size="lg"
              @click="scrollTo('getting-started')"
            />
            <AppButton
              variant="outline"
              icon="icon-[heroicons-outline--cube]"
              label="Explore Components"
              size="lg"
              @click="scrollTo('components')"
            />
          </div>

          <!-- Tech Stack Badges -->
          <div class="mt-12 flex flex-wrap items-center justify-center gap-3">
            <div
              v-for="tech in techStack"
              :key="tech.name"
              class="bg-surface/80 border-border flex items-center gap-2 rounded-full border px-4 py-2 backdrop-blur-sm"
            >
              <AppIcon :name="tech.icon" :size="1.25" :class="tech.color" />
              <span class="text-text text-sm font-medium">{{ tech.name }}</span>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Features Grid -->
    <section id="features" class="border-border border-y py-20">
      <div class="container mx-auto px-4">
        <div class="mb-12 text-center">
          <AppText variant="overline" color="primary" class="mb-2">Why VueTail?</AppText>
          <AppText variant="h2" align="center">Everything You Need, Out of the Box</AppText>
        </div>
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

    <!-- Interactive Component Explorer -->
    <section id="components" class="py-20">
      <div class="container mx-auto px-4">
        <div class="mb-12 text-center">
          <AppText variant="overline" color="primary" class="mb-2">Component Library</AppText>
          <AppText variant="h2" align="center" class="mb-3">Interactive Component Explorer</AppText>
          <AppText variant="p" color="text-secondary" align="center" class="mx-auto max-w-xl">
            Browse and interact with pre-built components. Each one is fully typed, themeable, and ready for production.
          </AppText>
        </div>

        <!-- Tab Navigation -->
        <div class="mx-auto max-w-5xl">
          <div class="border-border mb-8 flex gap-1 overflow-x-auto border-b">
            <button
              v-for="tab in componentTabs"
              :key="tab.key"
              class="flex items-center gap-2 whitespace-nowrap px-5 py-3 text-sm font-medium transition-colors"
              :class="
                activeTab === tab.key
                  ? 'text-primary border-primary border-b-2'
                  : 'text-text-secondary hover:text-text'
              "
              @click="activeTab = tab.key"
            >
              <AppIcon :name="tab.icon" :size="1.125" />
              {{ tab.label }}
            </button>
          </div>

          <!-- Tab: Buttons -->
          <div v-show="activeTab === 'buttons'" class="space-y-6">
            <div class="bg-surface border-border rounded-xl border p-6">
              <AppText variant="h3" class="mb-1">Button Variants</AppText>
              <AppText variant="caption" color="text-secondary" class="mb-5">Eight distinct styles for every use case.</AppText>
              <div class="flex flex-wrap items-center gap-3">
                <AppButton variant="primary" label="Primary" icon="icon-[heroicons-outline--star]" />
                <AppButton variant="secondary" label="Secondary" icon="icon-[heroicons-outline--sparkles]" />
                <AppButton variant="ghost" label="Ghost" icon="icon-[heroicons-outline--eye]" />
                <AppButton variant="muted" label="Muted" icon="icon-[heroicons-outline--minus-circle]" />
                <AppButton variant="danger" label="Danger" icon="icon-[heroicons-outline--trash]" />
                <AppButton variant="success" label="Success" icon="icon-[heroicons-outline--check-circle]" />
                <AppButton variant="surface" label="Surface" icon="icon-[heroicons-outline--cube]" />
                <AppButton variant="outline" label="Outline" icon="icon-[heroicons-outline--pencil]" />
              </div>
            </div>
            <div class="grid gap-6 md:grid-cols-2">
              <div class="bg-surface border-border rounded-xl border p-6">
                <AppText variant="h3" class="mb-1">Sizes</AppText>
                <AppText variant="caption" color="text-secondary" class="mb-5">From compact to prominent.</AppText>
                <div class="flex flex-wrap items-center gap-3">
                  <AppButton variant="primary" label="XS" size="xs" />
                  <AppButton variant="primary" label="Small" size="sm" />
                  <AppButton variant="primary" label="Medium" size="md" />
                  <AppButton variant="primary" label="Large" size="lg" />
                </div>
              </div>
              <div class="bg-surface border-border rounded-xl border p-6">
                <AppText variant="h3" class="mb-1">Icon-Only</AppText>
                <AppText variant="caption" color="text-secondary" class="mb-5">With built-in tooltips.</AppText>
                <div class="flex items-center gap-2">
                  <AppButton icon="icon-[heroicons-outline--pencil-square]" tooltip="Edit" icon-only variant="primary" />
                  <AppButton icon="icon-[heroicons-outline--trash]" tooltip="Delete" icon-only variant="danger" />
                  <AppButton icon="icon-[heroicons-outline--eye]" tooltip="View" icon-only variant="ghost" />
                  <AppButton icon="icon-[heroicons-outline--document-duplicate]" tooltip="Duplicate" icon-only variant="muted" />
                  <AppButton icon="icon-[heroicons-outline--arrow-down-tray]" tooltip="Download" icon-only variant="surface" />
                  <AppButton icon="icon-[heroicons-outline--share]" tooltip="Share" icon-only variant="outline" />
                </div>
              </div>
            </div>
            <div class="bg-surface border-border rounded-xl border p-6">
              <AppText variant="h3" class="mb-1">Loading State</AppText>
              <AppText variant="caption" color="text-secondary" class="mb-5">Built-in spinner replaces the icon while loading.</AppText>
              <div class="flex flex-wrap items-center gap-3">
                <AppButton variant="primary" label="Save Changes" icon="icon-[heroicons-outline--check]" :loading="btnLoading" loading-label="Saving..." @click="simulateLoading" />
                <AppButton variant="secondary" label="Uploading" icon="icon-[heroicons-outline--arrow-up-tray]" :loading="true" loading-label="Uploading..." />
                <AppButton variant="outline" label="Processing" :loading="true" />
                <AppButton variant="danger" icon="icon-[heroicons-outline--trash]" tooltip="Delete" icon-only :loading="btnIconLoading" @click="simulateIconLoading" />
              </div>
            </div>
          </div>

          <!-- Tab: Typography -->
          <div v-show="activeTab === 'typography'" class="space-y-6">
            <div class="bg-surface border-border rounded-xl border p-6">
              <AppText variant="h3" class="mb-1">Heading Hierarchy</AppText>
              <AppText variant="caption" color="text-secondary" class="mb-5">Semantic headings with consistent scale.</AppText>
              <div class="space-y-3">
                <AppText variant="h1">Heading 1</AppText>
                <AppText variant="h2">Heading 2</AppText>
                <AppText variant="h3">Heading 3</AppText>
                <AppText variant="h4">Heading 4</AppText>
                <AppText variant="h5">Heading 5</AppText>
                <AppText variant="h6">Heading 6</AppText>
              </div>
            </div>
            <div class="grid gap-6 md:grid-cols-2">
              <div class="bg-surface border-border rounded-xl border p-6">
                <AppText variant="h3" class="mb-1">Colors</AppText>
                <AppText variant="caption" color="text-secondary" class="mb-5">Semantic color tokens.</AppText>
                <div class="flex flex-wrap gap-3">
                  <AppText color="primary" weight="semibold">Primary</AppText>
                  <AppText color="secondary" weight="semibold">Secondary</AppText>
                  <AppText color="accent" weight="semibold">Accent</AppText>
                  <AppText color="success" weight="semibold">Success</AppText>
                  <AppText color="warning" weight="semibold">Warning</AppText>
                  <AppText color="error" weight="semibold">Error</AppText>
                </div>
              </div>
              <div class="bg-surface border-border rounded-xl border p-6">
                <AppText variant="h3" class="mb-1">Gradient Text</AppText>
                <AppText variant="caption" color="text-secondary" class="mb-5">Eye-catching gradients.</AppText>
                <div class="space-y-2">
                  <AppText size="2xl" weight="bold" :gradient="true" gradientFrom="primary" gradientTo="secondary">
                    Primary to Secondary
                  </AppText>
                  <AppText size="2xl" weight="bold" :gradient="true" gradientFrom="accent" gradientVia="warning" gradientTo="error">
                    Multi-Color Gradient
                  </AppText>
                </div>
              </div>
            </div>
          </div>

          <!-- Tab: Forms -->
          <div v-show="activeTab === 'forms'" class="space-y-6">
            <div class="bg-surface border-border rounded-xl border p-6">
              <AppText variant="h3" class="mb-1">Contact Form</AppText>
              <AppText variant="caption" color="text-secondary" class="mb-5">Zod-validated form with instant error feedback.</AppText>
              <AppForm
                v-model="contactForm"
                :fields="contactFields"
                :schema="contactSchema"
                @submitted="handleFormSubmit('Contact', $event)"
              />
            </div>
            <div class="bg-surface border-border rounded-xl border p-6">
              <AppText variant="h3" class="mb-1">Registration Form</AppText>
              <AppText variant="caption" color="text-secondary" class="mb-5">Multi-column layout with selects, date picker, and phone input.</AppText>
              <AppForm
                v-model="registrationForm"
                :fields="registrationFields"
                :schema="registrationSchema"
                @submitted="handleFormSubmit('Registration', $event)"
              >
                <template #actions>
                  <AppButton variant="outline" label="Reset" icon="icon-[heroicons-outline--arrow-path]" @click="resetRegistrationForm" />
                  <button
                    type="submit"
                    class="bg-primary hover:bg-primary/90 rounded-lg px-6 py-2.5 font-semibold text-white transition-all"
                  >
                    Register
                  </button>
                </template>
              </AppForm>
            </div>
            <div class="grid gap-6 md:grid-cols-2">
              <div class="bg-surface border-border rounded-xl border p-6">
                <AppText variant="h3" class="mb-1">DatePicker</AppText>
                <AppText variant="caption" color="text-secondary" class="mb-5">Calendar with optional time.</AppText>
                <div class="space-y-4">
                  <DatePicker v-model="demoDate" label="Date only" placeholder="Pick a date" />
                  <DatePicker v-model="demoDateTime" label="Date & Time" mode="datetime" placeholder="Pick date and time" />
                </div>
              </div>
              <div class="bg-surface border-border rounded-xl border p-6">
                <AppText variant="h3" class="mb-1">File Upload</AppText>
                <AppText variant="caption" color="text-secondary" class="mb-5">Select and display files.</AppText>
                <div class="space-y-4">
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
            </div>
            <!-- Form Submission Results -->
            <div v-if="lastSubmission" class="bg-success/10 border-success/30 rounded-xl border p-6">
              <AppText variant="h4" color="success" class="mb-3">Last Submission: {{ lastSubmission.form }}</AppText>
              <pre class="bg-background text-text-secondary overflow-x-auto rounded-lg p-4 text-sm">{{ JSON.stringify(lastSubmission.data, null, 2) }}</pre>
            </div>
          </div>

          <!-- Tab: Data Display -->
          <div v-show="activeTab === 'data'" class="space-y-6">
            <div class="bg-surface border-border rounded-xl border p-6">
              <AppText variant="h3" class="mb-1">Data Table</AppText>
              <AppText variant="caption" color="text-secondary" class="mb-5">Search, sort, paginate, and toggle column visibility.</AppText>
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
                  <AppButton variant="primary" icon="icon-[heroicons-outline--plus]" label="Add Product" @click="showToast('info', 'Add product clicked!')" />
                </template>
                <template #cell-price="{ value }">
                  <span class="text-primary font-semibold">${{ value }}</span>
                </template>
                <template #cell-status="{ value }">
                  <span
                    class="rounded-full px-2.5 py-1 text-xs font-medium"
                    :class="value === 'In Stock' ? 'bg-success/15 text-success' : 'bg-error/15 text-error'"
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
            <div class="grid gap-6 md:grid-cols-2">
              <div class="bg-surface border-border rounded-xl border p-6">
                <AppText variant="h3" class="mb-1">Icons</AppText>
                <AppText variant="caption" color="text-secondary" class="mb-5">200k+ icons via Iconify.</AppText>
                <div class="grid grid-cols-4 gap-4">
                  <div
                    v-for="icon in demoIcons"
                    :key="icon"
                    class="hover:bg-background flex flex-col items-center gap-2 rounded-lg p-3 transition-colors"
                  >
                    <AppIcon :name="icon" :size="2.5" class="text-primary" />
                    <span class="text-text-secondary text-center text-xs">{{ icon.split('--')[1]?.replace(']', '') }}</span>
                  </div>
                </div>
              </div>
              <div class="bg-surface border-border rounded-xl border p-6">
                <AppText variant="h3" class="mb-1">Image Gallery</AppText>
                <AppText variant="caption" color="text-secondary" class="mb-5">Click to open fullscreen modal.</AppText>
                <div class="grid grid-cols-3 gap-3">
                  <img
                    v-for="(img, index) in demoImages"
                    :key="index"
                    :src="img"
                    alt="Demo image"
                    class="h-24 w-full cursor-pointer rounded-lg object-cover transition-opacity hover:opacity-80"
                    @click="openImageModal(index)"
                  />
                </div>
              </div>
            </div>
          </div>

          <!-- Tab: Feedback -->
          <div v-show="activeTab === 'feedback'" class="space-y-6">
            <div class="grid gap-6 md:grid-cols-2">
              <div class="bg-surface border-border rounded-xl border p-6">
                <AppText variant="h3" class="mb-1">Modals</AppText>
                <AppText variant="caption" color="text-secondary" class="mb-5">Animated with Escape close, scroll lock, icons, and loading overlay.</AppText>
                <div class="flex flex-wrap gap-3">
                  <AppButton variant="primary" label="With Icon" icon="icon-[heroicons-outline--sparkles]" @click="demoModalSize = 'md'; demoModalOpen = true" />
                  <AppButton variant="outline" label="With Footer" @click="demoModalFooter = true; demoModalSize = 'md'; demoModalOpen = true" />
                  <AppButton variant="secondary" label="Persistent" @click="persistentModalOpen = true" />
                  <AppButton variant="surface" label="Loading" @click="loadingModalOpen = true; simulateModalLoading()" />
                </div>
              </div>
              <div class="bg-surface border-border rounded-xl border p-6">
                <AppText variant="h3" class="mb-1">Danger Confirmation</AppText>
                <AppText variant="caption" color="text-secondary" class="mb-5">Pre-built destructive action dialog.</AppText>
                <div class="flex flex-wrap gap-3">
                  <AppButton variant="danger" icon="icon-[heroicons-outline--trash]" label="Delete Item" @click="dangerModalOpen = true" />
                  <AppButton variant="danger" icon="icon-[heroicons-outline--exclamation-triangle]" label="With Loading" @click="dangerLoadingModalOpen = true" />
                </div>
              </div>
            </div>
            <div class="grid gap-6 md:grid-cols-2">
              <div class="bg-surface border-border rounded-xl border p-6">
                <AppText variant="h3" class="mb-1">Toast Notifications</AppText>
                <AppText variant="caption" color="text-secondary" class="mb-5">Non-blocking alerts.</AppText>
                <div class="grid grid-cols-2 gap-3">
                  <AppButton variant="primary" label="Success" icon="icon-[heroicons-outline--check-circle]" @click="showToast('success', 'Operation completed!')" />
                  <AppButton variant="danger" label="Error" icon="icon-[heroicons-outline--x-circle]" @click="showToast('error', 'Something went wrong!')" />
                  <AppButton variant="surface" label="Warning" icon="icon-[heroicons-outline--exclamation-triangle]" @click="showToast('warning', 'Check your input')" />
                  <AppButton variant="outline" label="Info" icon="icon-[heroicons-outline--information-circle]" @click="showToast('info', 'Here is some info')" />
                </div>
              </div>
              <div class="bg-surface border-border rounded-xl border p-6">
                <AppText variant="h3" class="mb-1">Tooltips</AppText>
                <AppText variant="caption" color="text-secondary" class="mb-5">Four placement options.</AppText>
                <div class="flex flex-wrap items-center justify-center gap-4 py-4">
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
            <div class="bg-surface border-border rounded-xl border p-6">
              <AppText variant="h3" class="mb-1">Loading Spinners</AppText>
              <AppText variant="caption" color="text-secondary" class="mb-5">Five sizes for any context.</AppText>
              <div class="flex items-end gap-8">
                <div v-for="size in (['xs', 'sm', 'md', 'lg', 'xl'] as const)" :key="size" class="flex flex-col items-center gap-2">
                  <AppSpinner :size="size" />
                  <span class="text-text-secondary text-xs uppercase">{{ size }}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Theme Playground -->
    <section id="theme" class="bg-surface border-border border-y py-20">
      <div class="container mx-auto px-4">
        <div class="mb-12 text-center">
          <AppText variant="overline" color="primary" class="mb-2">Customization</AppText>
          <AppText variant="h2" align="center" class="mb-3">Theme Playground</AppText>
          <AppText variant="p" color="text-secondary" align="center" class="mx-auto max-w-xl">
            Switch between light and dark mode, or customize every color in real-time.
          </AppText>
        </div>

        <div class="mx-auto max-w-3xl space-y-8">
          <!-- Theme Switcher -->
          <div class="bg-background border-border rounded-xl border p-6">
            <div class="flex items-center justify-between">
              <div>
                <AppText variant="h3" class="mb-1">Theme Mode</AppText>
                <AppText variant="caption" color="text-secondary">
                  Current: <span class="text-primary font-semibold capitalize">{{ theme }}</span>
                </AppText>
              </div>
              <div class="flex gap-2">
                <AppButton
                  :variant="theme === 'light' ? 'primary' : 'outline'"
                  icon="icon-[heroicons-outline--sun]"
                  label="Light"
                  @click="setTheme('light')"
                />
                <AppButton
                  :variant="theme === 'dark' ? 'primary' : 'outline'"
                  icon="icon-[heroicons-outline--moon]"
                  label="Dark"
                  @click="setTheme('dark')"
                />
                <AppButton
                  :variant="mode === 'system' ? 'primary' : 'outline'"
                  icon="icon-[heroicons-outline--computer-desktop]"
                  label="System"
                  @click="setTheme('system')"
                />
              </div>
            </div>
          </div>

          <!-- Color Palette -->
          <div class="bg-background border-border rounded-xl border p-6">
            <div class="mb-5 flex items-center justify-between">
              <AppText variant="h3">Color Palette</AppText>
              <AppButton variant="ghost" label="Reset" icon="icon-[heroicons-outline--arrow-path]" size="sm" @click="resetColors" />
            </div>
            <div class="grid grid-cols-2 gap-4 md:grid-cols-3">
              <div
                v-for="colorKey in (['primary', 'secondary', 'accent', 'success', 'warning', 'error'] as const)"
                :key="colorKey"
                class="flex items-center gap-3"
              >
                <input
                  type="color"
                  :value="(currentColors as any)[colorKey]"
                  @input="updateColor(colorKey, ($event.target as HTMLInputElement).value)"
                  class="border-border h-10 w-10 cursor-pointer rounded-lg border"
                />
                <div>
                  <AppText variant="label" class="capitalize">{{ colorKey }}</AppText>
                  <AppText variant="caption" color="text-secondary" class="font-mono">{{ (currentColors as any)[colorKey] }}</AppText>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Utilities Section -->
    <section class="py-20">
      <div class="container mx-auto px-4">
        <div class="mb-12 text-center">
          <AppText variant="overline" color="primary" class="mb-2">Utilities</AppText>
          <AppText variant="h2" align="center" class="mb-3">Built-in Helpers</AppText>
          <AppText variant="p" color="text-secondary" align="center" class="mx-auto max-w-xl">
            Common utilities for dates, display formatting, and more.
          </AppText>
        </div>

        <div class="mx-auto grid max-w-4xl gap-6 md:grid-cols-2">
          <div class="bg-surface border-border rounded-xl border p-6">
            <AppText variant="h3" class="mb-4">Date Formatting</AppText>
            <div class="space-y-3">
              <div v-for="(val, label) in dateExamples" :key="label" class="flex items-center justify-between">
                <span class="text-text-secondary text-sm">{{ label }}</span>
                <span class="text-text font-mono text-sm">{{ val }}</span>
              </div>
            </div>
          </div>
          <div class="bg-surface border-border rounded-xl border p-6">
            <AppText variant="h3" class="mb-4">display() Utility</AppText>
            <AppText variant="caption" color="text-secondary" class="mb-4">Safe value rendering with fallback.</AppText>
            <div class="space-y-3">
              <div v-for="(val, expr) in displayExamples" :key="expr" class="flex items-center justify-between">
                <span class="text-text-secondary font-mono text-xs">{{ expr }}</span>
                <span class="text-text font-mono text-sm">{{ val }}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Getting Started -->
    <section id="getting-started" class="bg-surface border-border border-y py-20">
      <div class="container mx-auto px-4">
        <div class="mb-12 text-center">
          <AppText variant="overline" color="primary" class="mb-2">Quick Start</AppText>
          <AppText variant="h2" align="center" class="mb-3">Get Up and Running</AppText>
          <AppText variant="p" color="text-secondary" align="center" class="mx-auto max-w-xl">
            Clone, install, and start building in under a minute.
          </AppText>
        </div>

        <div class="mx-auto max-w-2xl">
          <div class="bg-background border-border overflow-hidden rounded-xl border">
            <div class="border-border flex items-center gap-2 border-b px-4 py-3">
              <span class="h-3 w-3 rounded-full bg-red-400/80" />
              <span class="h-3 w-3 rounded-full bg-yellow-400/80" />
              <span class="h-3 w-3 rounded-full bg-green-400/80" />
              <span class="text-text-secondary ml-2 text-sm">Terminal</span>
            </div>
            <div class="p-6">
              <pre class="text-text text-sm leading-relaxed"><code><span class="text-text-secondary"># Clone the template</span>
<span class="text-success">$</span> git clone https://github.com/your-username/vuetail-template.git
<span class="text-success">$</span> cd vuetail-template

<span class="text-text-secondary"># Install dependencies</span>
<span class="text-success">$</span> pnpm install

<span class="text-text-secondary"># Start development server</span>
<span class="text-success">$</span> pnpm dev</code></pre>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Config Overview -->
    <section class="py-20">
      <div class="container mx-auto px-4">
        <div class="mx-auto max-w-2xl text-center">
          <AppText variant="overline" color="primary" class="mb-2">Configuration</AppText>
          <AppText variant="h2" align="center" class="mb-6">One Config, Full Control</AppText>

          <div class="bg-surface border-border rounded-xl border p-6 text-left">
            <div class="space-y-3">
              <div class="flex items-center justify-between">
                <span class="text-text-secondary">App Name</span>
                <span class="text-text font-mono text-sm">{{ appName }}</span>
              </div>
              <div class="flex items-center justify-between">
                <span class="text-text-secondary">Version</span>
                <span class="text-text font-mono text-sm">{{ app.version }}</span>
              </div>
              <div class="flex items-center justify-between">
                <span class="text-text-secondary">Font</span>
                <span class="text-text font-mono text-sm">{{ primaryFont }}</span>
              </div>
              <div class="flex items-center justify-between">
                <span class="text-text-secondary">Container</span>
                <span class="text-text font-mono text-sm">{{ containerMaxWidth }}</span>
              </div>
            </div>
            <div class="bg-muted/50 mt-5 rounded-lg p-3">
              <AppText variant="caption" color="text-secondary">
                All settings live in <code class="bg-background rounded px-1.5 py-0.5 font-mono">app.config.ts</code> &mdash; colors, fonts, SEO, and layout in one place.
              </AppText>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Footer -->
    <footer class="border-border border-t py-10">
      <div class="container mx-auto px-4">
        <div class="flex flex-col items-center justify-between gap-4 md:flex-row">
          <div class="flex items-center gap-2">
            <AppIcon name="heroicons-outline:template" :size="1.5" class="text-primary" />
            <AppText weight="semibold">{{ appName }}</AppText>
          </div>
          <AppText variant="caption" color="text-secondary">
            Built with Vue 3, Tailwind CSS v4, and TypeScript
          </AppText>
        </div>
      </div>
    </footer>

    <!-- Modals -->
    <AppImageModal
      :images="demoImages"
      :is-open="isImageModalOpen"
      :initial-index="imageModalIndex"
      @update:is-open="isImageModalOpen = $event"
      @close="isImageModalOpen = false"
    />

    <AppModal
      :is-open="demoModalOpen"
      title="Demo Modal"
      description="A showcase of the redesigned modal component with icon, description, and animated transitions."
      icon="icon-[heroicons-outline--sparkles]"
      :max-width="demoModalSize"
      @close="demoModalOpen = false; demoModalFooter = false"
    >
      <div class="p-6">
        <AppText variant="p" color="text-secondary">
          This modal features a header icon, description text, Escape key support,
          body scroll lock, and smooth spring-physics animations. Put any content here &mdash;
          forms, tables, images, or other components.
        </AppText>
      </div>
      <template v-if="demoModalFooter" #footer>
        <div class="flex justify-end gap-2">
          <AppButton variant="outline" label="Cancel" @click="demoModalOpen = false; demoModalFooter = false" />
          <AppButton variant="primary" label="Confirm" icon="icon-[heroicons-outline--check]" @click="demoModalOpen = false; demoModalFooter = false; showToast('success', 'Confirmed!')" />
        </div>
      </template>
    </AppModal>

    <AppModal
      :is-open="persistentModalOpen"
      title="Persistent Modal"
      description="This dialog requires explicit user action to dismiss."
      icon="icon-[heroicons-outline--lock-closed]"
      max-width="sm"
      :persistent="true"
      @close="persistentModalOpen = false"
    >
      <div class="p-6">
        <AppText variant="p" color="text-secondary">
          Clicking the backdrop or pressing Escape will not close this modal.
          Use the button below instead.
        </AppText>
      </div>
      <template #footer>
        <div class="flex justify-end">
          <AppButton variant="primary" label="Got it" icon="icon-[heroicons-outline--check]" @click="persistentModalOpen = false" />
        </div>
      </template>
    </AppModal>

    <AppModal
      :is-open="loadingModalOpen"
      title="Processing"
      description="Please wait while we process your request."
      icon="icon-[heroicons-outline--arrow-path]"
      max-width="sm"
      :loading="modalLoading"
      loading-text="Processing your request..."
      @close="loadingModalOpen = false"
    >
      <div class="p-6">
        <AppText variant="p" color="text-secondary">
          The loading overlay blocks interaction until the operation completes.
          Close button and backdrop clicks are disabled during loading.
        </AppText>
      </div>
      <template #footer>
        <div class="flex justify-end">
          <AppButton variant="outline" label="Close" @click="loadingModalOpen = false" />
        </div>
      </template>
    </AppModal>

    <ConfirmDangerModal
      :is-open="dangerModalOpen"
      title="Delete Item"
      message="This will permanently delete the item. This action cannot be undone."
      confirm-label="Delete"
      @close="dangerModalOpen = false"
      @confirm="dangerModalOpen = false; showToast('success', 'Item deleted!')"
    />

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

  // ===== Navigation =====
  const scrollTo = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
  };

  // ===== Tech Stack =====
  const techStack = [
    { name: 'Vue 3', icon: 'icon-[mdi--vuejs]', color: 'text-[#42b883]' },
    { name: 'Tailwind v4', icon: 'icon-[mdi--tailwind]', color: 'text-[#38bdf8]' },
    { name: 'TypeScript', icon: 'icon-[mdi--language-typescript]', color: 'text-[#3178c6]' },
    { name: 'Vite', icon: 'icon-[mdi--lightning-bolt]', color: 'text-[#bd34fe]' },
    { name: 'Pinia', icon: 'icon-[mdi--fruit-pineapple]', color: 'text-[#ffd859]' },
  ];

  // ===== Features =====
  const features = [
    {
      id: 1,
      title: 'Theme System',
      description: 'Light/dark mode with system preference support. Customize colors live in the browser.',
      icon: 'icon-[mdi--palette]',
      color: 'primary',
    },
    {
      id: 2,
      title: 'Component Library',
      description: 'Buttons, Tables, Modals, Forms, Icons, Spinners, Toasts, and more — all typed and themeable.',
      icon: 'icon-[mdi--puzzle]',
      color: 'secondary',
    },
    {
      id: 3,
      title: 'Form Builder',
      description: 'Declarative forms with Zod validation, multi-column layouts, and rich input types.',
      icon: 'icon-[mdi--form-textbox]',
      color: 'accent',
    },
    {
      id: 4,
      title: 'Centralized Config',
      description: 'Colors, fonts, SEO, and app metadata — all controlled from a single config file.',
      icon: 'icon-[mdi--cog]',
      color: 'primary',
    },
    {
      id: 5,
      title: 'TypeScript First',
      description: 'Full type safety across components, composables, utilities, and configuration.',
      icon: 'icon-[mdi--language-typescript]',
      color: 'secondary',
    },
    {
      id: 6,
      title: 'Utility Toolkit',
      description: 'Date formatting, display helpers, error handling, SEO, and validation out of the box.',
      icon: 'icon-[mdi--tools]',
      color: 'accent',
    },
  ];

  // ===== Component Tabs =====
  const componentTabs = [
    { key: 'buttons', label: 'Buttons', icon: 'icon-[heroicons-outline--cursor-arrow-ripple]' },
    { key: 'typography', label: 'Typography', icon: 'icon-[heroicons-outline--document-text]' },
    { key: 'forms', label: 'Forms', icon: 'icon-[heroicons-outline--pencil-square]' },
    { key: 'data', label: 'Data Display', icon: 'icon-[heroicons-outline--table-cells]' },
    { key: 'feedback', label: 'Feedback', icon: 'icon-[heroicons-outline--bell-alert]' },
  ];
  const activeTab = ref('buttons');

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
    { id: 1, name: 'Laptop Pro 16"', category: 'Electronics', description: 'High-performance laptop with M3 chip, 32GB RAM, and 1TB SSD', price: 2499, stock: 12, status: 'In Stock' },
    { id: 2, name: 'Wireless Mouse', category: 'Accessories', description: 'Ergonomic wireless mouse with precision tracking', price: 29, stock: 150, status: 'In Stock' },
    { id: 3, name: 'Mechanical Keyboard', category: 'Accessories', description: 'Cherry MX Blue switches with RGB backlighting', price: 149, stock: 0, status: 'Out of Stock' },
    { id: 4, name: '4K Monitor 27"', category: 'Electronics', description: 'Ultra-sharp 4K IPS display with HDR support', price: 599, stock: 24, status: 'In Stock' },
    { id: 5, name: 'Noise-Cancelling Headphones', category: 'Audio', description: 'Premium over-ear headphones with ANC and 30-hour battery', price: 349, stock: 45, status: 'In Stock' },
    { id: 6, name: 'USB-C Hub', category: 'Accessories', description: 'Multi-port adapter with HDMI, USB-A, and SD card reader', price: 49, stock: 200, status: 'In Stock' },
    { id: 7, name: 'Studio Monitor Speaker', category: 'Audio', description: 'Professional reference monitors with flat frequency response', price: 299, stock: 0, status: 'Out of Stock' },
    { id: 8, name: 'Tablet 11"', category: 'Electronics', description: 'Lightweight tablet with stylus support', price: 499, stock: 67, status: 'In Stock' },
  ];

  // ===== Icons =====
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

  // ===== Images =====
  const demoImages = [
    'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800',
    'https://images.unsplash.com/photo-1518837695005-2083093ee35b?w=800',
    'https://images.unsplash.com/photo-1469474968028-56623f02e42e?w=800',
  ];

  const isImageModalOpen = ref(false);
  const imageModalIndex = ref(0);
  const openImageModal = (index: number) => {
    imageModalIndex.value = index;
    isImageModalOpen.value = true;
  };

  // ===== Toast =====
  const showToast = (type: 'success' | 'error' | 'warning' | 'info', message: string) => {
    switch (type) {
      case 'success': success(message); break;
      case 'error': error(message); break;
      case 'warning': warning(message); break;
      case 'info': info(message); break;
    }
  };

  // ===== Button Loading Demo =====
  const btnLoading = ref(false);
  const btnIconLoading = ref(false);

  const simulateLoading = () => {
    btnLoading.value = true;
    setTimeout(() => {
      btnLoading.value = false;
      showToast('success', 'Changes saved!');
    }, 2000);
  };

  const simulateIconLoading = () => {
    btnIconLoading.value = true;
    setTimeout(() => {
      btnIconLoading.value = false;
      showToast('success', 'Item deleted!');
    }, 1500);
  };

  // ===== Modal =====
  const demoModalOpen = ref(false);
  const demoModalSize = ref<'sm' | 'md' | 'lg'>('md');
  const demoModalFooter = ref(false);
  const persistentModalOpen = ref(false);
  const loadingModalOpen = ref(false);
  const modalLoading = ref(false);
  const dangerModalOpen = ref(false);
  const dangerLoadingModalOpen = ref(false);
  const dangerLoading = ref(false);

  const simulateModalLoading = () => {
    modalLoading.value = true;
    setTimeout(() => {
      modalLoading.value = false;
      showToast('success', 'Processing complete!');
    }, 3000);
  };

  const simulateDangerLoading = () => {
    dangerLoading.value = true;
    setTimeout(() => {
      dangerLoading.value = false;
      dangerLoadingModalOpen.value = false;
      showToast('success', 'Account deleted successfully!');
    }, 2000);
  };

  // ===== Forms =====
  const contactForm = ref({ name: '', email: '', message: '' });
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

  const registrationForm = ref({
    firstName: '', lastName: '', email: '', phone: '',
    password: '', confirmPassword: '', country: '', birthDate: '', meetingTime: '',
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
        key: 'country', type: 'select' as const, label: 'Country', placeholder: 'Select your country',
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
    [{ key: 'meetingTime', type: 'datetime' as const, label: 'Preferred Meeting Time', placeholder: 'Select date and time' }],
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
      firstName: '', lastName: '', email: '', phone: '',
      password: '', confirmPassword: '', country: '', birthDate: '', meetingTime: '',
    };
  };

  // DatePicker
  const demoDate = ref('');
  const demoDateTime = ref('');

  // File Upload
  const selectedFileName = ref('');
  const handleFileSelect = (file: File) => {
    selectedFileName.value = file.name;
    showToast('success', `File selected: ${file.name}`);
  };

  // Submission
  const lastSubmission = ref<any>(null);
  const handleFormSubmit = (formName: string, data: any) => {
    lastSubmission.value = { form: formName, data };
    showToast('success', `${formName} form submitted!`);
  };

  // ===== Date Formatting =====
  const now = new Date();
  const dateFormatter = useDateFormat(now);
  const dateExamples = computed(() => ({
    Short: dateFormatter.formatPreset('short'),
    Medium: dateFormatter.formatPreset('medium'),
    Long: dateFormatter.formatPreset('long'),
    Relative: dateFormatter.relative(),
    Custom: dateFormatter.custom('MMM dd, yyyy HH:mm'),
  }));

  // ===== Display Utility =====
  const displayExamples = computed(() => ({
    'display("Hello")': displayUtil('Hello'),
    'display(null)': displayUtil(null),
    'display("")': displayUtil(''),
    'display(undefined, "—")': displayUtil(undefined, '—'),
  }));

  // ===== SEO =====
  onMounted(() => {
    useSeo({ title: appTitle.value, description: appDescription.value });
  });
</script>
