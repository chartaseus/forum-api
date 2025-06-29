import js from '@eslint/js';
import globals from 'globals';
import { defineConfig } from 'eslint/config';
import stylistic from '@stylistic/eslint-plugin';

export default defineConfig([
  stylistic.configs.customize({
    semi: true,
    arrowParens: true,
    braceStyle: '1tbs',
  }),
  {
    files: ['**/*.{js,mjs,cjs}'],
    plugins: {
      js,
      '@stylistic': stylistic,
    },
    extends: ['js/recommended'],
    rules: {
      '@stylistic/object-property-newline': ['error', { allowAllPropertiesOnSameLine: true }],
      '@stylistic/object-curly-newline': ['error', { multiline: true }],
      '@stylistic/quotes': ['error', 'single', { allowTemplateLiterals: 'avoidEscape' }],
    },
    languageOptions: {
      globals: {
        ...globals.node,
        ...globals.jest,
      },
    },
  },
  {
    files: ['**/*.js'],
    languageOptions: { sourceType: 'commonjs' },
  },
]);
