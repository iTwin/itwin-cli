/*---------------------------------------------------------------------------------------------
 * Copyright (c) Bentley Systems, Incorporated. All rights reserved.
 * See LICENSE.md in the project root for license terms and full copyright notice.
 *--------------------------------------------------------------------------------------------*/

import accessControlTests from "../access-control/access-control.test";
import apiTests from "../api/api.test";
import authTests from "../auth/auth.test";
import iModelTests from "../imodel/imodel.test";
import iTwinTests from "../itwin/itwin.test";

describe("Mocked integration tests", () => {
  accessControlTests();
  apiTests();
  authTests();
  iModelTests();
  iTwinTests();
});
