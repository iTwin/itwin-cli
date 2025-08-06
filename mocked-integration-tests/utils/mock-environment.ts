/*---------------------------------------------------------------------------------------------
 * Copyright (c) Bentley Systems, Incorporated. All rights reserved.
 * See LICENSE.md in the project root for license terms and full copyright notice.
 *--------------------------------------------------------------------------------------------*/

export const ITP_API_URL = "https://mock-api.bentley.com";
export const ITP_ISSUER_URL = "https://mock-ims.bentley.com";

export const setupMockEnvironment = (): void => {
  process.env.ITP_API_URL = ITP_API_URL;
  process.env.ITP_ISSUER_URL = ITP_ISSUER_URL;
};
