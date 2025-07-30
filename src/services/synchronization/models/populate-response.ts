/*---------------------------------------------------------------------------------------------
 * Copyright (c) Bentley Systems, Incorporated. All rights reserved.
 * See LICENSE.md in the project root for license terms and full copyright notice.
 *--------------------------------------------------------------------------------------------*/

import { ConnectorType } from "./connector-type.js";

export interface PopulateResponse {
  iModelId: string;
  iTwinId: string;
  rootFolderId: string;
  summary: {
    connectionId: string;
    files: {
      connectorType: ConnectorType;
      fileId: string;
      fileName: string;
    }[];
    runId: string;
  }[];
}
