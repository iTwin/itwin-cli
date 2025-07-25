/*---------------------------------------------------------------------------------------------
 * Copyright (c) Bentley Systems, Incorporated. All rights reserved.
 * See LICENSE.md in the project root for license terms and full copyright notice.
 *--------------------------------------------------------------------------------------------*/

import { AuthenticationType } from "./authentication-type.js";
import { ConnectionLinks } from "./connection-links.js";

export interface StorageConnection {
  // eslint-disable-next-line @typescript-eslint/naming-convention
  _links: ConnectionLinks;
  authenticationType: AuthenticationType;
  displayName: string;
  error: StorageConnectionError;
  iModelId: string;
  iTwinId: string;
  id: string;
}

export interface StorageConnectionError {
  description: string;
  errorKey: string;
}
