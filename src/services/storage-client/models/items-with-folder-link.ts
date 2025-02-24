/*---------------------------------------------------------------------------------------------
* Copyright (c) Bentley Systems, Incorporated. All rights reserved.
* See LICENSE.md in the project root for license terms and full copyright notice.
*--------------------------------------------------------------------------------------------*/

import { fileTyped } from "./file-typed.js";
import { folderTyped } from "./folder-typed.js";
import { linksPagingWithFolderLink } from "./links-paging-with-folder-link.js";

export type itemsWithFolderLink = {
    _links?: linksPagingWithFolderLink
    items?: Array<fileTyped | folderTyped>;
};
