import { defineConfig } from 'eslint/config';
import eslint from '@eslint/js';
import tseslint, { plugin } from 'typescript-eslint';

export default defineConfig([
  {
    ignores: ['eslint.config.js', 'vite.config.js', 'ecommerce-application/coverage'],
  },
  eslint.configs.recommended,
  tseslint.configs.recommendedTypeChecked,
  {
    languageOptions: {
      parserOptions: {
        projectService: true,
        tsconfigRootDir: import.meta.dirname,
      },
    },
    linterOptions: {
      noInlineConfig: true,
      reportUnusedDisableDirectives: 'error',
    },
  },
  {
    rules: {
      '@typescript-eslint/consistent-type-assertions': ['error', { assertionStyle: 'never' }],
      '@typescript-eslint/consistent-type-imports': 'error',
      '@typescript-eslint/explicit-function-return-type': 'error',
      '@typescript-eslint/explicit-member-accessibility': [
        'error',
        { accessibility: 'explicit', overrides: { constructors: 'off' } },
      ],
      //'@typescript-eslint/member-ordering': 'error',
      'class-methods-use-this': 'error',
      'lines-between-class-members': [2, 'always', { exceptAfterSingleLine: true }],
      'no-multiple-empty-lines': [2, { max: 1, maxEOF: 0 }],
      'padding-line-between-statements': [
        2,
        {
          blankLine: 'always',
          prev: '*',
          next: ['return', 'break'],
        },
        {
          blankLine: 'always',
          prev: ['const', 'let'],
          next: '*',
        },
        {
          blankLine: 'any',
          prev: ['const', 'let'],
          next: ['const', 'let'],
        },
        {
          blankLine: 'always',
          prev: '*',
          next: 'if',
        },
        {
          blankLine: 'always',
          prev: 'if',
          next: '*',
        },
      ],
    },
  },
]);
