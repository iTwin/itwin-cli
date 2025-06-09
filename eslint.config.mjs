import eslint from '@eslint/js';
import tseslint from 'typescript-eslint';
import stylistic from '@stylistic/eslint-plugin';
import iTwinEslintPlugin from '@itwin/eslint-plugin';
import { defineConfig, globalIgnores } from "eslint/config";

export default tseslint.config(
  defineConfig([globalIgnores(["dist/*", "tmp/*"])]),
  {
    ...eslint.configs.recommended,
    languageOptions: {
      parser: tseslint.parser,
      parserOptions: {
        project: "tsconfig.eslint.json",
      },
    },
  },
  tseslint.configs.recommended.map(config => {
    return {
      ...config,
      languageOptions: {
        parser: tseslint.parser,
        parserOptions: {
          project: "tsconfig.eslint.json",
        },
      },
    };
  }),
  tseslint.configs.stylistic.map(config => {
    return {
      ...config,
      languageOptions: {
        parser: tseslint.parser,
        parserOptions: {
          project: "tsconfig.eslint.json",
        },
      },
    };
  }),
  {
    ...iTwinEslintPlugin.configs.iTwinjsRecommendedConfig,
    ignores: ["bin/*", "eslint.config.mjs"],
    languageOptions: {
      parser: tseslint.parser,
      parserOptions: {
        project: "tsconfig.eslint.json",
      },
    },
  },
  {
    plugins: {
      "@stylistic": stylistic,
    },
    rules: {
      '@stylistic/semi': 'error',
    },
    languageOptions: {
      parser: tseslint.parser,
      parserOptions: {
        project: "tsconfig.eslint.json",
      },
    },
  },
  {
    files: ["integration-tests/**/*"],
    rules: {
      '@typescript-eslint/no-non-null-assertion': 'off'
    },
    languageOptions: {
      parser: tseslint.parser,
      parserOptions: {
        project: "tsconfig.eslint.json",
      },
    },
  }
);