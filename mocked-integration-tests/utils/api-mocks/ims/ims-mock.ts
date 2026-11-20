/*---------------------------------------------------------------------------------------------
 * Copyright (c) Bentley Systems, Incorporated. All rights reserved.
 * See LICENSE.md in the project root for license terms and full copyright notice.
 *--------------------------------------------------------------------------------------------*/

import nock from "nock";

/* eslint-disable @typescript-eslint/naming-convention -- OIDC discovery and token responses use snake_case properties */
export class ImsMock {
  public static serviceLogin = {
    success: (issuerUrl: string): void => {
      const issuer = issuerUrl.replace(/\/$/, "");
      nock(issuer)
        .get("/.well-known/openid-configuration")
        .reply(200, {
          issuer,
          authorization_endpoint: `${issuer}/connect/authorize`,
          jwks_uri: `${issuer}/.well-known/openid-configuration/jwks`,
          token_endpoint: `${issuer}/connect/token`,
          response_types_supported: ["code"],
          subject_types_supported: ["public"],
          id_token_signing_alg_values_supported: ["RS256"],
        });

      nock(issuer).post("/connect/token").reply(200, { access_token: createUnsignedJwt(), expires_in: 3600, token_type: "Bearer" });
    },
  };
}

function createUnsignedJwt(): string {
  const encode = (value: object): string => Buffer.from(JSON.stringify(value)).toString("base64url");
  return `${encode({ alg: "none", typ: "JWT" })}.${encode({ exp: Math.floor(Date.now() / 1000) + 3600 })}.`;
}
