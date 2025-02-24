/*---------------------------------------------------------------------------------------------
* Copyright (c) Bentley Systems, Incorporated. All rights reserved.
* See LICENSE.md in the project root for license terms and full copyright notice.
*--------------------------------------------------------------------------------------------*/

import { loginToCli } from "../utils/helpers";
import enableDisableInfoTests from "./enable-disable-info";

describe('Changed Elements Integration Tests', () => {
  beforeEach(async () => {
    await loginToCli();
  });

  enableDisableInfoTests();

});