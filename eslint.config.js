import globals from 'globals';
import importPlugin from 'eslint-plugin-import';
import prettierConfig from 'eslint-config-prettier';

export default [
  // Global ignores (replaces .eslintignore in flat config)
  {
    ignores: ['dist/**', 'node_modules/**', '*.config.js'],
  },

  // Main config for game source
  {
    files: ['src/**/*.js'],
    languageOptions: {
      ecmaVersion: 2022,
      sourceType: 'module',
      globals: {
        ...globals.browser,
        __DEV__: 'readonly',
      },
    },
    plugins: {
      import: importPlugin,
    },
    rules: {
      // — Errors —
      'no-undef': 'error',
      'no-var': 'error',
      'no-unused-vars': ['warn', { argsIgnorePattern: '^_', varsIgnorePattern: '^_' }],
      eqeqeq: ['error', 'always'],

      // — Best practices —
      'prefer-const': 'warn',
      'no-param-reassign': 'off', // game entities mutate state by design
      curly: ['error', 'multi-line'],
      'no-else-return': 'warn',
      'no-lonely-if': 'warn',

      // — Style —
      'no-console': ['warn', { allow: ['warn', 'error'] }],
      'no-alert': 'error',
      'no-eval': 'error',

      // — Imports —
      'import/no-duplicates': 'warn',
      'import/no-self-import': 'error',
      'import/no-cycle': ['error', { maxDepth: 3 }],
      'import/order': [
        'warn',
        {
          groups: ['builtin', 'external', 'internal', 'parent', 'sibling', 'index'],
          'newlines-between': 'always',
        },
      ],
    },
  },

  // Prettier compat — must be last to override formatting rules
  prettierConfig,
];
