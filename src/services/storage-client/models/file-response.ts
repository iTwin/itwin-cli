/*---------------------------------------------------------------------------------------------
* Copyright (c) Bentley Systems, Incorporated. All rights reserved.
* See LICENSE.md in the project root for license terms and full copyright notice.
*--------------------------------------------------------------------------------------------*/

import { Links } from "../../general-models/links.js";
import { FileTyped } from "./file-typed.js";

export type FileResponse = {
    file?: FileTyped;
};

export type FilesResponse = {
    files: FileTyped[];
}

export type ItemsResponse = {
    _links: Links
    items: FileTyped[];
}
