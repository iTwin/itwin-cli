import eslint from '@eslint/js';
import tseslint from 'typescript-eslint';
import stylistic from '@stylistic/eslint-plugin';
import iTwinEslintPlugin from '@itwin/eslint-plugin';

export default tseslint.config(
  eslint.configs.recommended,
  tseslint.configs.recommended,
  tseslint.configs.stylistic,
  iTwinEslintPlugin.configs.iTwinjsRecommendedConfig,
  {
    plugins: {
      "@stylistic": stylistic,
    },
    files: ["**/*.{ts, test.ts}"],
    rules: {
      '@stylistic/semi': 'error',
    }
  },
);