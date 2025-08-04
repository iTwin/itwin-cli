/*---------------------------------------------------------------------------------------------
 * Copyright (c) Bentley Systems, Incorporated. All rights reserved.
 * See LICENSE.md in the project root for license terms and full copyright notice.
 *--------------------------------------------------------------------------------------------*/

import { deleteMockToken, writeMockToken } from "./helpers";
import { setupMockEnvironment } from "./mock-environment";

before(async () => {
  writeMockToken();
  setupMockEnvironment();
});

after(async () => {
  deleteMockToken();
});
