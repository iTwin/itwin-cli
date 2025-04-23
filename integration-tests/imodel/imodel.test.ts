/*---------------------------------------------------------------------------------------------
* Copyright (c) Bentley Systems, Incorporated. All rights reserved.
* See LICENSE.md in the project root for license terms and full copyright notice.
*--------------------------------------------------------------------------------------------*/

import { serviceLoginToCli } from "../utils/helpers";
import connectionTests from './connection';
import createDeleteTests from "./create-delete";
import infoTests from "./info";
import listTests from "./list";
import updateTests from "./update";

describe('iModel Integration Tests', () => {
  beforeEach(async () => {
    await serviceLoginToCli();
  });

  createDeleteTests();
  infoTests();
  updateTests();
  listTests();
  connectionTests();
});
