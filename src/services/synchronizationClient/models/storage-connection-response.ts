/*---------------------------------------------------------------------------------------------
* Copyright (c) Bentley Systems, Incorporated. All rights reserved.
* See LICENSE.md in the project root for license terms and full copyright notice.
*--------------------------------------------------------------------------------------------*/

import { Links } from "../../general-models/links.js";
import { StorageConnection } from "./storage-connection.js";

export interface StorageConnectionResponse {
  connection?: StorageConnection;
}

export interface StorageConnectionListResponse {
  // eslint-disable-next-line @typescript-eslint/naming-convention
  _links: Links;
  connections: StorageConnection[];
}

export interface StorageConnectionUpdate {
  authenticationType?: 'Service' | 'User';
  displayName?: string;
}
