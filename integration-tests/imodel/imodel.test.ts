/*---------------------------------------------------------------------------------------------
 * Copyright (c) Bentley Systems, Incorporated. All rights reserved.
 * See LICENSE.md in the project root for license terms and full copyright notice.
 *--------------------------------------------------------------------------------------------*/

import runSuiteIfMainModule from "../utils/run-suite-if-main-module";
import changesetTests from "./changeset.test";
import connectionTests from "./connection/connection.test";
import createDeleteTests from "./create-delete.test";
import infoTests from "./info.test";
import listTests from "./list.test";
import updateTests from "./update.test";
import viewCesiumSandcastleTests from "./view-cesium-sandcastle.test";

const tests = () =>
  describe("iModel Integration Tests", () => {
    changesetTests();
    connectionTests();
    createDeleteTests();
    infoTests();
    listTests();
    updateTests();
    viewCesiumSandcastleTests();
  });

export default tests;

runSuiteIfMainModule(import.meta, tests);
