/*---------------------------------------------------------------------------------------------
 * Copyright (c) Bentley Systems, Incorporated. All rights reserved.
 * See LICENSE.md in the project root for license terms and full copyright notice.
 *--------------------------------------------------------------------------------------------*/

import { ExportInfo } from "./models/export-info.js";

export function extractTileSetUrl(exportInfo: ExportInfo): string {
  if (exportInfo._links.mesh.href === undefined) {
    throw new Error(`No tileset url found for export info id: ${exportInfo.id}`);
  }

  const urlParts = exportInfo._links.mesh.href.split("?");
  return `${urlParts[0]}/tileset.json?${urlParts[1]}`;
}
