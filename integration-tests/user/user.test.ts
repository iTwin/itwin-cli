/*---------------------------------------------------------------------------------------------
* Copyright (c) Bentley Systems, Incorporated. All rights reserved.
* See LICENSE.md in the project root for license terms and full copyright notice.
*--------------------------------------------------------------------------------------------*/

import { loginToCli } from "../utils/helpers";
import infoTests from "./info";
import meTests from "./me"
import searchTests from "./search";

describe('User Integration Tests', () => {
  beforeEach(async () => {
    await loginToCli();
  });

  infoTests();
  meTests();
  searchTests();
});