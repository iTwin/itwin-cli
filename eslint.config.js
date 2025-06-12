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
      '@stylistic/semi': 'warn',
      '@stylistic/indent': ['warn', 2],
      '@typescript-eslint/explicit-function-return-type': ['warn', 
        {
          "allowedNames": ["tests", "sharedQuickUseCasesParallel"]
        }
      ],
      '@stylistic/keyword-spacing': ['warn'],
      '@stylistic/key-spacing': ['warn'],
      '@stylistic/space-infix-ops': ['warn'],
      '@stylistic/arrow-spacing': ['warn'],
      '@stylistic/type-generic-spacing': ['warn'],
      '@stylistic/type-annotation-spacing': ['warn'],
      '@stylistic/switch-colon-spacing': ['warn'],
      '@stylistic/rest-spread-spacing': ['warn'],
      '@stylistic/block-spacing': ['warn'],
      '@stylistic/semi-spacing': ['warn'],
      '@stylistic/space-unary-ops': ['warn'],
      '@stylistic/space-before-blocks': ['warn'],
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