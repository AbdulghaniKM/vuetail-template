# VueTail

A production-ready Vue 3 starter template with Tailwind CSS v4, TypeScript, and a complete component library.

## Stack

| Layer | Technology |
|-------|-----------|
| Framework | Vue 3.5 with `<script setup>` + Composition API |
| Styling | Tailwind CSS v4 with CSS variable theming |
| Language | TypeScript 5.7 (strict) |
| Build | Vite 7 |
| State | Pinia 3 |
| Routing | Vue Router 4 |
| Validation | Zod 4 |
| HTTP | Axios (interceptors, CSRF, auth token plumbing) |
| Icons | Iconify (200k+ icons via `@iconify/tailwind4`) |
| Animations | motion-v (spring physics) |
| Utilities | VueUse, date-fns |
| Linting | ESLint + Prettier (with Tailwind class sorting) |

## Quick Start

```bash
git clone https://github.com/your-username/vuetail-template.git
cd vuetail-template
pnpm install
pnpm dev
```

Copy `.env.example` to `.env` and set your values:

```bash
cp .env.example .env
```

## Project Structure

```
src/
├── components/
│   ├── ui/                  # Registry-installed UI components (shadcn-style)
│   │   ├── Fields/          # Form field components
│   │   │   ├── AppForm.vue        # Declarative form builder with Zod validation
│   │   │   ├── InputField.vue     # Text/email/password/number input
│   │   │   ├── Textarea.vue       # Multiline text input
│   │   │   ├── Select.vue         # Searchable dropdown select
│   │   │   ├── PhoneInput.vue     # Phone number input with formatting
│   │   │   ├── DatePicker.vue     # Calendar date/datetime picker
│   │   │   ├── TimePickerClock.vue # Hour/minute stepper
│   │   │   ├── FileInput.vue      # File upload button
│   │   │   └── FileDisplay.vue    # Attached file display with remove
│   │   ├── AppButton.vue         # 8 variants, 4 sizes, loading state, tooltips
│   │   ├── AppModal.vue          # Animated modal with icon, loading, persistent mode
│   │   ├── AppTable.vue          # Data table with search, sort, pagination, column toggle
│   │   ├── AppText.vue           # Typography component with responsive sizes, gradients
│   │   ├── AppToast.vue          # Toast notifications with progress bar
│   │   ├── AppTooltip.vue        # Tooltip with arrow, 4 placements, keyboard support
│   │   ├── AppIcon.vue           # Iconify icon wrapper
│   │   ├── AppSpinner.vue        # Loading spinner (5 sizes)
│   │   ├── AppImageModal.vue     # Fullscreen image gallery with zoom
│   │   ├── AppErrorBoundary.vue  # Error boundary wrapper
│   │   └── ConfirmDangerModal.vue # Destructive action confirmation dialog
│   ├── AppHeader.vue             # App header with nav, theme toggle, mobile menu
│   └── FeatureCard.vue           # Feature showcase card
├── composables/
│   ├── useAppConfig.ts      # Read-only access to app configuration
│   ├── useAuth.ts           # Authentication state, login/logout, token lifecycle
│   ├── useBreakpoint.ts     # Reactive Tailwind breakpoint detection
│   ├── useClipboard.ts      # Copy to clipboard with feedback
│   ├── useColorCustomizer.ts # Runtime theme color editing
│   ├── useConfirm.ts        # Programmatic confirm dialog (Promise-based)
│   ├── useDateFormat.ts     # Reactive date formatting with presets
│   ├── useDebounce.ts       # Debounced and throttled refs
│   ├── useFormValidation.ts # Zod-based reactive form error clearing
│   ├── useInfiniteScroll.ts # Intersection Observer infinite scroll
│   ├── useKeyboard.ts       # Keyboard shortcut registration
│   ├── useLocalStorage.ts   # Typed reactive localStorage with Zod validation
│   ├── usePagination.ts     # Standalone pagination logic
│   ├── useSeo.ts            # Page-level SEO meta tags with cleanup
│   ├── useTheme.ts          # Light/dark/system theme switching
│   └── useToast.ts          # Toast notification manager
├── config/
│   ├── app.config.ts        # Centralized app configuration
│   ├── api-paths.ts         # API endpoint constants
│   ├── env.ts               # Environment variable accessors
│   ├── types.ts             # Config type definitions
│   └── index.ts             # Config initialization
├── utils/
│   ├── date.ts              # Date formatting (date-fns wrappers)
│   ├── datepicker.ts        # DatePicker calendar math
│   ├── display.ts           # Safe value-to-string with fallback
│   ├── error.ts             # Axios error message extraction
│   ├── file.ts              # File size formatting, type detection
│   ├── fonts.ts             # Font loading and CSS variable registration
│   ├── seo.ts               # DOM meta tag manipulation
│   ├── theme.ts             # CSS variable generation, theme application
│   └── validation.ts        # Pure validation rule functions
├── services/
│   ├── products.ts          # Product API service
│   └── upload.ts            # File upload with progress and cancellation
├── plugins/
│   └── axios.ts             # Axios instance with auth, CSRF, interceptors
├── stores/                  # Pinia stores
├── layout/                  # Layout wrapper
├── pages/                   # Route page components
├── router/                  # Vue Router configuration
├── types/                   # Shared TypeScript types
├── style.css                # Tailwind imports, CSS variables, scrollbar styles
├── App.vue                  # Root component
└── main.ts                  # App entry point
```

## Configuration

All app settings live in `src/config/app.config.ts`:

