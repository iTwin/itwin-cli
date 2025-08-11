/*---------------------------------------------------------------------------------------------
 * Copyright (c) Bentley Systems, Incorporated. All rights reserved.
 * See LICENSE.md in the project root for license terms and full copyright notice.
 *--------------------------------------------------------------------------------------------*/

import { AuthorizationType } from "../../src/services/authorization/authorization-type";
import { deleteMockToken, writeMockToken } from "./helpers";
import { setupMockEnvironment } from "./mock-environment";

before(async () => {
  writeMockToken("mock-client", AuthorizationType.Service);
  setupMockEnvironment();
});

after(async () => {
  deleteMockToken();
});
