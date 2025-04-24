/*---------------------------------------------------------------------------------------------
* Copyright (c) Bentley Systems, Incorporated. All rights reserved.
* See LICENSE.md in the project root for license terms and full copyright notice.
*--------------------------------------------------------------------------------------------*/

import process from 'node:process';
import {fileURLToPath} from 'node:url';

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
