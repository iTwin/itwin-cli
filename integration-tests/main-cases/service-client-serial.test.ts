/*---------------------------------------------------------------------------------------------
 * Copyright (c) Bentley Systems, Incorporated. All rights reserved.
 * See LICENSE.md in the project root for license terms and full copyright notice.
 *--------------------------------------------------------------------------------------------*/

import authTestsService from "../auth-service/auth-service.test";

describe("Service Client Tests (serial)", () => {
  describe("Authentication Integration Tests", () => {
    authTestsService();
  });
});
