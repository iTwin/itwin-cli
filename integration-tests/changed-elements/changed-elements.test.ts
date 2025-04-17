/*---------------------------------------------------------------------------------------------
* Copyright (c) Bentley Systems, Incorporated. All rights reserved.
* See LICENSE.md in the project root for license terms and full copyright notice.
*--------------------------------------------------------------------------------------------*/

import { serviceLoginToCli } from "../utils/helpers";
import changesetsComparisonTests from "./changesets-comparison";
import enableDisableInfoTests from "./enable-disable-info";

describe('Changed Elements Integration Tests', () => {
  beforeEach(async () => {
    await serviceLoginToCli();
  });

  enableDisableInfoTests();
  changesetsComparisonTests();
});