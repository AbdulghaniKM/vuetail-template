<template>
  <div class="bg-background text-text min-h-screen">
    <!-- ═══════════════════════════════════════════════════════════════ -->
    <!-- HERO                                                          -->
    <!-- ═══════════════════════════════════════════════════════════════ -->
    <section class="relative overflow-hidden pb-20 pt-16 md:pb-28 md:pt-24">
      <!-- Subtle grid background -->
      <div class="pointer-events-none absolute inset-0 opacity-[0.03]" style="background-image: url('data:image/svg+xml,<svg xmlns=%22http://www.w3.org/2000/svg%22 width=%2240%22 height=%2240%22><rect width=%2240%22 height=%2240%22 fill=%22none%22 stroke=%22currentColor%22 stroke-width=%220.5%22/></svg>'); background-size: 40px 40px" />
      <!-- Gradient glow — static, no animation -->
      <div class="pointer-events-none absolute -top-32 left-1/2 h-[480px] w-[720px] -translate-x-1/2 rounded-full bg-gradient-to-br from-primary/20 via-secondary/10 to-transparent blur-3xl" />

      <div class="container relative z-10 mx-auto px-4">
        <div class="mx-auto max-w-3xl text-center">
          <div class="mb-5 inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/5 px-3.5 py-1">
            <span class="relative flex h-2 w-2">
              <span class="absolute inline-flex h-full w-full animate-ping rounded-full bg-primary/60" />
              <span class="relative inline-flex h-2 w-2 rounded-full bg-primary" />
            </span>
            <span class="text-primary text-xs font-semibold tracking-wide uppercase">Production Ready</span>
          </div>

          <h1 class="text-text mb-5 text-4xl font-extrabold tracking-tight sm:text-5xl md:text-6xl lg:text-7xl">
            Ship Faster with
            <span class="bg-gradient-to-r from-primary via-secondary to-accent bg-clip-text text-transparent">VueTail</span>
          </h1>

          <p class="text-text-secondary mx-auto mb-10 max-w-xl text-base leading-relaxed md:text-lg">
            A modern Vue 3 + Tailwind CSS v4 starter with a complete component library, theming engine, and production utilities &mdash; all fully typed.
          </p>

          <div class="flex flex-wrap justify-center gap-3">
            <AppButton variant="primary" icon="icon-[heroicons-outline--rocket-launch]" label="Get Started" size="lg" @click="scrollTo('getting-started')" />
            <AppButton variant="outline" icon="icon-[heroicons-outline--cube]" label="Explore Components" size="lg" @click="scrollTo('components')" />
          </div>
        </div>

        <!-- Stats strip -->
        <div class="mx-auto mt-16 grid max-w-2xl grid-cols-2 gap-px overflow-hidden rounded-2xl border border-border bg-border md:grid-cols-4">
          <div v-for="stat in stats" :key="stat.label" class="bg-surface flex flex-col items-center gap-1 px-6 py-5">
            <span class="text-primary text-2xl font-bold">{{ stat.value }}</span>
            <span class="text-text-secondary text-xs font-medium uppercase tracking-wider">{{ stat.label }}</span>
          </div>
        </div>

        <!-- Tech badges -->
        <div class="mt-10 flex flex-wrap items-center justify-center gap-2">
          <div
            v-for="tech in techStack"
            :key="tech.name"
            class="bg-muted/50 flex items-center gap-1.5 rounded-full px-3 py-1.5"
          >
            <AppIcon :name="tech.icon" :size="1" :class="tech.color" />
            <span class="text-text-secondary text-xs font-medium">{{ tech.name }}</span>
          </div>
        </div>
      </div>
    </section>

    <!-- ═══════════════════════════════════════════════════════════════ -->
    <!-- FEATURES — Bento Grid                                         -->
    <!-- ═══════════════════════════════════════════════════════════════ -->
    <section id="features" class="bg-surface py-20">
      <div class="container mx-auto px-4">
        <div class="mb-14 text-center">
          <AppText variant="overline" color="primary" class="mb-2">Why VueTail?</AppText>
          <AppText variant="h2" align="center">Everything You Need, Nothing You Don't</AppText>
        </div>

        <div class="mx-auto grid max-w-5xl gap-4 md:grid-cols-6">
          <!-- Large card — Theme System -->
          <div class="bg-background border-border group rounded-2xl border p-6 md:col-span-4">
            <div class="bg-primary/10 mb-4 inline-flex rounded-xl p-2.5">
              <AppIcon name="icon-[mdi--palette]" :size="1.5" class="text-primary" />
            </div>
            <h3 class="text-text mb-2 text-lg font-semibold">Theme System</h3>
            <p class="text-text-secondary text-sm leading-relaxed">Light, dark, and system modes with real-time color customization. Every color is a CSS variable you can tweak live.</p>
            <div class="mt-5 flex gap-2">
              <div v-for="c in ['bg-primary', 'bg-secondary', 'bg-accent', 'bg-success', 'bg-warning', 'bg-error']" :key="c" :class="c" class="h-6 flex-1 rounded-lg first:rounded-l-xl last:rounded-r-xl" />
            </div>
          </div>

          <!-- Small card — TypeScript -->
          <div class="bg-background border-border rounded-2xl border p-6 md:col-span-2">
            <div class="bg-secondary/10 mb-4 inline-flex rounded-xl p-2.5">
              <AppIcon name="icon-[mdi--language-typescript]" :size="1.5" class="text-secondary" />
            </div>
            <h3 class="text-text mb-2 text-lg font-semibold">TypeScript First</h3>
            <p class="text-text-secondary text-sm leading-relaxed">Every component, composable, and utility is fully typed end-to-end.</p>
          </div>

          <!-- Small card — Forms -->
          <div class="bg-background border-border rounded-2xl border p-6 md:col-span-2">
            <div class="bg-accent/10 mb-4 inline-flex rounded-xl p-2.5">
              <AppIcon name="icon-[mdi--form-textbox]" :size="1.5" class="text-accent" />
            </div>
            <h3 class="text-text mb-2 text-lg font-semibold">Form Builder</h3>
            <p class="text-text-secondary text-sm leading-relaxed">Declarative forms with Zod validation and rich input types.</p>
          </div>

          <!-- Large card — Component Library -->
          <div class="bg-background border-border rounded-2xl border p-6 md:col-span-4">
            <div class="bg-primary/10 mb-4 inline-flex rounded-xl p-2.5">
              <AppIcon name="icon-[mdi--puzzle]" :size="1.5" class="text-primary" />
            </div>
            <h3 class="text-text mb-2 text-lg font-semibold">Component Library</h3>
            <p class="text-text-secondary mb-5 text-sm leading-relaxed">Buttons, Tables, Modals, Forms, Icons, Spinners, Toasts &mdash; all themeable and ready to ship.</p>
            <div class="flex flex-wrap gap-2">
              <span v-for="comp in ['AppButton', 'AppModal', 'AppTable', 'AppForm', 'AppToast', 'AppSpinner', 'DatePicker']" :key="comp" class="bg-muted text-text-secondary rounded-lg px-2.5 py-1 text-xs font-mono">{{ comp }}</span>
            </div>
          </div>

          <!-- Full width — Config + Utilities -->
          <div class="bg-background border-border rounded-2xl border p-6 md:col-span-3">
            <div class="bg-primary/10 mb-4 inline-flex rounded-xl p-2.5">
              <AppIcon name="icon-[mdi--cog]" :size="1.5" class="text-primary" />
            </div>
            <h3 class="text-text mb-2 text-lg font-semibold">Centralized Config</h3>
            <p class="text-text-secondary text-sm leading-relaxed">Colors, fonts, SEO, and app metadata in a single <code class="bg-muted rounded px-1 py-0.5 font-mono text-xs">app.config.ts</code> file.</p>
          </div>

          <div class="bg-background border-border rounded-2xl border p-6 md:col-span-3">
            <div class="bg-accent/10 mb-4 inline-flex rounded-xl p-2.5">
              <AppIcon name="icon-[mdi--tools]" :size="1.5" class="text-accent" />
            </div>
            <h3 class="text-text mb-2 text-lg font-semibold">Utility Toolkit</h3>
            <p class="text-text-secondary text-sm leading-relaxed">Date formatting, display helpers, error handling, SEO, and validation &mdash; batteries included.</p>
          </div>
        </div>
      </div>
    </section>

    <!-- ═══════════════════════════════════════════════════════════════ -->
    <!-- COMPONENT EXPLORER                                            -->
    <!-- ═══════════════════════════════════════════════════════════════ -->
    <section id="components" class="py-20">
      <div class="container mx-auto px-4">
        <div class="mb-14 text-center">
          <AppText variant="overline" color="primary" class="mb-2">Component Library</AppText>
          <AppText variant="h2" align="center" class="mb-3">Interactive Playground</AppText>
          <AppText variant="p" color="text-secondary" align="center" class="mx-auto max-w-lg">
            Every component is typed, themeable, and production-ready. Click around.
          </AppText>
        </div>

        <div class="mx-auto max-w-5xl">
          <!-- Pill tabs -->
          <div class="mb-10 flex flex-wrap justify-center gap-2">
            <button
              v-for="tab in componentTabs"
              :key="tab.key"
              class="flex items-center gap-2 rounded-full px-4 py-2 text-sm font-medium transition-all"
              :class="
                activeTab === tab.key
                  ? 'bg-primary text-white shadow-sm'
                  : 'bg-muted text-text-secondary hover:text-text hover:bg-muted/80'
              "
              @click="activeTab = tab.key"
            >
              <AppIcon :name="tab.icon" :size="1" />
              {{ tab.label }}
            </button>
          </div>

          <!-- Tab: Buttons -->
          <div v-show="activeTab === 'buttons'" class="space-y-5">
            <div class="bg-surface border-border rounded-2xl border p-6">
              <h3 class="text-text mb-1 text-base font-semibold">Variants</h3>
              <p class="text-text-secondary mb-5 text-sm">Eight styles covering every interaction pattern.</p>
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
            <div class="grid gap-5 md:grid-cols-3">
              <div class="bg-surface border-border rounded-2xl border p-6">
                <h3 class="text-text mb-4 text-base font-semibold">Sizes</h3>
                <div class="flex flex-wrap items-center gap-2">
                  <AppButton variant="primary" label="XS" size="xs" />
                  <AppButton variant="primary" label="SM" size="sm" />
                  <AppButton variant="primary" label="MD" size="md" />
                  <AppButton variant="primary" label="LG" size="lg" />
                </div>
              </div>
              <div class="bg-surface border-border rounded-2xl border p-6">
                <h3 class="text-text mb-4 text-base font-semibold">Icon-Only</h3>
                <div class="flex items-center gap-2">
                  <AppButton icon="icon-[heroicons-outline--pencil-square]" tooltip="Edit" icon-only variant="primary" />
                  <AppButton icon="icon-[heroicons-outline--trash]" tooltip="Delete" icon-only variant="danger" />
                  <AppButton icon="icon-[heroicons-outline--eye]" tooltip="View" icon-only variant="ghost" />
                  <AppButton icon="icon-[heroicons-outline--document-duplicate]" tooltip="Copy" icon-only variant="surface" />
                  <AppButton icon="icon-[heroicons-outline--share]" tooltip="Share" icon-only variant="outline" />
                </div>
              </div>
              <div class="bg-surface border-border rounded-2xl border p-6">
                <h3 class="text-text mb-4 text-base font-semibold">Loading</h3>
                <div class="flex flex-wrap items-center gap-2">
                  <AppButton variant="primary" label="Save" icon="icon-[heroicons-outline--check]" :loading="btnLoading" loading-label="Saving..." @click="simulateLoading" />
                  <AppButton variant="danger" icon="icon-[heroicons-outline--trash]" tooltip="Delete" icon-only :loading="btnIconLoading" @click="simulateIconLoading" />
                </div>
              </div>
            </div>
          </div>

          <!-- Tab: Typography -->
          <div v-show="activeTab === 'typography'" class="space-y-5">
            <div class="bg-surface border-border rounded-2xl border p-6">
              <h3 class="text-text mb-5 text-base font-semibold">Type Scale</h3>
              <div class="space-y-2">
                <div v-for="v in (['h1','h2','h3','h4','h5','h6'] as const)" :key="v" class="border-border flex items-baseline gap-4 border-b py-2 last:border-0">
                  <span class="text-text-secondary w-8 font-mono text-xs">{{ v }}</span>
                  <AppText :variant="v">The quick brown fox</AppText>
                </div>
              </div>
            </div>
            <div class="grid gap-5 md:grid-cols-2">
              <div class="bg-surface border-border rounded-2xl border p-6">
                <h3 class="text-text mb-4 text-base font-semibold">Semantic Colors</h3>
                <div class="flex flex-wrap gap-3">
                  <span v-for="c in ['primary','secondary','accent','success','warning','error']" :key="c" class="flex items-center gap-2">
                    <span class="size-3 rounded-full" :class="`bg-${c}`" />
                    <AppText :color="c" weight="medium" size="sm" class="capitalize">{{ c }}</AppText>
                  </span>
                </div>
              </div>
              <div class="bg-surface border-border rounded-2xl border p-6">
                <h3 class="text-text mb-4 text-base font-semibold">Gradients</h3>
                <AppText size="xl" weight="bold" :gradient="true" gradientFrom="primary" gradientTo="secondary" class="mb-2">Primary to Secondary</AppText>
                <AppText size="xl" weight="bold" :gradient="true" gradientFrom="accent" gradientVia="warning" gradientTo="error">Accent to Error</AppText>
              </div>
            </div>
          </div>

          <!-- Tab: Forms -->
          <div v-show="activeTab === 'forms'" class="space-y-5">
            <div class="bg-surface border-border rounded-2xl border p-6">
              <h3 class="text-text mb-1 text-base font-semibold">Contact Form</h3>
              <p class="text-text-secondary mb-5 text-sm">Zod-validated with instant error feedback.</p>
              <AppForm v-model="contactForm" :fields="contactFields" :schema="contactSchema" @submitted="handleFormSubmit('Contact', $event)" />
            </div>
            <div class="grid gap-5 md:grid-cols-2">
              <div class="bg-surface border-border rounded-2xl border p-6">
                <h3 class="text-text mb-4 text-base font-semibold">DatePicker</h3>
                <div class="space-y-4">
                  <DatePicker v-model="demoDate" label="Date only" placeholder="Pick a date" />
                  <DatePicker v-model="demoDateTime" label="Date & Time" mode="datetime" placeholder="Pick date and time" />
                </div>
              </div>
              <div class="bg-surface border-border rounded-2xl border p-6">
                <h3 class="text-text mb-4 text-base font-semibold">File Upload</h3>
                <div class="space-y-4">
                  <FileInput accept=".pdf,.doc,.docx,.jpg,.png" button-label="Choose File" @change="handleFileSelect" />
                  <FileDisplay v-if="selectedFileName" :file-name="selectedFileName" @remove="selectedFileName = ''" />
                  <span v-else class="text-text-secondary text-sm italic">No file selected</span>
                </div>
              </div>
            </div>
            <div v-if="lastSubmission" class="bg-success/5 border-success/20 rounded-2xl border p-5">
              <p class="text-success mb-2 text-sm font-semibold">Submitted: {{ lastSubmission.form }}</p>
              <pre class="bg-background text-text-secondary overflow-x-auto rounded-lg p-3 text-xs">{{ JSON.stringify(lastSubmission.data, null, 2) }}</pre>
            </div>
          </div>

          <!-- Tab: Data Display -->
          <div v-show="activeTab === 'data'" class="space-y-5">
            <div class="bg-surface border-border rounded-2xl border p-6">
              <h3 class="text-text mb-1 text-base font-semibold">Data Table</h3>
              <p class="text-text-secondary mb-5 text-sm">Search, sort, paginate, and toggle columns.</p>
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
                  <AppButton variant="primary" icon="icon-[heroicons-outline--plus]" label="Add" size="sm" @click="showToast('info', 'Add product clicked!')" />
                </template>
                <template #cell-price="{ value }">
                  <span class="text-primary font-semibold">${{ value }}</span>
                </template>
                <template #cell-status="{ value }">
                  <span class="rounded-full px-2.5 py-1 text-xs font-medium" :class="value === 'In Stock' ? 'bg-success/15 text-success' : 'bg-error/15 text-error'">{{ value }}</span>
                </template>
                <template #cell-actions="{ row }">
                  <div class="flex items-center gap-1">
                    <AppButton icon="icon-[heroicons-outline--pencil-square]" tooltip="Edit" icon-only variant="primary" @click="showToast('info', `Edit ${row.name}`)" />
                    <AppButton icon="icon-[heroicons-outline--trash]" tooltip="Delete" icon-only variant="danger" @click="showToast('error', `Delete ${row.name}`)" />
                  </div>
                </template>
              </AppTable>
            </div>
            <div class="grid gap-5 md:grid-cols-2">
              <div class="bg-surface border-border rounded-2xl border p-6">
                <h3 class="text-text mb-4 text-base font-semibold">Icons</h3>
                <div class="grid grid-cols-4 gap-3">
                  <div v-for="icon in demoIcons" :key="icon" class="hover:bg-muted flex flex-col items-center gap-1.5 rounded-xl p-3 transition-colors">
                    <AppIcon :name="icon" :size="2" class="text-primary" />
                    <span class="text-text-secondary text-center text-[10px]">{{ icon.split('--')[1]?.replace(']', '') }}</span>
                  </div>
                </div>
              </div>
              <div class="bg-surface border-border rounded-2xl border p-6">
                <h3 class="text-text mb-4 text-base font-semibold">Image Gallery</h3>
                <div class="grid grid-cols-3 gap-2">
                  <img v-for="(img, index) in demoImages" :key="index" :src="img" alt="Demo" class="h-24 w-full cursor-pointer rounded-xl object-cover transition-all hover:scale-[1.02] hover:shadow-md" @click="openImageModal(index)" />
                </div>
              </div>
            </div>
          </div>

          <!-- Tab: Feedback -->
          <div v-show="activeTab === 'feedback'" class="space-y-5">
            <div class="grid gap-5 md:grid-cols-2">
              <div class="bg-surface border-border rounded-2xl border p-6">
                <h3 class="text-text mb-1 text-base font-semibold">Modals</h3>
                <p class="text-text-secondary mb-4 text-sm">Animated, with Escape close, scroll lock, and loading overlay.</p>
                <div class="flex flex-wrap gap-2">
                  <AppButton variant="primary" label="With Icon" size="sm" @click="demoModalSize = 'md'; demoModalOpen = true" />
                  <AppButton variant="outline" label="Footer" size="sm" @click="demoModalFooter = true; demoModalSize = 'md'; demoModalOpen = true" />
                  <AppButton variant="secondary" label="Persistent" size="sm" @click="persistentModalOpen = true" />
                  <AppButton variant="surface" label="Loading" size="sm" @click="loadingModalOpen = true; simulateModalLoading()" />
                </div>
              </div>
              <div class="bg-surface border-border rounded-2xl border p-6">
                <h3 class="text-text mb-1 text-base font-semibold">Danger Confirmation</h3>
                <p class="text-text-secondary mb-4 text-sm">Pre-built destructive action dialog.</p>
                <div class="flex flex-wrap gap-2">
                  <AppButton variant="danger" icon="icon-[heroicons-outline--trash]" label="Delete" size="sm" @click="dangerModalOpen = true" />
                  <AppButton variant="danger" icon="icon-[heroicons--exclamation-triangle]" label="With Loading" size="sm" @click="dangerLoadingModalOpen = true" />
                </div>
              </div>
            </div>
            <div class="grid gap-5 md:grid-cols-2">
              <div class="bg-surface border-border rounded-2xl border p-6">
                <h3 class="text-text mb-4 text-base font-semibold">Toasts</h3>
                <div class="grid grid-cols-2 gap-2">
                  <AppButton variant="primary" label="Success" size="sm" icon="icon-[heroicons-outline--check-circle]" @click="showToast('success', 'Operation completed!')" />
                  <AppButton variant="danger" label="Error" size="sm" icon="icon-[heroicons-outline--x-circle]" @click="showToast('error', 'Something went wrong!')" />
                  <AppButton variant="surface" label="Warning" size="sm" icon="icon-[heroicons--exclamation-triangle]" @click="showToast('warning', 'Check your input')" />
                  <AppButton variant="outline" label="Info" size="sm" icon="icon-[heroicons-outline--information-circle]" @click="showToast('info', 'Here is some info')" />
                </div>
              </div>
              <div class="bg-surface border-border rounded-2xl border p-6">
                <h3 class="text-text mb-4 text-base font-semibold">Tooltips</h3>
                <div class="flex flex-wrap items-center justify-center gap-3 py-4">
                  <AppTooltip content="Top tooltip" placement="top">
                    <span class="bg-primary/10 text-primary cursor-default rounded-lg px-3 py-1.5 text-sm font-medium">Top</span>
                  </AppTooltip>
                  <AppTooltip content="Bottom tooltip" placement="bottom">
                    <span class="bg-secondary/10 text-secondary cursor-default rounded-lg px-3 py-1.5 text-sm font-medium">Bottom</span>
                  </AppTooltip>
                  <AppTooltip content="Start tooltip" placement="start">
                    <span class="bg-accent/10 text-accent cursor-default rounded-lg px-3 py-1.5 text-sm font-medium">Start</span>
                  </AppTooltip>
                  <AppTooltip content="End tooltip" placement="end">
                    <span class="bg-success/10 text-success cursor-default rounded-lg px-3 py-1.5 text-sm font-medium">End</span>
                  </AppTooltip>
                </div>
              </div>
            </div>
            <div class="bg-surface border-border rounded-2xl border p-6">
              <h3 class="text-text mb-4 text-base font-semibold">Spinners</h3>
              <div class="flex items-end gap-6">
                <div v-for="size in (['xs', 'sm', 'md', 'lg', 'xl'] as const)" :key="size" class="flex flex-col items-center gap-2">
                  <AppSpinner :size="size" />
                  <span class="text-text-secondary text-[10px] font-medium uppercase">{{ size }}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- ═══════════════════════════════════════════════════════════════ -->
    <!-- THEME PLAYGROUND                                              -->
    <!-- ═══════════════════════════════════════════════════════════════ -->
    <section id="theme" class="bg-surface py-20">
      <div class="container mx-auto px-4">
        <div class="mb-14 text-center">
          <AppText variant="overline" color="primary" class="mb-2">Customization</AppText>
          <AppText variant="h2" align="center" class="mb-3">Theme Playground</AppText>
          <AppText variant="p" color="text-secondary" align="center" class="mx-auto max-w-lg">
            Switch modes or customize every color in real-time. Changes apply instantly.
          </AppText>
        </div>

        <div class="mx-auto max-w-3xl space-y-5">
          <!-- Theme mode -->
          <div class="bg-background border-border rounded-2xl border p-6">
            <div class="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <h3 class="text-text text-base font-semibold">Mode</h3>
                <p class="text-text-secondary text-sm">Current: <span class="text-primary font-semibold capitalize">{{ theme }}</span></p>
              </div>
              <div class="flex gap-2">
                <AppButton :variant="theme === 'light' ? 'primary' : 'outline'" icon="icon-[heroicons-outline--sun]" label="Light" size="sm" @click="setTheme('light')" />
                <AppButton :variant="theme === 'dark' ? 'primary' : 'outline'" icon="icon-[heroicons-outline--moon]" label="Dark" size="sm" @click="setTheme('dark')" />
                <AppButton :variant="mode === 'system' ? 'primary' : 'outline'" icon="icon-[heroicons-outline--computer-desktop]" label="System" size="sm" @click="setTheme('system')" />
              </div>
            </div>
          </div>

          <!-- Color palette -->
          <div class="bg-background border-border rounded-2xl border p-6">
            <div class="mb-5 flex items-center justify-between">
              <h3 class="text-text text-base font-semibold">Colors</h3>
              <AppButton variant="ghost" label="Reset" icon="icon-[heroicons-outline--arrow-path]" size="xs" @click="resetColors" />
            </div>
            <div class="grid grid-cols-2 gap-4 md:grid-cols-3">
              <label v-for="colorKey in (['primary', 'secondary', 'accent', 'success', 'warning', 'error'] as const)" :key="colorKey" class="hover:bg-muted/50 flex cursor-pointer items-center gap-3 rounded-xl p-2 transition-colors">
                <input
                  type="color"
                  :value="(currentColors as any)[colorKey]"
                  @input="updateColor(colorKey, ($event.target as HTMLInputElement).value)"
                  class="size-9 cursor-pointer rounded-lg border-0"
                />
                <div class="min-w-0">
                  <p class="text-text text-sm font-medium capitalize">{{ colorKey }}</p>
                  <p class="text-text-secondary truncate font-mono text-xs">{{ (currentColors as any)[colorKey] }}</p>
                </div>
              </label>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- ═══════════════════════════════════════════════════════════════ -->
    <!-- UTILITIES                                                     -->
    <!-- ═══════════════════════════════════════════════════════════════ -->
    <section class="py-20">
      <div class="container mx-auto px-4">
        <div class="mb-14 text-center">
          <AppText variant="overline" color="primary" class="mb-2">Utilities</AppText>
          <AppText variant="h2" align="center">Built-in Helpers</AppText>
        </div>

        <div class="mx-auto grid max-w-4xl gap-5 md:grid-cols-2">
          <div class="bg-surface border-border rounded-2xl border p-6">
            <h3 class="text-text mb-4 text-base font-semibold">Date Formatting</h3>
            <div class="divide-border divide-y">
              <div v-for="(val, label) in dateExamples" :key="label" class="flex items-center justify-between py-2.5 first:pt-0 last:pb-0">
                <span class="text-text-secondary text-sm">{{ label }}</span>
                <span class="text-text rounded bg-muted/60 px-2 py-0.5 font-mono text-xs">{{ val }}</span>
              </div>
            </div>
          </div>
          <div class="bg-surface border-border rounded-2xl border p-6">
            <h3 class="text-text mb-1 text-base font-semibold">display()</h3>
            <p class="text-text-secondary mb-4 text-sm">Safe value rendering with fallback.</p>
            <div class="divide-border divide-y">
              <div v-for="(val, expr) in displayExamples" :key="expr" class="flex items-center justify-between py-2.5 first:pt-0 last:pb-0">
                <code class="text-text-secondary text-xs">{{ expr }}</code>
                <span class="text-text rounded bg-muted/60 px-2 py-0.5 font-mono text-xs">{{ val }}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- ═══════════════════════════════════════════════════════════════ -->
    <!-- GETTING STARTED — 3-step                                      -->
    <!-- ═══════════════════════════════════════════════════════════════ -->
    <section id="getting-started" class="bg-surface py-20">
      <div class="container mx-auto px-4">
        <div class="mb-14 text-center">
          <AppText variant="overline" color="primary" class="mb-2">Quick Start</AppText>
          <AppText variant="h2" align="center" class="mb-3">Three Steps to Launch</AppText>
        </div>

        <div class="mx-auto max-w-2xl">
          <!-- Steps -->
          <div class="mb-8 grid gap-4 md:grid-cols-3">
            <div v-for="(step, i) in quickStartSteps" :key="i" class="bg-background border-border rounded-2xl border p-5 text-center">
              <div class="bg-primary/10 text-primary mx-auto mb-3 flex size-10 items-center justify-center rounded-full text-sm font-bold">{{ i + 1 }}</div>
              <h4 class="text-text mb-1 text-sm font-semibold">{{ step.title }}</h4>
              <p class="text-text-secondary text-xs">{{ step.desc }}</p>
            </div>
          </div>

          <!-- Terminal -->
          <div class="bg-background border-border overflow-hidden rounded-2xl border">
            <div class="border-border flex items-center gap-2 border-b px-4 py-3">
              <span class="h-3 w-3 rounded-full bg-red-400/70" />
              <span class="h-3 w-3 rounded-full bg-yellow-400/70" />
              <span class="h-3 w-3 rounded-full bg-green-400/70" />
              <span class="text-text-secondary ml-2 text-xs">Terminal</span>
            </div>
            <div class="p-5">
              <pre class="text-text text-sm leading-loose"><code><span class="text-success">$</span> git clone your-username/vuetail-template
