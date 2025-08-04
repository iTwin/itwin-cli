/*---------------------------------------------------------------------------------------------
 * Copyright (c) Bentley Systems, Incorporated. All rights reserved.
 * See LICENSE.md in the project root for license terms and full copyright notice.
 *--------------------------------------------------------------------------------------------*/

import fs from "node:fs";

import { getTokenPathByOS } from "../../integration-tests/utils/helpers";
import { AuthTokenInfo } from "../../src/services/authorization/auth-token-info";
import { AuthorizationType } from "../../src/services/authorization/authorization-type";
import { ITP_API_URL, ITP_ISSUER_URL } from "./mock-environment";

export function writeMockToken(): void {
  const authTokenObject: AuthTokenInfo = {
    apiUrl: ITP_API_URL,
    issuerUrl: ITP_ISSUER_URL,
    clientId: "mock-client",
    authToken: "Bearer mock-token",
    authenticationType: AuthorizationType.Service,
    expirationDate: new Date(Date.now() + 1000 * 60 * 59),
  };

  fs.writeFileSync(getTokenPathByOS(), JSON.stringify(authTokenObject), "utf8");
}

export function deleteMockToken(): void {
  fs.unlinkSync(getTokenPathByOS());
}
