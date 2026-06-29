# VueTail

A production-ready Vue 3 starter template with Tailwind CSS v4, TypeScript, and a complete component library. Built on the [Oxc](https://oxc.rs) toolchain (Oxlint + Oxfmt) and Vite 8 with Rolldown.

## Stack

| Layer      | Technology                                                                  |
| ---------- | --------------------------------------------------------------------------- |
| Framework  | Vue 3.5 with `<script setup>` + Composition API                             |
| Styling    | Tailwind CSS v4 with CSS variable theming                                   |
| Language   | TypeScript 6 (strict)                                                       |
| Build      | Vite 8 (Rolldown)                                                           |
| State      | Pinia 3                                                                     |
| Routing    | Vue Router 5 with custom Vite plugin + native glob auto-registry            |
| Validation | Zod 4                                                                       |
| HTTP       | Axios (interceptors, CSRF, auth token plumbing)                             |
| Icons      | Iconify (200k+ icons via `@iconify/tailwind4`)                              |
| Animations | motion-v (spring physics)                                                   |
| Utilities  | VueUse, date-fns                                                            |
| Linting    | [Oxlint](https://oxc.rs/docs/guide/usage/linter)                            |
| Formatting | [Oxfmt](https://oxc.rs/docs/guide/usage/formatter) (Tailwind class sorting) |
| DevTools   | [Vite DevTools](https://devtools.vite.dev/) (embedded panel)                |

## Prerequisites

- **Node.js** 20.19+ or 22.12+ (required by Vite 8)
- **pnpm** (recommended)

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
│   └── ui/                  # UI components — shadcn-style on-demand registry
│       ├── AppEmptyState.vue # Empty state placeholders and illustration containers
│       ├── AppIcon.vue       # Scalable Iconify SVG loader
│       ├── AppPageLoader.vue # Route-loading overlay spinner
│       ├── AppSkeleton.vue   # Skeleton shimmer loading placeholders
│       ├── AppToast.vue      # Floating notification toasts with progress timelines
│       └── ThemeToggle.vue   # Light/dark mode toggle
│       #  ↑ these ship by default · add more with `pnpm add-component <Name>`
├── composables/
│   ├── useAppConfig.ts      # Access to centralized Vite layout settings
│   ├── useAppUi.ts          # Page-level shape overrides and layout configs
│   ├── useSidebar.ts        # Drawer navigation panel state
│   ├── useTheme.ts          # Syncs light/dark/system mode class mappings
│   └── useToast.ts          # Queue manager for toast notifications
├── config/
│   ├── app.config.ts        # Centralized app configuration
│   ├── api-paths.ts         # API endpoint constants
│   ├── env.ts               # Environment variable accessors
│   ├── router.ts            # Bespoke compile-time route scan registry
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
│   ├── BaseApiService.ts    # Generic REST CRUD base class
│   ├── product.service.ts   # Product API service
│   └── upload.service.ts    # File upload with progress and cancellation
├── plugins/
│   ├── axios.config.ts      # Pure Axios instance and networking config
│   └── axios.ts             # Axios interceptors, auth state, error handling
├── stores/                  # Pinia stores
├── layouts/                 # App layouts (default, auth, dashboard)
├── pages/                   # File-based typed route page components
│   ├── index.vue            # Root/Home route (/)
│   ├── Login.vue            # Login route (/Login, uses auth layout)
│   ├── ServerError.vue      # Server error route (/ServerError -> custom /500)
│   ├── Offline.vue          # Offline route (/Offline)
│   ├── _theme.vue           # Theme Studio (dev-only route)
│   └── [...pathMatch].vue   # Catch-all 404 route handler
├── router/                  # Runtime router instantiation & navigation guards
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
const { theme, setTheme, isDark } = useTheme();
setTheme('dark'); // 'light' | 'dark' | 'system'
```

Customize colors at runtime (add the composable first: `pnpm add-composable useColorCustomizer`):

```ts
const { updateColor, resetColors } = useColorCustomizer();
updateColor('primary', '#e11d48');
```

## Routing

The template features a **custom, lightweight compile-time route registry** that automates route mapping directly from `src/pages/` using a tailored Vite macro parser and native glob scanning.

### Custom Page Definitions (`definePage`)

You can configure custom route paths, page titles, and layout overrides directly inside your page components using the `definePage` macro:

```vue
<script setup lang="ts">
  definePage({
    route: 'account/logout/',
    head: 'Logout',
    layout: 'default',
    requiresAuth: true,
  });
</script>
```

- `route`: The target URL path (e.g. `account/logout/` resolves to `/account/logout/`). If omitted, the router automatically falls back to file-system-based path names.
- `head`: Page title automatically managed at route changes.
- `layout`: Page layout overrides (`'default'`, `'auth'`, `'dashboard'`).
- `requiresAuth`: Guard the route — visitors without an auth token are redirected to the Login route (with a `?redirect=` back to the original URL).

### File-System Mapping Fallbacks

If a page does not specify an explicit `route`, the router derives one from its path under `src/pages/`. The mapping is **directory-aware** — nested folders become nested paths, a trailing `index` collapses to its parent, and bracketed segments become route params:

- `src/pages/index.vue` → `/` (Home page)
- `src/pages/dashboard/index.vue` → `/dashboard`
- `src/pages/users/[id].vue` → `/users/:id` (dynamic param)
- `src/pages/[...pathMatch].vue` → `/:pathMatch(.*)*` (catch-all 404 handler)
- `src/pages/Offline.vue` → `/offline`

Route **names** are derived from the full relative path (`dashboard/index.vue` → `dashboard-index`), so same-named files in different folders never collide. Files whose name starts with `_` (e.g. `_theme.vue`) are **dev-only** and excluded from production builds.

## Components

VueTail ships as a lean starter with an **on-demand component registry** (shadcn-style). Only
a small default set lives in `src/components/ui/` out of the box — **AppEmptyState, AppIcon,
AppPageLoader, AppSkeleton, AppToast, ThemeToggle**. Everything documented below is **not
pre-installed**; it lives in the [component registry](https://github.com/AbdulghaniKM/vuetail-components)
and is copied into your project only when you ask for it:

```bash
pnpm add-component AppButton      # add a component (resolves + installs its deps)
pnpm add-component list           # list everything available in the registry
pnpm vuetail:verify               # check installed files still match the registry
```

The sections below are the **API reference for each component once you've added it**.

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
<AppForm v-model="formData" :fields="fields" :schema="zodSchema" @submitted="onSubmit" />
```

Field types: `text`, `email`, `password`, `number`, `textarea`, `select`, `phone`, `date`, `datetime`. Supports multi-column rows, custom actions slot, and Zod schema validation.

### AppToast

```ts
const { success, error, warning, info } = useToast();
success('Changes saved!');
error('Something went wrong', { title: 'Error', duration: 8000 });
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

Same model as components — a default set ships in `src/composables/`, the rest are added on
demand. **Shipped by default:** `useAppConfig`, `useAppUi`, `useSidebar`, `useTheme`,
`useToast`. **Add from the registry** with `pnpm add-composable <name>` — every composable
documented below (`useAuth`, `useKeyboard`, `useLocalStorage`, `useConfirm`, `usePagination`,
`useBreakpoint`, `useClipboard`, `useDebounce`) is a registry add-on, not pre-installed.

### useAuth

```ts
const { user, isAuthenticated, login, logout, fetchUser } = useAuth();
await login({ email: 'user@example.com', password: '...' });
```

The access token is held **in memory** via `src/lib/authToken.ts` and automatically attached as a Bearer token to every Axios request. On an unrecoverable 401 the session is cleared and guarded routes redirect to Login. See [Authentication & token storage](#authentication--token-storage) for the rationale and how to change it.

### useKeyboard

```ts
useKeyboard({
  'ctrl+k': () => openSearch(),
  escape: () => closePanel(),
});

// Conditional — only active when ref is true
useKeyboard({ escape: () => close() }, isOpen);
```

### useLocalStorage

```ts
const settings = useLocalStorage('app-settings', { sidebar: true }, zodSchema);
settings.value.sidebar = false; // auto-persisted, validated on read
```

### useConfirm

```ts
const { confirm } = useConfirm();
const ok = await confirm({ title: 'Delete item?', message: 'This cannot be undone.' });
if (ok) deleteItem();
```

### usePagination

```ts
const { page, totalPages, next, prev, visiblePages, paginate } = usePagination({
  total: computed(() => items.length),
  pageSize: 20,
});
const pageItems = paginate(items);
```

### useBreakpoint

```ts
const { isMobile, isDesktop, current, greaterThan } = useBreakpoint();
// current.value → 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl'
```

### useClipboard

```ts
const { copy, copied } = useClipboard();
await copy('text to copy', true); // true = show toast
```

### useDebounce

Registry add-on — `pnpm add-composable useDebounce`:

```ts
const debouncedSearch = useDebounce(searchQuery, 300);
```

> Need throttling? VueUse is auto-imported, so `refThrottled` / `useThrottleFn` are available
> globally with no install — no registry composable required.

## Environment Variables

| Variable       | Description                           | Default                  |
| -------------- | ------------------------------------- | ------------------------ |
| `VITE_API_URL` | API base URL (required in production) | `/api`                   |
| `VITE_APP_URL` | Public app URL (used for SEO)         | `window.location.origin` |

See `.env.example` for reference.

## Authentication & token storage

The auth **access token** is the single source of truth in [`src/lib/authToken.ts`](src/lib/authToken.ts) and is held **in memory by default** — never in `localStorage` or a JS-readable cookie.

**Why in-memory?** A token in `localStorage` is readable by any script on the page, so a single XSS (a compromised dependency, a third-party widget, a stray `v-html`) can exfiltrate the whole session. An in-memory token can't be read that way.

**The tradeoff:** a full page reload drops the token, so the user appears logged out on refresh. The production-grade pattern is to pair this with a **silent refresh** — keep the long-lived _refresh_ token in an `httpOnly` + `SameSite` cookie set by your backend, and on load exchange it for a fresh access token:

```ts
// src/main.ts — extend the AuthProvider with a refresh handler
setAuthProvider({
  getToken: getAuthToken,
  refreshToken: async () => {
    const { token } = await apiPost<{ token: string }>('/auth/refresh'); // sends the httpOnly cookie
    setAuthToken(token);
    return token;
  },
  onUnauthorized: () => {
    /* clear + redirect (already wired) */
  },
});
```

The axios interceptor (`src/plugins/axios.ts`) de-duplicates concurrent refreshes and retries the original request automatically once a new token arrives.

**Everything goes through `authToken.ts`** — the router guard, the axios request interceptor, and `useAuth`. To switch strategies (e.g. persist to `localStorage` for convenience over security), change only that one file; a commented `localStorage` example is included there.

## Code quality

Linting and formatting use the Oxc toolchain — fast, no ESLint/Prettier dependency tree.

| File                               | Purpose                                                     |
| ---------------------------------- | ----------------------------------------------------------- |
| `[.oxlintrc.json](.oxlintrc.json)` | Lint rules (TypeScript, Vue, recommended presets)           |
| `[.oxfmtrc.json](.oxfmtrc.json)`   | Format options + Tailwind class sorting via `src/style.css` |

**Editor:** install the [Oxc VS Code extension](https://marketplace.visualstudio.com/items?itemName=oxc.oxc-vscode) and set it as the default formatter for JS/TS/Vue.

```bash
pnpm lint          # Lint (warnings for no-console, no-explicit-any, etc.)
pnpm lint:fix      # Lint with auto-fix
pnpm format        # Format the repo with Oxfmt
pnpm format:check  # Fail CI if anything is unformatted
```

Generated files (`src/auto-imports.d.ts`, `src/components.d.ts`) are ignored by both tools.

## Vite DevTools (embedded)

Per the [official guide](https://devtools.vite.dev/guide/), embedded DevTools needs a production build first so Rolldown metadata exists, then the dev server:

```bash
pnpm build   # once (or after dependency / config changes)
pnpm dev
```

1. Open the app in the browser.
2. Check the console for `[VITE DEVTOOLS] Client injected` — if missing, restart `pnpm dev` after changing `vite.config.ts`.
3. Look for a **thin vertical tab on the left edge** of the page (panel starts collapsed). Click it to open the dock.
4. Rolldown build analysis panels need the `pnpm build` step above.

`vite.config.ts` uses `await DevTools()` because the plugin returns a `Promise<Plugin[]>` — passing `DevTools()` without `await` silently skips all DevTools plugins.

## Scripts

```bash
pnpm dev              # Start dev server
pnpm build            # Type-check + production build
pnpm preview          # Preview production build
pnpm lint             # Run Oxlint
pnpm lint:fix         # Run Oxlint with auto-fix
pnpm format           # Format with Oxfmt
pnpm format:check     # Check formatting (CI)
pnpm add-component    # Scaffold a UI component
pnpm add-composable   # Scaffold a composable
pnpm vuetail:verify   # Verify registry / install integrity
```

## License

MIT
