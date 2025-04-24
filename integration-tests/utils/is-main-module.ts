/*---------------------------------------------------------------------------------------------
* Copyright (c) Bentley Systems, Incorporated. All rights reserved.
* See LICENSE.md in the project root for license terms and full copyright notice.
*--------------------------------------------------------------------------------------------*/

import process from 'node:process';
import {fileURLToPath} from 'node:url';

/**
 * Checks whether the current test file being executed matches the file/pattern, that was provided as an argument to mocha.
 * This makes it possible to both export tests and be able to run only part of the tests with 'Debug Active Test' launch configuration.
 * @param meta `import.meta` object of the current file.
 * @returns `true`, if the current file is not an import, otherwise `false`
 */
export default function isMainModule(meta: {url: string}) {
    if (!meta || !process.argv[2]) {
        return false;
    }

    const currentFilePath = fileURLToPath(meta.url)
        .replaceAll("\\", "/");

    const mainFilePath = process.argv[2];
    const mainFilePathRegex = mainFilePath
        .replaceAll("\\", "/")
        .replaceAll(".", "\\.")
        .replaceAll("**", ".*?")
        .replaceAll("*", ".*?");
    
    return currentFilePath.match(mainFilePathRegex) !== null;
}
