/*---------------------------------------------------------------------------------------------
* Copyright (c) Bentley Systems, Incorporated. All rights reserved.
* See LICENSE.md in the project root for license terms and full copyright notice.
*--------------------------------------------------------------------------------------------*/

import { Link } from "../../general-models/links.js";

export interface AuthInfo {
  // eslint-disable-next-line @typescript-eslint/naming-convention
  _links: {
    authorizationUrl: Link
  }
  isUserAuthorized: boolean
}

export interface ConnectionAuth {
  authorizationInformation: AuthInfo
}