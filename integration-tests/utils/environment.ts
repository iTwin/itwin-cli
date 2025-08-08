/*---------------------------------------------------------------------------------------------
 * Copyright (c) Bentley Systems, Incorporated. All rights reserved.
 * See LICENSE.md in the project root for license terms and full copyright notice.
 *--------------------------------------------------------------------------------------------*/

import * as dotenv from "dotenv";

dotenv.config({ path: ".env" });

export const {
  ITP_API_URL,
  ITP_ISSUER_URL,
  ITP_NATIVE_TEST_CLIENT_ID,
  ITP_SERVICE_CLIENT_ID,
  ITP_SERVICE_CLIENT_SECRET,
  ITP_TEST_USER_EMAIL,
  ITP_TEST_USER_PASSWORD,
} = process.env;
