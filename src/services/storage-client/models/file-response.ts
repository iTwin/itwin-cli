/*---------------------------------------------------------------------------------------------
* Copyright (c) Bentley Systems, Incorporated. All rights reserved.
* See LICENSE.md in the project root for license terms and full copyright notice.
*--------------------------------------------------------------------------------------------*/

import { Links } from "../../general-models/links.js";
import { FileTyped } from "./file-typed.js";

export interface FileResponse {
  file?: FileTyped;
}

export interface FilesResponse {
  files: FileTyped[];
}

export interface ItemsResponse {
  // eslint-disable-next-line @typescript-eslint/naming-convention
  _links: Links
  items: FileTyped[];
}
