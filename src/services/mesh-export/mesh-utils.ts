/*---------------------------------------------------------------------------------------------
 * Copyright (c) Bentley Systems, Incorporated. All rights reserved.
 * See LICENSE.md in the project root for license terms and full copyright notice.
 *--------------------------------------------------------------------------------------------*/

import { deflate } from "pako";

import { ExportInfo } from "./models/export-info.js";

export function extractTileSetUrl(exportInfo: ExportInfo): string {
  if (exportInfo._links.mesh.href === undefined) {
    throw new Error(`No tileset url found for export info id: ${exportInfo.id}`);
  }

  const urlParts = exportInfo._links.mesh.href.split("?");
  return `${urlParts[0]}/tileset.json?${urlParts[1]}`;
}

export function makeCompressedBase64String(data: string[]): string {
  let jsonString = JSON.stringify(data);
  jsonString = jsonString.slice(2, 2 + jsonString.length - 4);
  let base64String = Buffer.from(deflate(jsonString, { raw: true })).toString("base64");
  base64String = base64String.replace(/=+$/, ""); // remove padding

  return base64String;
}
