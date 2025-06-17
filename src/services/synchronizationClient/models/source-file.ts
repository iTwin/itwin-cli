/*---------------------------------------------------------------------------------------------
 * Copyright (c) Bentley Systems, Incorporated. All rights reserved.
 * See LICENSE.md in the project root for license terms and full copyright notice.
 *--------------------------------------------------------------------------------------------*/

import { Link, Links } from "../../general-models/links.js";
import { ConnectorType } from "./connector-type.js";

export type SourceFile = {
  // eslint-disable-next-line @typescript-eslint/naming-convention
  _links: {
    file: Link;
  };
  id: string;
  lastKnownFileName: string;
} & SourceFileInfo;

export interface SourceFileInfo {
  connectorType: ConnectorType;
  storageFileId: string;
}

export interface SourceFileResponse {
  sourceFile: SourceFile;
}

export interface SourceFilesResponse {
  // eslint-disable-next-line @typescript-eslint/naming-convention
  _links: Links;
  sourceFiles: SourceFile[];
}
