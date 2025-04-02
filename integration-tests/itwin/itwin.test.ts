/*---------------------------------------------------------------------------------------------
* Copyright (c) Bentley Systems, Incorporated. All rights reserved.
* See LICENSE.md in the project root for license terms and full copyright notice.
*--------------------------------------------------------------------------------------------*/

import { loginToCli } from "../utils/helpers";
import createListDeleteTests from "./create-list-delete";
import infoTests from "./info";
import repositoryTests from "./repository"
import updateTests from "./update";

describe('iTwin Integration Tests', () => {
  beforeEach(async () => {
    await loginToCli();
  });

  createListDeleteTests();
  infoTests();
  updateTests();
  repositoryTests();
});
