Techinical Rules :

- Always use tailiwnd v4 based on the docs : https://tailwindcss.com/
- Always use Composition API stores, and components, pages (\*.vue)
- Backend Flow should be :
  api-paths: define endpoints
  types: define the API response types with pagination config, then define every controller in a seperate type file, and use these types across the stores and services
  services: define methods using the api-paths endpoints
  stores: define bussiness logic and API functions using the services.
  pages: use stores only
  - check https://vuetail-docs.vercel.app/getting-started for components and composables installation and info, if there's no component/composable matches your need, create a new one
  - always follow DRY principle (DON'T REPEAT YOURSELF)
  - every now and then check DESIGN_SYSTEM.MD to make sure you are designing using the right design system
- check swagger.json file for api endpoints to add them to api-paths

Agent Rules :

- don't use too many tokens
- make your solutions precise and effective, don't fuck around and waste my tokens.
- ask before major edits and changes
- don't commit on github using your name, don't add any name or "calling"
- never delete files and folders without permission
