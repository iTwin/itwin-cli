/*---------------------------------------------------------------------------------------------
* Copyright (c) Bentley Systems, Incorporated. All rights reserved.
* See LICENSE.md in the project root for license terms and full copyright notice.
*--------------------------------------------------------------------------------------------*/

import isMainModule from "../utils/is-main-module";
import createTests from "./create";
import deleteTests from './delete';
import infoTests from "./info";
import listTests from "./list";
import repositoryTests from "./repository"
import updateTests from "./update";

const tests = () => describe('iTwin Integration Tests', () => {
  createTests();
  listTests();
  infoTests();
  updateTests();
  deleteTests();
  repositoryTests();
});

export default tests;

if (isMainModule(import.meta)) {
    tests();
}
