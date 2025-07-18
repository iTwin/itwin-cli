/*---------------------------------------------------------------------------------------------
 * Copyright (c) Bentley Systems, Incorporated. All rights reserved.
 * See LICENSE.md in the project root for license terms and full copyright notice.
 *--------------------------------------------------------------------------------------------*/

import { expect } from "chai";

import { IModel } from "@itwin/imodels-client-management";
import { runCommand } from "@oclif/test";

import { ResultResponse } from "../../src/services/general-models/result-response";
import { createITwin } from "../utils/helpers";
import runSuiteIfMainModule from "../utils/run-suite-if-main-module";

const tests = () =>
  describe("list", () => {
    const testIModelName1 = `1-cli-imodel-integration-test-${new Date().toISOString()}`;
    const testIModelName2 = `2-cli-imodel-integration-test-${new Date().toISOString()}`;
    const testIModelDescription1 = "First iModel description.";
    const testIModelDescription2 = "Second iModel description.";
    let testIModelId1: string;
    let testIModelId2: string;
    let testITwinId: string;

    before(async () => {
      const testITwin = await createITwin(`cli-itwin-integration-test-${new Date().toISOString()}`, "Thing", "Asset");
      testITwinId = testITwin.id as string;
      const { result: testIModel1 } = await runCommand<IModel>(
        `imodel create --itwin-id ${testITwinId} --name "${testIModelName1}" --description "${testIModelDescription1}"`,
      );
      testIModelId1 = testIModel1!.id;
      const { result: testIModel2 } = await runCommand<IModel>(
        `imodel create --itwin-id ${testITwinId} --name "${testIModelName2}" --description "${testIModelDescription2}"`,
      );
      testIModelId2 = testIModel2!.id;
    });

    after(async () => {
      const { result: imodelDeleteResult1 } = await runCommand<ResultResponse>(`imodel delete --imodel-id ${testIModelId1}`);
      const { result: imodelDeleteResult2 } = await runCommand<ResultResponse>(`imodel delete --imodel-id ${testIModelId2}`);
      const { result: itwinDeleteResult } = await runCommand<ResultResponse>(`itwin delete --itwin-id ${testITwinId}`);

      expect(imodelDeleteResult1).to.have.property("result", "deleted");
      expect(imodelDeleteResult2).to.have.property("result", "deleted");
      expect(itwinDeleteResult).to.have.property("result", "deleted");
    });

    it("should list all iModels for the specified iTwin", async () => {
      const { result: iModelList } = await runCommand<IModel[]>(`imodel list --itwin-id ${testITwinId}`);

      expect(iModelList).to.not.be.undefined;
      expect(iModelList).to.be.an("array").that.is.not.empty;
      expect(iModelList!.some((imodel) => imodel.id === testIModelId1)).to.be.true;
      expect(iModelList!.some((imodel) => imodel.id === testIModelId2)).to.be.true;
    });

    it("should skip iModels and should top results", async () => {
      const { result: iModelList } = await runCommand<IModel[]>(`imodel list --itwin-id ${testITwinId}`);
      expect(iModelList).to.not.be.undefined;
      expect(iModelList).to.be.an("array").with.lengthOf(2);

      const { result: iModelListSkip } = await runCommand<IModel[]>(`imodel list --itwin-id ${testITwinId} --skip 1`);
      expect(iModelListSkip).to.not.be.undefined;
      expect(iModelListSkip).to.be.an("array").with.lengthOf(1);
      expect(iModelListSkip!.some((imodel) => imodel.id === iModelList![0].id)).to.be.false;
      expect(iModelListSkip!.some((imodel) => imodel.id === iModelList![1].id)).to.be.true;

      const { result: iModelListTop } = await runCommand<IModel[]>(`imodel list --itwin-id ${testITwinId} --top 1`);
      expect(iModelListTop).to.not.be.undefined;
      expect(iModelListTop).to.be.an("array").with.lengthOf(1);
      expect(iModelListTop!.some((imodel) => imodel.id === iModelList![0].id)).to.be.true;
      expect(iModelListTop!.some((imodel) => imodel.id === iModelList![1].id)).to.be.false;
    });

    it("should list iModels by name", async () => {
      const { result: iModelList } = await runCommand<IModel[]>(`imodel list --itwin-id ${testITwinId} --name ${testIModelName1}`);
      expect(iModelList).to.not.be.undefined;
      expect(iModelList).to.be.an("array").with.lengthOf(1);
      expect(iModelList!.some((imodel) => imodel.id === testIModelId1)).to.be.true;
      expect(iModelList!.some((imodel) => imodel.id === testIModelId2)).to.be.false;
    });

    it("should order returned results", async () => {
      const { result: iModelListAsc } = await runCommand<IModel[]>(`imodel list --itwin-id ${testITwinId} --order-by "createdDateTime asc"`);
      expect(iModelListAsc).to.not.be.undefined;
      expect(iModelListAsc).to.be.an("array").with.lengthOf(2);
      expect(new Date(iModelListAsc![0].createdDateTime)).to.be.lessThanOrEqual(new Date(iModelListAsc![1].createdDateTime));

      const { result: iModelListDesc } = await runCommand<IModel[]>(`imodel list --itwin-id ${testITwinId} --order-by "createdDateTime desc"`);
      expect(iModelListDesc).to.not.be.undefined;
      expect(iModelListDesc).to.be.an("array").with.lengthOf(2);
      expect(new Date(iModelListDesc![0].createdDateTime)).to.be.greaterThanOrEqual(new Date(iModelListDesc![1].createdDateTime));
    });

    it("should search iModels by name", async () => {
      const { result: iModelList } = await runCommand<IModel[]>(`imodel list --itwin-id ${testITwinId} --search "1-cli-imodel-integration-test"`);
      expect(iModelList).to.not.be.undefined;
      expect(iModelList).to.be.an("array").with.lengthOf(1);
      expect(iModelList!.some((imodel) => imodel.id === testIModelId1)).to.be.true;
      expect(iModelList!.some((imodel) => imodel.id === testIModelId2)).to.be.false;
    });

    it("should search iModels by description", async () => {
      const { result: iModelList } = await runCommand<IModel[]>(`imodel list --itwin-id ${testITwinId} --search "${testIModelDescription2}"`);
      expect(iModelList).to.not.be.undefined;
      expect(iModelList).to.be.an("array").with.lengthOf(1);
      expect(iModelList!.some((imodel) => imodel.id === testIModelId1)).to.be.false;
      expect(iModelList!.some((imodel) => imodel.id === testIModelId2)).to.be.true;
    });

    it("should filter iModels by state", async () => {
      const { result: iModelListInitialized } = await runCommand<IModel[]>(`imodel list --itwin-id ${testITwinId} --state initialized`);
      expect(iModelListInitialized).to.not.be.undefined;
      expect(iModelListInitialized).to.be.an("array").with.lengthOf(2);
      expect(iModelListInitialized!.some((imodel) => imodel.id === testIModelId1)).to.be.true;
      expect(iModelListInitialized!.some((imodel) => imodel.id === testIModelId2)).to.be.true;

      const { result: iModelListNotInitialized } = await runCommand<IModel[]>(`imodel list --itwin-id ${testITwinId} --state notInitialized`);
      expect(iModelListNotInitialized).to.not.be.undefined;
      expect(iModelListNotInitialized).to.be.an("array").with.lengthOf(0);
    });

    it("should return an error when invalid uuid is provided as --itwin-id", async () => {
      const { error: listError } = await runCommand<IModel[]>(`imodel list --itwin-id an-invalid-uuid"`);
      expect(listError).to.not.be.undefined;
      expect(listError?.message).to.contain("'an-invalid-uuid' is not a valid UUID.");
    });
  });

export default tests;

runSuiteIfMainModule(import.meta, tests);