<span class="text-success">$</span> cd vuetail-template
<span class="text-success">$</span> pnpm install
<span class="text-success">$</span> pnpm dev</code></pre>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- ═══════════════════════════════════════════════════════════════ -->
    <!-- CONFIG                                                        -->
    <!-- ═══════════════════════════════════════════════════════════════ -->
    <section class="py-20">
      <div class="container mx-auto px-4">
        <div class="mx-auto max-w-md text-center">
          <AppText variant="overline" color="primary" class="mb-2">Configuration</AppText>
          <AppText variant="h2" align="center" class="mb-6">One File, Full Control</AppText>

          <div class="bg-surface border-border rounded-2xl border p-5 text-left">
            <div class="divide-border divide-y">
              <div v-for="(val, label) in configEntries" :key="label" class="flex items-center justify-between py-2.5 first:pt-0 last:pb-0">
                <span class="text-text-secondary text-sm">{{ label }}</span>
                <span class="text-text font-mono text-xs">{{ val }}</span>
              </div>
            </div>
            <div class="bg-muted/40 mt-4 rounded-xl p-3">
              <p class="text-text-secondary text-xs">Edit <code class="bg-background rounded px-1 py-0.5 font-mono">app.config.ts</code> to change colors, fonts, SEO, and more.</p>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- ═══════════════════════════════════════════════════════════════ -->
    <!-- FOOTER                                                        -->
    <!-- ═══════════════════════════════════════════════════════════════ -->
    <footer class="border-border border-t py-12">
      <div class="container mx-auto px-4">
        <div class="flex flex-col items-center gap-6 md:flex-row md:justify-between">
          <div class="flex items-center gap-2.5">
            <div class="bg-primary/10 flex size-8 items-center justify-center rounded-lg">
              <AppIcon name="heroicons-outline:template" :size="1.125" class="text-primary" />
            </div>
            <span class="text-text font-bold">{{ appName }}</span>
          </div>
          <nav class="flex flex-wrap items-center justify-center gap-5">
            <a v-for="link in footerLinks" :key="link.href" :href="link.href" class="text-text-secondary hover:text-text text-sm transition-colors" @click.prevent="scrollTo(link.href)">{{ link.label }}</a>
          </nav>
          <p class="text-text-secondary text-xs">Built with Vue 3, Tailwind v4 &amp; TypeScript</p>
        </div>
      </div>
    </footer>

    <!-- ═══════════════════════════════════════════════════════════════ -->
    <!-- MODALS                                                        -->
    <!-- ═══════════════════════════════════════════════════════════════ -->
    <AppImageModal :images="demoImages" :is-open="isImageModalOpen" :initial-index="imageModalIndex" @update:is-open="isImageModalOpen = $event" @close="isImageModalOpen = false" />

    <AppModal :is-open="demoModalOpen" title="Demo Modal" description="A showcase of the modal with icon, description, and transitions." icon="icon-[heroicons-outline--sparkles]" :max-width="demoModalSize" @close="demoModalOpen = false; demoModalFooter = false">
      <AppText variant="p" color="text-secondary">This modal features a header icon, description text, Escape key support, body scroll lock, and smooth animations.</AppText>
      <template v-if="demoModalFooter" #footer>
        <div class="flex justify-end gap-2">
          <AppButton variant="outline" label="Cancel" @click="demoModalOpen = false; demoModalFooter = false" />
          <AppButton variant="primary" label="Confirm" icon="icon-[heroicons-outline--check]" @click="demoModalOpen = false; demoModalFooter = false; showToast('success', 'Confirmed!')" />
        </div>
      </template>
    </AppModal>

    <AppModal :is-open="persistentModalOpen" title="Persistent Modal" description="Requires explicit user action to dismiss." icon="icon-[heroicons-outline--lock-closed]" icon-variant="warning" max-width="sm" :persistent="true" @close="persistentModalOpen = false">
      <AppText variant="p" color="text-secondary">Clicking the backdrop or pressing Escape will not close this. Use the button below.</AppText>
      <template #footer>
        <div class="flex justify-end">
          <AppButton variant="primary" label="Got it" icon="icon-[heroicons-outline--check]" @click="persistentModalOpen = false" />
        </div>
      </template>
    </AppModal>

    <AppModal :is-open="loadingModalOpen" title="Processing" description="Please wait while we process your request." icon="icon-[heroicons-outline--arrow-path]" max-width="sm" :loading="modalLoading" loading-text="Processing..." @close="loadingModalOpen = false">
      <AppText variant="p" color="text-secondary">The loading overlay blocks interaction until the operation completes.</AppText>
      <template #footer>
        <div class="flex justify-end">
          <AppButton variant="outline" label="Close" @click="loadingModalOpen = false" />
        </div>
      </template>
    </AppModal>

    <ConfirmDangerModal :is-open="dangerModalOpen" title="Delete Item" message="This will permanently delete the item. This action cannot be undone." confirm-label="Delete" @close="dangerModalOpen = false" @confirm="dangerModalOpen = false; showToast('success', 'Item deleted!')" />
    <ConfirmDangerModal :is-open="dangerLoadingModalOpen" title="Delete Account" message="All your data will be permanently removed. This cannot be undone." confirm-label="Delete Account" :loading="dangerLoading" loading-label="Deleting..." @close="dangerLoadingModalOpen = false" @confirm="simulateDangerLoading" />
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
    const cleanId = id.replace('#', '');
    document.getElementById(cleanId)?.scrollIntoView({ behavior: 'smooth' });
  };

  // ===== Static data =====
  const stats = [
    { value: '20+', label: 'Components' },
    { value: '12', label: 'Composables' },
    { value: '6', label: 'Utilities' },
    { value: '2', label: 'Themes' },
  ];

  const techStack = [
    { name: 'Vue 3', icon: 'icon-[mdi--vuejs]', color: 'text-[#42b883]' },
    { name: 'Tailwind v4', icon: 'icon-[mdi--tailwind]', color: 'text-[#38bdf8]' },
    { name: 'TypeScript', icon: 'icon-[mdi--language-typescript]', color: 'text-[#3178c6]' },
    { name: 'Vite', icon: 'icon-[mdi--lightning-bolt]', color: 'text-[#bd34fe]' },
    { name: 'Pinia', icon: 'icon-[mdi--fruit-pineapple]', color: 'text-[#ffd859]' },
  ];

  const quickStartSteps = [
    { title: 'Clone', desc: 'Grab the template from GitHub' },
    { title: 'Install', desc: 'Run pnpm install' },
    { title: 'Build', desc: 'Start shipping features' },
  ];

  const footerLinks = [
    { label: 'Features', href: '#features' },
    { label: 'Components', href: '#components' },
    { label: 'Theme', href: '#theme' },
    { label: 'Quick Start', href: '#getting-started' },
  ];

  const configEntries = computed(() => ({
    'App Name': appName.value,
    Version: app.version,
    Font: primaryFont.value,
    Container: containerMaxWidth.value,
  }));

  // ===== Component Tabs =====
  const componentTabs = [
    { key: 'buttons', label: 'Buttons', icon: 'icon-[heroicons-outline--cursor-arrow-ripple]' },
    { key: 'typography', label: 'Typography', icon: 'icon-[heroicons-outline--document-text]' },
    { key: 'forms', label: 'Forms', icon: 'icon-[heroicons-outline--pencil-square]' },
    { key: 'data', label: 'Data', icon: 'icon-[heroicons-outline--table-cells]' },
    { key: 'feedback', label: 'Feedback', icon: 'icon-[heroicons-outline--bell-alert]' },
  ];
  const activeTab = ref('buttons');

  // ===== Table =====
  const tableColumns = [
    { key: 'name', label: 'Product', sortable: true },
    { key: 'category', label: 'Category', sortable: true, hideable: true },
    { key: 'description', label: 'Description', truncate: true, hideable: true },
    { key: 'price', label: 'Price', sortable: true },
    { key: 'stock', label: 'Stock', sortable: true, hideable: true },
    { key: 'status', label: 'Status', sortable: true },
    { key: 'actions', label: 'Actions' },
  ];

  const tableData = [
    { id: 1, name: 'Laptop Pro 16"', category: 'Electronics', description: 'High-performance laptop with M3 chip, 32GB RAM', price: 2499, stock: 12, status: 'In Stock' },
    { id: 2, name: 'Wireless Mouse', category: 'Accessories', description: 'Ergonomic wireless mouse with precision tracking', price: 29, stock: 150, status: 'In Stock' },
    { id: 3, name: 'Mechanical Keyboard', category: 'Accessories', description: 'Cherry MX Blue switches with RGB backlighting', price: 149, stock: 0, status: 'Out of Stock' },
    { id: 4, name: '4K Monitor 27"', category: 'Electronics', description: 'Ultra-sharp 4K IPS display with HDR support', price: 599, stock: 24, status: 'In Stock' },
    { id: 5, name: 'Noise-Cancelling Headphones', category: 'Audio', description: 'Premium over-ear headphones with ANC', price: 349, stock: 45, status: 'In Stock' },
    { id: 6, name: 'USB-C Hub', category: 'Accessories', description: 'Multi-port adapter with HDMI and SD card reader', price: 49, stock: 200, status: 'In Stock' },
    { id: 7, name: 'Studio Monitor', category: 'Audio', description: 'Professional reference monitors', price: 299, stock: 0, status: 'Out of Stock' },
    { id: 8, name: 'Tablet 11"', category: 'Electronics', description: 'Lightweight tablet with stylus support', price: 499, stock: 67, status: 'In Stock' },
  ];

  const demoIcons = ['icon-[mdi--heart]', 'icon-[mdi--star]', 'icon-[mdi--check-circle]', 'icon-[mdi--information]', 'icon-[mdi--home]', 'icon-[mdi--account]', 'icon-[mdi--settings]', 'icon-[mdi--menu]'];

  const demoImages = [
    'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800',
    'https://images.unsplash.com/photo-1518837695005-2083093ee35b?w=800',
    'https://images.unsplash.com/photo-1469474968028-56623f02e42e?w=800',
  ];

  // ===== Image Modal =====
  const isImageModalOpen = ref(false);
  const imageModalIndex = ref(0);
  const openImageModal = (i: number) => { imageModalIndex.value = i; isImageModalOpen.value = true; };

  // ===== Toast =====
  const showToast = (type: 'success' | 'error' | 'warning' | 'info', message: string) => {
    ({ success, error, warning, info })[type](message);
  };

  // ===== Button Loading =====
  const btnLoading = ref(false);
  const btnIconLoading = ref(false);
  const simulateLoading = () => { btnLoading.value = true; setTimeout(() => { btnLoading.value = false; showToast('success', 'Saved!'); }, 2000); };
  const simulateIconLoading = () => { btnIconLoading.value = true; setTimeout(() => { btnIconLoading.value = false; showToast('success', 'Deleted!'); }, 1500); };

  // ===== Modals =====
  const demoModalOpen = ref(false);
  const demoModalSize = ref<'sm' | 'md' | 'lg'>('md');
  const demoModalFooter = ref(false);
  const persistentModalOpen = ref(false);
  const loadingModalOpen = ref(false);
  const modalLoading = ref(false);
  const dangerModalOpen = ref(false);
  const dangerLoadingModalOpen = ref(false);
  const dangerLoading = ref(false);

  const simulateModalLoading = () => { modalLoading.value = true; setTimeout(() => { modalLoading.value = false; showToast('success', 'Done!'); }, 3000); };
  const simulateDangerLoading = () => { dangerLoading.value = true; setTimeout(() => { dangerLoading.value = false; dangerLoadingModalOpen.value = false; showToast('success', 'Account deleted!'); }, 2000); };

  // ===== Forms =====
  const contactForm = ref({ name: '', email: '', message: '' });
  const contactFields = [
    [{ key: 'name', type: 'text' as const, label: 'Full Name', placeholder: 'Enter your name' }],
    [{ key: 'email', type: 'email' as const, label: 'Email', placeholder: 'your@email.com' }],
    [{ key: 'message', type: 'textarea' as const, label: 'Message', placeholder: 'Your message...', rows: 3 }],
  ];
  const contactSchema = z.object({
    name: z.string().min(2, 'Min 2 characters'),
    email: z.string().email('Invalid email'),
    message: z.string().min(10, 'Min 10 characters'),
  });

  const demoDate = ref('');
  const demoDateTime = ref('');
  const selectedFileName = ref('');
  const handleFileSelect = (file: File) => { selectedFileName.value = file.name; showToast('success', `Selected: ${file.name}`); };

  const lastSubmission = ref<any>(null);
  const handleFormSubmit = (formName: string, data: any) => { lastSubmission.value = { form: formName, data }; showToast('success', `${formName} submitted!`); };

  // ===== Utilities =====
  const now = new Date();
  const dateFormatter = useDateFormat(now);
  const dateExamples = computed(() => ({
    Short: dateFormatter.formatPreset('short'),
    Medium: dateFormatter.formatPreset('medium'),
    Long: dateFormatter.formatPreset('long'),
    Relative: dateFormatter.relative(),
    Custom: dateFormatter.custom('MMM dd, yyyy HH:mm'),
  }));

  const displayExamples = computed(() => ({
    'display("Hello")': displayUtil('Hello'),
    'display(null)': displayUtil(null),
    'display("")': displayUtil(''),
    'display(undefined, "—")': displayUtil(undefined, '—'),
  }));

  // ===== SEO =====
  onMounted(() => { useSeo({ title: appTitle.value, description: appDescription.value }); });
</script>