```ts
export const appConfig = {
  app: { name, title, description, version, author, url, language },
  theme: {
    defaultTheme: 'system', // 'light' | 'dark' | 'system'
    light: { primary, secondary, accent, background, surface, ... },
    dark:  { primary, secondary, accent, background, surface, ... },
  },
  typography: { primary, secondary, mono, fonts },
  icons: { favicon },
  seo: { title, description, keywords, openGraph, twitter },
  layout: { containerMaxWidth },
}
```

Changes to this file automatically update the theme, fonts, SEO tags, and layout on app initialization.

## Theming

The theme system uses CSS variables defined in `style.css` and overridden at runtime by `app.config.ts`:

```css
@theme {
  --color-primary: #3b82f6;
  --color-secondary: #8b5cf6;
  --color-surface: #f9fafb;
  /* ... */
}
```

Use theme colors directly in Tailwind classes: `bg-primary`, `text-secondary`, `border-border`.

Switch themes programmatically:

```ts
const { theme, setTheme, isDark } = useTheme()
setTheme('dark')   // 'light' | 'dark' | 'system'
```

Customize colors at runtime:

```ts
const { updateColor, resetColors } = useColorCustomizer()
updateColor('primary', '#e11d48')
```

## Components

### AppButton

```vue
<AppButton variant="primary" label="Save" icon="icon-[heroicons-outline--check]" />
<AppButton variant="danger" label="Delete" :loading="isDeleting" loading-label="Deleting..." />
<AppButton icon="icon-[heroicons-outline--pencil]" tooltip="Edit" icon-only />
```

Variants: `primary`, `secondary`, `ghost`, `muted`, `danger`, `success`, `surface`, `outline`
Sizes: `xs`, `sm`, `md`, `lg`

### AppModal

```vue
<AppModal
  :is-open="showModal"
  title="Edit Profile"
  description="Update your account details."
  icon="icon-[heroicons-outline--user]"
  icon-variant="primary"
  @close="showModal = false"
  @confirm="handleSave"
>
  <p>Modal body content.</p>
  <template #footer>
    <AppButton variant="primary" label="Save" @click="handleSave" />
  </template>
</AppModal>
```

Features: Escape/Enter key support, body scroll lock, loading overlay, persistent mode, icon variants (`primary`, `danger`, `warning`, `success`, `info`).

### AppTable

```vue
<AppTable
  :columns="columns"
  :data="products"
  :searchable="true"
  :paginated="true"
  :items-per-page="10"
  show-column-toggle
>
  <template #cell-price="{ value }">${{ value }}</template>
  <template #cell-actions="{ row }">
    <AppButton icon="icon-[heroicons-outline--pencil]" icon-only tooltip="Edit" />
  </template>
</AppTable>
```

Features: search with clear, sort, client/server pagination, column visibility toggle with localStorage persistence, skeleton loading, truncate with tooltip, sticky actions column.

### AppForm

```vue
<AppForm
  v-model="formData"
  :fields="fields"
  :schema="zodSchema"
  @submitted="onSubmit"
/>
```

Field types: `text`, `email`, `password`, `number`, `textarea`, `select`, `phone`, `date`, `datetime`. Supports multi-column rows, custom actions slot, and Zod schema validation.

### AppToast

```ts
const { success, error, warning, info } = useToast()
success('Changes saved!')
error('Something went wrong', { title: 'Error', duration: 8000 })
```

### AppText

```vue
<AppText variant="h1" :responsiveSize="{ sm: '3xl', md: '5xl' }">Heading</AppText>
<AppText :gradient="true" gradientFrom="primary" gradientTo="secondary" size="2xl" weight="bold">
  Gradient Text
</AppText>
```

Variants: `h1`-`h6`, `p`, `span`, `label`, `caption`, `overline`.

## Composables

### useAuth

```ts
const { user, isAuthenticated, login, logout, fetchUser } = useAuth()
await login({ email: 'user@example.com', password: '...' })
```

Token is stored in localStorage and automatically attached to every Axios request via the interceptor. 401 responses clear the session.

### useKeyboard

```ts
useKeyboard({
  'ctrl+k': () => openSearch(),
  'escape': () => closePanel(),
})

// Conditional — only active when ref is true
useKeyboard({ 'escape': () => close() }, isOpen)
```

### useLocalStorage

```ts
const settings = useLocalStorage('app-settings', { sidebar: true }, zodSchema)
settings.value.sidebar = false // auto-persisted, validated on read
```

### useConfirm

```ts
const { confirm } = useConfirm()
const ok = await confirm({ title: 'Delete item?', message: 'This cannot be undone.' })
if (ok) deleteItem()
```

### usePagination

```ts
const { page, totalPages, next, prev, visiblePages, paginate } = usePagination({
  total: computed(() => items.length),
  pageSize: 20,
})
const pageItems = paginate(items)
```

### useBreakpoint

```ts
const { isMobile, isDesktop, current, greaterThan } = useBreakpoint()
// current.value → 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl'
```

### useClipboard

```ts
const { copy, copied } = useClipboard()
await copy('text to copy', true) // true = show toast
```

### useDebounce / useThrottle

```ts
const debouncedSearch = useDebounce(searchQuery, 300)
const throttledScroll = useThrottle(scrollPosition, 100)
```

## Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| `VITE_API_URL` | API base URL (required in production) | `/api` |
| `VITE_APP_URL` | Public app URL (used for SEO) | `window.location.origin` |

See `.env.example` for reference.

## Scripts

```bash
pnpm dev        # Start dev server
pnpm build      # Type-check + production build
pnpm preview    # Preview production build
pnpm lint       # Run ESLint
pnpm format     # Run Prettier
```

## License

MIT
