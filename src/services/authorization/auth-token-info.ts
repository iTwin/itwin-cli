/*---------------------------------------------------------------------------------------------
 * Copyright (c) Bentley Systems, Incorporated. All rights reserved.
 * See LICENSE.md in the project root for license terms and full copyright notice.
 *--------------------------------------------------------------------------------------------*/

import { AuthorizationType } from "./authorization-type.js";

export interface AuthTokenInfo {
  apiUrl: string;
  issuerUrl: string;
  clientId: string;
  authToken: string;
  authenticationType: AuthorizationType;
  expirationDate: Date;
}
