/*---------------------------------------------------------------------------------------------
 * Copyright (c) Bentley Systems, Incorporated. All rights reserved.
 * See LICENSE.md in the project root for license terms and full copyright notice.
 *--------------------------------------------------------------------------------------------*/

import authTestsNative from "../auth-native/auth-native.test";
import authTests from "../auth/auth.test";
import iModelConnectionAuthTests from "../imodel-native/connection/auth.test";
import { nativeLoginToCli } from "../utils/helpers";

describe("Native Client Tests (serial)", async () => {
  describe("Authentication Integration Tests", async () => {
    after(async () => {
      await nativeLoginToCli();
    });

    authTestsNative();
    authTests();
  });
  iModelConnectionAuthTests();
});
