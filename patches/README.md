# Registry patches

These patches apply to the companion registry repo
`https://github.com/AbdulghaniKM/vuetail-components`, not to this template.

Apply inside a checkout of that repo:

```bash
git clone https://github.com/AbdulghaniKM/vuetail-components
cd vuetail-components
git apply path/to/vuetail-template/patches/<file>.patch
```

## Index

- `useAuth-setAuthProvider.patch` — **required after updating the template's
  `plugins/axios.ts`**: the axios plugin no longer imports `useAuth`
  directly. `useAuth` must register its `getToken` / `refreshToken` /
  `onUnauthorized` hooks via `setAuthProvider(...)`. This also enables
  single-flight 401 refresh (§1.5) and drops the dynamic-import circular
  workaround.
- `useTheme-storage-format.patch` — §1.2: write theme to `localStorage` as a
  raw string (`'dark'`) instead of JSON-stringified (`'"dark"'`) so
  `initializeConfig()` in the template reads the persisted value on first
  paint. The template also tolerates the old format for backward compat, so
  this patch is non-breaking.
- `InputField-a11y.patch` — §1.8: associate `<label>` with `<input>` via
  `useId()`, add `aria-invalid` / `aria-describedby` for error text, and
  add a real `aria-label` on the password-visibility toggle.
