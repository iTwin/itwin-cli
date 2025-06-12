/*---------------------------------------------------------------------------------------------
 * Copyright (c) Bentley Systems, Incorporated. All rights reserved.
 * See LICENSE.md in the project root for license terms and full copyright notice.
 *--------------------------------------------------------------------------------------------*/

import process from "node:process";
import { fileURLToPath } from "node:url";

/**
 * Checks whether the current test file being executed matches the file/pattern, that was provided as an argument to mocha.
 * This makes it possible to both export tests and be able to run only part of the tests with 'Debug Active Test' launch configuration.
 * @param meta `import.meta` object of the current file.
 * @returns `true`, if the current file is not an import, otherwise `false`
 */
function isMainModule(meta: { url: string }): boolean {
  for (const arg of process.argv) {
    if (arg.match(/integration-tests(\/|\\).*\.test\.ts/) === null) {
      continue;
    }

    if (!meta || !arg) {
      return false;
    }

    const currentFilePath = fileURLToPath(meta.url).replaceAll("\\", "/");

    const mainFilePath = arg;
    const mainFilePathRegex = mainFilePath.replaceAll("\\", "/").replaceAll(".", "\\.").replaceAll("**", ".*?").replaceAll("*", ".*?");

    if (currentFilePath.match(mainFilePathRegex) !== null) return true;
  }

  return false;
}

/**
 * Run the provided test suite if provided meta object is main module.
 * @param meta Provided `import.meta` object.
 * @param testSuite Test suite that should be executed.
 */
export default function runSuiteIfMainModule(meta: { url: string }, testSuite: () => Mocha.Suite): void {
  if (isMainModule(meta)) {
    testSuite();
  }
}
