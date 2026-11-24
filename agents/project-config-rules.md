Techinical Rules :

- Always use tailiwnd v4 based on the docs : https://tailwindcss.com/
- Always use Composition API stores, and components, pages (\*.vue)
- Backend Flow should be :
  api-paths: define every endpoint once (a resource has a ROOT; item URLs are derived from it)
  types: define the API response types, one `<domain>.types.ts` per controller, and use these types across services and queries
  services: HTTP only, methods using the api-paths endpoints, reads take `{ signal }`; no state
  queries: TanStack Query in `src/queries/<domain>.queries.ts`, built with `createResourceQueries` plus custom queries and mutations
  pages: use query composables only, never axios or a service directly
  stores: Pinia for client-only state (UI, preferences), never a copy of server data
  - check https://vuetail-docs.vercel.app/getting-started for components and composables installation and info, if there's no component/composable matches your need, create a new one
  - always follow DRY principle (DON'T REPEAT YOURSELF)
  - every now and then check DESIGN_SYSTEM.MD to make sure you are designing using the right design system
- check swagger.json file for api endpoints to add them to api-paths
- File naming (suffix convention — singular domain):
  - Feature files: `<domain>.<layer>.ts` — e.g. `product.service.ts`, `product.queries.ts`, `resource.types.ts`
  - Shared base classes: PascalCase matching the class — `BaseApiService.ts`, `FormModel.ts`, `ThemePersistence.ts`
  - Composables: `use*.ts` — `useTheme.ts`
  - Config files: `*.config.ts` — `app.config.ts`
  - Pure type modules only: `*.types.ts` — `resource.types.ts`, `form.types.ts`

Agent Rules :

- don't use too many tokens
- make your solutions precise and effective, don't fuck around and waste my tokens.
- ask before major edits and changes
- don't commit on github using your name, don't add any name or "calling"
- never delete files and folders without permission
