/*---------------------------------------------------------------------------------------------
* Copyright (c) Bentley Systems, Incorporated. All rights reserved.
* See LICENSE.md in the project root for license terms and full copyright notice.
*--------------------------------------------------------------------------------------------*/

import { Link, Links } from "../../general-models/links.js"
import { ConnectorType } from "./connector-type.js"

export type SourceFile = {
    _links: {
        file: Link
    }
    id: string,
    lastKnownFileName: string,
} & SourceFileInfo

export type SourceFileInfo = {
    connectorType: ConnectorType
    storageFileId: string,
}

export type SourceFileResponse = {
    sourceFile: SourceFile;
}

export type SourceFilesResponse = {
    _links: Links
    sourceFiles: SourceFile[];
}