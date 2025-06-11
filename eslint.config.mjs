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
      '@typescript-eslint/explicit-function-return-type': ['error', 
        {
          "allowedNames": ["tests", "sharedQuickUseCasesParallel"]
        }
      ],
      '@stylistic/keyword-spacing': ['error'],
      '@stylistic/key-spacing': ['error'],
      '@stylistic/space-infix-ops': ['error'],
      '@stylistic/arrow-spacing': ['error'],
      '@stylistic/type-generic-spacing': ['error'],
      '@stylistic/type-annotation-spacing': ['error'],
      '@stylistic/switch-colon-spacing': ['error'],
      '@stylistic/rest-spread-spacing': ['error'],
      '@stylistic/block-spacing': ['error'],
      '@stylistic/semi-spacing': ['error'],
      '@stylistic/space-unary-ops': ['error'],
      '@stylistic/space-before-blocks': ['error'],
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