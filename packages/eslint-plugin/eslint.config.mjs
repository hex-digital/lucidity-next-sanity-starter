import eslintPlugin from '@pkg/eslint-plugin';

const eslintConfig = eslintPlugin({
  react: true,
  typescript: {
    tsconfigPath: 'tsconfig.json',
  },
});

export default eslintConfig;
