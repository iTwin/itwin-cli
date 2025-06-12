/*---------------------------------------------------------------------------------------------
 * Copyright (c) Bentley Systems, Incorporated. All rights reserved.
 * See LICENSE.md in the project root for license terms and full copyright notice.
 *--------------------------------------------------------------------------------------------*/

import { FileTyped } from "./file-typed.js";
import { FolderTyped } from "./folder-typed.js";
import { LinksPagingWithFolderLink } from "./links-paging-with-folder-link.js";

export interface ItemsWithFolderLink {
  // eslint-disable-next-line @typescript-eslint/naming-convention
  _links?: LinksPagingWithFolderLink;
  items?: Array<FileTyped | FolderTyped>;
}
