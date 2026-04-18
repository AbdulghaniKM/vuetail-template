import eslint from '@eslint/js';
import eslintConfigPrettier from 'eslint-config-prettier';
import vue from 'eslint-plugin-vue';
import tseslint from 'typescript-eslint';

// Minimal Node globals for scripts that run under `node` (not Vite).
// Avoids pulling in the `globals` npm package.
const nodeGlobals = {
  process: 'readonly',
  console: 'readonly',
  setTimeout: 'readonly',
  clearTimeout: 'readonly',
  setInterval: 'readonly',
  clearInterval: 'readonly',
  AbortController: 'readonly',
  fetch: 'readonly',
  Buffer: 'readonly',
  __dirname: 'readonly',
  __filename: 'readonly',
} as const;

export default tseslint.config(
  // Base ESLint recommended rules
  eslint.configs.recommended,

  // TypeScript ESLint recommended rules
  ...tseslint.configs.recommended,

  // Vue ESLint recommended rules
  ...vue.configs['flat/recommended'],

  // Custom rules for TypeScript files
  {
    files: ['**/*.ts', '**/*.js'],
    rules: {
      '@typescript-eslint/no-unused-vars': 'off',
      '@typescript-eslint/no-explicit-any': 'warn',
      'no-console': 'warn',
      'no-debugger': 'warn',
    },
  },

  // Custom rules for Vue files
  {
    files: ['**/*.vue'],
    rules: {
      'vue/multi-word-component-names': 'off',
      'no-console': 'warn',
      'no-debugger': 'warn',
    },
  },

  // Node scripts run outside Vite — give them Node globals.
  {
    files: ['scripts/**/*.js', 'scripts/**/*.ts'],
    languageOptions: {
      globals: nodeGlobals,
    },
    rules: {
      'no-console': 'off',
    },
  },

  // Ignore patterns
  {
    ignores: ['dist', 'node_modules', '*.config.js', '*.config.ts'],
  },

  // Disable rules that conflict with Prettier
  eslintConfigPrettier,
);
