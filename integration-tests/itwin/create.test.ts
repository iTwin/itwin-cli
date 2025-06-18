/*---------------------------------------------------------------------------------------------
 * Copyright (c) Bentley Systems, Incorporated. All rights reserved.
 * See LICENSE.md in the project root for license terms and full copyright notice.
 *--------------------------------------------------------------------------------------------*/

import { expect } from "chai";

import { ITwin } from "@itwin/itwins-client";
import { runCommand } from "@oclif/test";

import { ResultResponse } from "../../src/services/general-models/result-response";
import runSuiteIfMainModule from "../utils/run-suite-if-main-module";

const tests = () =>
  describe("create", () => {
    let testITwinId: string;
    let testITwinId2: string;
    let testITwinChildId: string;
    const testITwinName1 = `IntegrationTestITwin_${new Date().toISOString()}`;
    const testITwinName2 = `OtherIntegrationTestITwin_${new Date().toISOString()}`;
    const testChildITwinName = `IntegrationTestITwinChild_${new Date().toISOString()}`;
    const testClass = "Thing";
    const testSubClass = "Asset";
    const testGeographicLocation = "San Francisco, CA";
    const testDataCenterLocation = "UK South";
    const testStatus = "Inactive";
    const testIanaTimeZone = "America/Los_Angeles";
    const testType = "Type1";
    const testNumber = Math.random().toString(36).slice(2);

    after(async () => {
      const { result: deleteResult1 } = await runCommand<ResultResponse>(`itwin delete --itwin-id ${testITwinChildId}`);
      const { result: deleteResult2 } = await runCommand<ResultResponse>(`itwin delete --itwin-id ${testITwinId}`);
      const { result: deleteResult3 } = await runCommand<ResultResponse>(`itwin delete --itwin-id ${testITwinId2}`);

      expect(deleteResult1).to.have.property("result", "deleted");
      expect(deleteResult2).to.have.property("result", "deleted");
      expect(deleteResult3).to.have.property("result", "deleted");
    });

    it("should create a new iTwin", async () => {
      const { result: iTwin } = await runCommand<ITwin>(
        `itwin create --name "${testITwinName1}" --class ${testClass} --sub-class ${testSubClass} --type ${testType} --number ${testNumber}`,
      );
      expect(iTwin).to.have.property("id");
      expect(iTwin!.displayName).to.be.equal(testITwinName1);
      expect(iTwin!.class).to.be.equal(testClass);
      expect(iTwin!.subClass).to.be.equal(testSubClass);
      expect(iTwin!.type).to.be.equal(testType);
      expect(iTwin!.number).to.be.equal(testNumber);
      testITwinId = iTwin!.id!;
    });

    it("should create a new child iTwin", async () => {
      const { result: iTwinChild } = await runCommand<ITwin>(
        `itwin create --name "${testChildITwinName}" --class ${testClass} --sub-class ${testSubClass} --parent-id ${testITwinId} --status ${testStatus}`,
      );
      expect(iTwinChild).to.have.property("id");
      expect(iTwinChild!.displayName).to.be.equal(testChildITwinName);
      expect(iTwinChild!.class).to.be.equal(testClass);
      expect(iTwinChild!.subClass).to.be.equal(testSubClass);
      expect(iTwinChild!.parentId).to.be.equal(testITwinId);
      expect(iTwinChild!.status).to.be.equal(testStatus);
      testITwinChildId = iTwinChild!.id!;
    });

    it("should create a new iTwin with location information", async () => {
      const { result: iTwin } = await runCommand<ITwin>(
        `itwin create --name "${testITwinName2}" --class ${testClass} --sub-class ${testSubClass} --data-center-location "${testDataCenterLocation}" --iana-time-zone ${testIanaTimeZone} --geographic-location "${testGeographicLocation}"`,
      );
      expect(iTwin).to.have.property("id");
      expect(iTwin!.displayName).to.be.equal(testITwinName2);
      expect(iTwin!.class).to.be.equal(testClass);
      expect(iTwin!.subClass).to.be.equal(testSubClass);
      expect(iTwin!.dataCenterLocation).to.be.equal(testDataCenterLocation);
      expect(iTwin!.ianaTimeZone).to.be.equal(testIanaTimeZone);
      expect(iTwin!.geographicLocation).to.be.equal(testGeographicLocation);
      testITwinId2 = iTwin!.id!;
    });

    it("should return an error when invalid uuid is provided as --parent-id", async () => {
      const { error } = await runCommand<ITwin>(`itwin create --class Thing --name Name --sub-class Asset --parent-id an-invalid-uuid`);
      expect(error?.message).to.contain("'an-invalid-uuid' is not a valid UUID.");
    });
  });

export default tests;

runSuiteIfMainModule(import.meta, tests);
