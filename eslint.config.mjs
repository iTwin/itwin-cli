import eslint from '@eslint/js';
import tseslint from 'typescript-eslint';
import stylistic from '@stylistic/eslint-plugin';
import iTwinEslintPlugin from '@itwin/eslint-plugin';
import { defineConfig, globalIgnores } from "eslint/config";

export default tseslint.config(
  defineConfig([globalIgnores(["dist/*", "tmp/*"])]),
  eslint.configs.recommended,
  tseslint.configs.recommended,
  tseslint.configs.stylistic,
  iTwinEslintPlugin.configs.iTwinjsRecommendedConfig,
  {
    plugins: {
      "@stylistic": stylistic,
    },
    rules: {
      '@stylistic/semi': 'error',
      '@stylistic/indent': ['error', 2],
    },
    languageOptions: {
      parser: tseslint.parser,
      parserOptions: {
        project: "./tsconfig.eslint.json",
      },
    },
  },
  {
    files: ["integration-tests/**/*"],
    rules: {
      '@typescript-eslint/no-non-null-assertion': 'off'
    },
  }
);