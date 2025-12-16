const path = require('path');

module.exports = [
  {
    ignores: ['**/dist/**', '**/build/**', '**/node_modules/**'],
  },
  {
    files: ['**/*.{ts,tsx}'],
    languageOptions: {
      parser: require('@typescript-eslint/parser'),
      parserOptions: {
        project: './tsconfig.base.json',
        tsconfigRootDir: __dirname,
      },
    },
    plugins: {
      '@typescript-eslint': require('@typescript-eslint/eslint-plugin'),
      import: require('eslint-plugin-import'),
    },
    rules: {
      '@typescript-eslint/no-unused-vars': [
        'warn',
        {
          argsIgnorePattern: '^_',
          varsIgnorePattern: '^_',
          caughtErrorsIgnorePattern: '^_',
        },
      ],
      'import/order': [
        'error',
        {
          groups: ['builtin', 'external', 'internal', 'parent', 'sibling', 'index'],
          'newlines-between': 'always',
        },
      ],
    },
  },

  {
    files: ['apps/server/**/*.ts', 'apps/worker/**/*.ts'],
    languageOptions: {
      globals: {
        node: true,
      },
    },
    rules: {
      'no-console': 'off',
    },
  },

  require('eslint-config-prettier/flat'),
];
