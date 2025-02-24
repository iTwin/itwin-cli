/*---------------------------------------------------------------------------------------------
* Copyright (c) Bentley Systems, Incorporated. All rights reserved.
* See LICENSE.md in the project root for license terms and full copyright notice.
*--------------------------------------------------------------------------------------------*/

import { link, links } from "../../general-models/links.js"
import { connectorType } from "./connector-type.js"

export type sourceFile = {
    _links: {
        file: link
    }
    id: string,
    lastKnownFileName: string,
} & sourceFileInfo

export type sourceFileInfo = {
    connectorType: connectorType
    storageFileId: string,
}

export type sourceFileResponse = {
    sourceFile: sourceFile;
}

export type sourceFilesResponse = {
    _links: links
    sourceFiles: sourceFile[];
}