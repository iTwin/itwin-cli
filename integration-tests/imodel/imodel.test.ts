/*---------------------------------------------------------------------------------------------
* Copyright (c) Bentley Systems, Incorporated. All rights reserved.
* See LICENSE.md in the project root for license terms and full copyright notice.
*--------------------------------------------------------------------------------------------*/

import { loginToCli } from "../utils/helpers";
import createDeleteTests from "./create-delete";
import infoTests from "./info";
import listTests from "./list";
import updateTests from "./update";

describe('iModel Integration Tests', () => {
  beforeEach(async () => {
    await loginToCli();
  });

  createDeleteTests();
  infoTests();
  updateTests();
  listTests();
});
