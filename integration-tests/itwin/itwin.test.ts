/*---------------------------------------------------------------------------------------------
* Copyright (c) Bentley Systems, Incorporated. All rights reserved.
* See LICENSE.md in the project root for license terms and full copyright notice.
*--------------------------------------------------------------------------------------------*/

import { serviceLoginToCli } from "../utils/helpers";
import createTests from "./create";
import deleteTests from './delete';
import infoTests from "./info";
import listTests from "./list";
import repositoryTests from "./repository"
import updateTests from "./update";

describe('iTwin Integration Tests', () => {
  beforeEach(async () => {
    await serviceLoginToCli();
  });

  createTests();
  listTests();
  infoTests();
  updateTests();
  deleteTests();
  repositoryTests();
});
