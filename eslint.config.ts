import eslint from '@eslint/js';
import eslintConfigPrettier from 'eslint-config-prettier';
import vue from 'eslint-plugin-vue';
import tseslint from 'typescript-eslint';

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
      '@typescript-eslint/no-unused-vars': 'warn',
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

  // Ignore patterns
  {
    ignores: ['dist', 'node_modules', '*.config.js', '*.config.ts'],
  },

  // Disable rules that conflict with Prettier
  eslintConfigPrettier,
);
