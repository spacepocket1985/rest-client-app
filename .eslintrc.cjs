const js = require('@eslint/js');
const globals = require('globals');
const reactHooks = require('eslint-plugin-react-hooks');
const reactRefresh = require('eslint-plugin-react-refresh');
const react = require('eslint-plugin-react');
const tseslint = require('@typescript-eslint/eslint-plugin');
const eslintPluginPrettier = require('eslint-plugin-prettier');
const reactCompiler = require('eslint-plugin-react-compiler');
const next = require('eslint-plugin-next');

module.exports = tseslint.config(
  { ignores: ['dist'] },
  {
    extends: [
      js.configs.recommended,
      ...tseslint.configs.strict,
      eslintPluginPrettier,
      'plugin:next/recommended', // Добавляем плагин Next.js
    ],
    files: ['**/*.{ts,tsx}'],
    languageOptions: {
      ecmaVersion: 2020,
      globals: globals.browser,
    },
    plugins: {
      react,
      'react-hooks': reactHooks,
      'react-refresh': reactRefresh,
      'react-compiler': reactCompiler,
      next, // Добавляем плагин Next.js
    },
    rules: {
      ...reactHooks.configs.recommended.rules,
      'react-refresh/only-export-components': [
        'warn',
        { allowConstantExport: true },
      ],
      'react-compiler/react-compiler': 'error',
      ...react.configs.recommended.rules,
      ...react.configs['jsx-runtime'].rules,
      '@typescript-eslint/no-non-null-assertion': 'off',
      '@typescript-eslint/no-empty-function': 'off',
      'react/display-name': 'off',
      'react/prop-types': 'off',
      '@typescript-eslint/no-explicit-any': 'error',
      'next/no-img-element': 'error',
    },
    settings: {
      react: {
        version: 'detect',
      },
    },
  }
);
