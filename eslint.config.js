/*---------------------------------------------------------------------------------------------
 * Copyright (c) Bentley Systems, Incorporated. All rights reserved.
 * See LICENSE.md in the project root for license terms and full copyright notice.
 *--------------------------------------------------------------------------------------------*/

import eslint from "@eslint/js";
import tseslint from "typescript-eslint";
import prettier from "eslint-plugin-prettier/recommended";
import iTwinEslintPlugin from "@itwin/eslint-plugin";
import { defineConfig, globalIgnores } from "eslint/config";

export default tseslint.config(
  defineConfig([globalIgnores(["dist/*", "tmp/*"])]),
  eslint.configs.recommended,
  tseslint.configs.recommended,
  iTwinEslintPlugin.configs.iTwinjsRecommendedConfig,
  {
    rules: {
      "@typescript-eslint/explicit-function-return-type": [
        "warn",
        {
          allowedNames: ["tests", "sharedQuickUseCasesParallel"],
        },
      ],
      "prettier/prettier": ["warn", { endOfLine: "auto" }],
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
      "@typescript-eslint/no-non-null-assertion": "off",
    },
  },
  prettier,
);
