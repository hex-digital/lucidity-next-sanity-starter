import studio from '@sanity/eslint-config-studio';

export default [
  {
    ignores: [
      'lint-staged.config.cjs',
      'features/modular-content-blocks/scripts/generate-sanity-block-schema-imports.cjs',
    ],
  },
  ...studio,
  {
    languageOptions: {
      sourceType: 'module',
    },
  },
];
