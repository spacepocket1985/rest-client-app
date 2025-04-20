import { FlatCompat } from '@eslint/eslintrc';
import js from '@eslint/js';
import globals from 'globals';
import tsparser from '@typescript-eslint/parser';
import tseslint from '@typescript-eslint/eslint-plugin';
import react from 'eslint-plugin-react';
import reactHooks from 'eslint-plugin-react-hooks';
import reactRefresh from 'eslint-plugin-react-refresh';
import reactCompiler from 'eslint-plugin-react-compiler';
import next from '@next/eslint-plugin-next';
import eslintPluginPrettier from 'eslint-plugin-prettier/recommended';

const compat = new FlatCompat({
  baseDirectory: import.meta.dirname,
});

const eslintConfig = [
  js.configs.recommended,

  {
    plugins: {
      '@next/next': next,
    },
    rules: {
      '@next/next/no-img-element': 'error',
    },
  },

  eslintPluginPrettier,

  ...compat.config({
    extends: ['plugin:@typescript-eslint/recommended', 'plugin:@typescript-eslint/strict'],
  }),

  ...compat.config({
    extends: ['plugin:react/recommended', 'plugin:react-hooks/recommended', 'plugin:react/jsx-runtime'],
  }),

  {
    languageOptions: {
      parser: tsparser,
      ecmaVersion: 2020,
      globals: globals.browser,
    },
    plugins: {
      react,
      'react-hooks': reactHooks,
      '@typescript-eslint': tseslint,
      'react-refresh': reactRefresh,
      'react-compiler': reactCompiler,
    },
    rules: {
      ...reactHooks.configs.recommended.rules,
      // 'react-refresh/only-export-components': ['warn', { allowConstantExport: true }],

      'react-compiler/react-compiler': 'error',
      'react/display-name': 'off',
      'react/prop-types': 'off',

      '@typescript-eslint/no-non-null-assertion': 'off',
      '@typescript-eslint/no-empty-function': 'off',
      '@typescript-eslint/no-explicit-any': 'error',

      'no-debugger': 'warn',
      'no-console': ['warn', { allow: ['warn', 'error'] }],
      'no-param-reassign': 'error',
      'padding-line-between-statements': [
        'error',
        { blankLine: 'always', prev: '*', next: 'return' },
        { blankLine: 'always', prev: ['const', 'let', 'var'], next: '*' },
        { blankLine: 'any', prev: ['const', 'let', 'var'], next: ['const', 'let', 'var'] },
        { blankLine: 'always', prev: 'directive', next: '*' },
        { blankLine: 'always', prev: 'block-like', next: '*' },
      ],
    },
    settings: {
      react: {
        version: 'detect',
      },
    },
  },
];

export default eslintConfig;
