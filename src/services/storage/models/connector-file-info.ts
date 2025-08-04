/*---------------------------------------------------------------------------------------------
 * Copyright (c) Bentley Systems, Incorporated. All rights reserved.
 * See LICENSE.md in the project root for license terms and full copyright notice.
 *--------------------------------------------------------------------------------------------*/

import { ConnectorType } from "../../synchronization/models/connector-type.js";

export interface ConnectorFileInfo {
  connectorType: ConnectorType;
  fileName: string;
  fullFilePath: string;
}
