/*---------------------------------------------------------------------------------------------
 * Copyright (c) Bentley Systems, Incorporated. All rights reserved.
 * See LICENSE.md in the project root for license terms and full copyright notice.
 *--------------------------------------------------------------------------------------------*/

import { expect } from "chai";

import { NamedVersion } from "@itwin/imodels-client-management";
import { runCommand } from "@oclif/test";

import { Changeset } from "../../src/services/changed-elements/tracking";
import { ResultResponse } from "../../src/services/general-models/result-response";
import { PopulateResponse } from "../../src/services/synchronization/models/populate-response";
import { createIModel, createITwin } from "../utils/helpers";
import runSuiteIfMainModule from "../utils/run-suite-if-main-module";

const tests = () =>
  describe("named-version", () => {
    const testITwinName = "ITwinCLI_IntegrationTestITwin_iModelNamedVersion";
    const testIModelName = "ITwinCLI_IntegrationTestIModel_iModelNamedVersion";
    const testFilePath = "examples/datasets/ExtonCampus.dgn";
    let testIModelId: string;
    let testITwinId: string;

    before(async function () {
      this.timeout(30 * 60 * 1000);

      const testITwin = await createITwin(testITwinName, "Thing", "Asset");
      testITwinId = testITwin.id as string;
      const testIModel = await createIModel(testIModelName, testITwinId);
      testIModelId = testIModel.id;

      await runCommand<ResultResponse>(`changed-elements enable --imodel-id ${testIModelId} --itwin-id ${testITwinId}`);

      const { result } = await runCommand<PopulateResponse>(`imodel populate --imodel-id ${testIModelId} --file ${testFilePath} --connector-type MSTN`);
      expect(result).to.have.property("iModelId", testIModelId);
      expect(result).to.have.property("iTwinId", testITwinId);
    });

    after(async () => {
      const { result: imodelDeleteResult } = await runCommand<ResultResponse>(`imodel delete --imodel-id ${testIModelId}`);
      const { result: itwinDeleteResult } = await runCommand<ResultResponse>(`itwin delete --itwin-id ${testITwinId}`);

      expect(imodelDeleteResult).to.have.property("result", "deleted");
      expect(itwinDeleteResult).to.have.property("result", "deleted");
    });

    it("should create a new named version with specified changeset and get it.", async () => {
      const { result: changesets } = await runCommand<Changeset[]>(`changed-elements changesets --imodel-id ${testIModelId} --itwin-id ${testITwinId}`);
      expect(changesets).to.not.be.undefined;
      expect(changesets).to.have.lengthOf(15);

      const { result: createResult } = await runCommand<NamedVersion>(
        `imodel named-version create --imodel-id ${testIModelId} --changeset-id ${changesets![0].id} -n "Version 1.0" -d "Some description of the version"`,
      );
      expect(createResult).to.not.be.undefined;
      expect(createResult?.displayName).to.be.equal("Version 1.0");
      expect(createResult?.description).to.be.equal("Some description of the version");

      const { result: infoResult } = await runCommand<NamedVersion>(
        `imodel named-version info --imodel-id ${testIModelId} --named-version-id ${createResult?.id}`,
      );
      expect(infoResult).to.not.be.undefined;
      expect(infoResult?.displayName).to.be.equal("Version 1.0");
      expect(infoResult?.description).to.be.equal("Some description of the version");
    });

    it("should create a new named version with latest changeset", async () => {
      const { result: createResult } = await runCommand<NamedVersion>(
        `imodel named-version create --imodel-id ${testIModelId} -n "Version 2.0" -d "Some other description of the version"`,
      );
      expect(createResult).to.not.be.undefined;
      expect(createResult?.displayName).to.be.equal("Version 2.0");
      expect(createResult?.description).to.be.equal("Some other description of the version");
    });

    it("should filter named versions by name", async () => {
      const { result: listResult } = await runCommand<NamedVersion[]>(`imodel named-version list --imodel-id ${testIModelId} --name "Version 1.0"`);
      expect(listResult).to.not.be.undefined;
      expect(listResult).to.be.an("array").with.lengthOf(1);
      expect(listResult![0].displayName).to.be.equal("Version 1.0");
      expect(listResult![0].description).to.be.equal("Some description of the version");
    });

    it("should order named versions.", async () => {
      const { result: listResultByDateAsc } = await runCommand<NamedVersion[]>(
        `imodel named-version list --imodel-id ${testIModelId} --order-by "createdDateTime asc"`,
      );
      expect(listResultByDateAsc).to.not.be.undefined;
      expect(listResultByDateAsc).to.be.an("array").with.lengthOf(2);
      expect(new Date(listResultByDateAsc![1].createdDateTime)).to.be.greaterThan(new Date(listResultByDateAsc![0].createdDateTime));

      const { result: listResultByDateDesc } = await runCommand<NamedVersion[]>(
        `imodel named-version list --imodel-id ${testIModelId} --order-by "createdDateTime desc"`,
      );
      expect(listResultByDateDesc).to.not.be.undefined;
      expect(listResultByDateDesc).to.be.an("array").with.lengthOf(2);
      expect(new Date(listResultByDateDesc![0].createdDateTime)).to.be.greaterThan(new Date(listResultByDateDesc![1].createdDateTime));

      const { result: listResultByIndexAsc } = await runCommand<NamedVersion[]>(
        `imodel named-version list --imodel-id ${testIModelId} --order-by "changesetIndex asc"`,
      );
      expect(listResultByIndexAsc).to.not.be.undefined;
      expect(listResultByIndexAsc).to.be.an("array").with.lengthOf(2);
      expect(listResultByIndexAsc![1].changesetIndex).to.be.greaterThan(listResultByIndexAsc![0].changesetIndex);

      const { result: listResultByIndexDesc } = await runCommand<NamedVersion[]>(
        `imodel named-version list --imodel-id ${testIModelId} --order-by "changesetIndex desc"`,
      );
      expect(listResultByIndexDesc).to.not.be.undefined;
      expect(listResultByIndexDesc).to.be.an("array").with.lengthOf(2);
      expect(listResultByIndexDesc![0].changesetIndex).to.be.greaterThan(listResultByIndexDesc![1].changesetIndex);
    });

    it("should search named versions by name or description", async () => {
      const { result: listResult1 } = await runCommand<NamedVersion[]>(`imodel named-version list --imodel-id ${testIModelId} --search "Version 1.0"`);
      expect(listResult1).to.not.be.undefined;
      expect(listResult1).to.be.an("array").with.lengthOf(1);
      expect(listResult1![0].displayName).to.be.equal("Version 1.0");
      expect(listResult1![0].description).to.be.equal("Some description of the version");

      const { result: listResult2 } = await runCommand<NamedVersion[]>(
        `imodel named-version list --imodel-id ${testIModelId} --search "Some other description"`,
      );
      expect(listResult2).to.not.be.undefined;
      expect(listResult2).to.be.an("array").with.lengthOf(1);
      expect(listResult2![0].displayName).to.be.equal("Version 2.0");
      expect(listResult2![0].description).to.be.equal("Some other description of the version");
    });

    it("should skip/take specified number of named versions", async () => {
      const { result: listResult1 } = await runCommand<NamedVersion[]>(
        `imodel named-version list --imodel-id ${testIModelId} --order-by "createdDateTime asc" --skip 0 --top 1`,
      );
      expect(listResult1).to.not.be.undefined;
      expect(listResult1).to.be.an("array").with.lengthOf(1);
      expect(listResult1![0].displayName).to.be.equal("Version 1.0");
      expect(listResult1![0].description).to.be.equal("Some description of the version");

      const { result: listResult2 } = await runCommand<NamedVersion[]>(
        `imodel named-version list --imodel-id ${testIModelId} --order-by "createdDateTime asc" --skip 1 --top 1`,
      );
      expect(listResult2).to.not.be.undefined;
      expect(listResult2).to.be.an("array").with.lengthOf(1);
      expect(listResult2![0].displayName).to.be.equal("Version 2.0");
      expect(listResult2![0].description).to.be.equal("Some other description of the version");
    });

    it("should return an error when invalid uuid is provided as --imodel-id", async () => {
      const { error: createError } = await runCommand<NamedVersion>(`imodel named-version create -m an-invalid-uuid -n Name`);
      expect(createError?.message).to.contain("'an-invalid-uuid' is not a valid UUID.");

      const { error: infoError } = await runCommand<NamedVersion>(`imodel named-version info -m an-invalid-uuid --named-version-id ${crypto.randomUUID()}`);
      expect(infoError?.message).to.contain("'an-invalid-uuid' is not a valid UUID.");

      const { error: listError } = await runCommand<NamedVersion>(`imodel named-version list -m an-invalid-uuid`);
      expect(listError?.message).to.contain("'an-invalid-uuid' is not a valid UUID.");
    });

    it("should return an error when invalid uuid is provided as --named-version-id", async () => {
      const { error: infoError } = await runCommand<NamedVersion>(`imodel named-version info -m ${crypto.randomUUID()} --named-version-id an-invalid-uuid`);
      expect(infoError?.message).to.contain("'an-invalid-uuid' is not a valid UUID.");
    });

    it("should return an error when invalid --order-by flag value is provided", async () => {
      const { error: listError } = await runCommand<NamedVersion[]>(`imodel named-version list --imodel-id ${testIModelId} --order-by "changsetIndex asc"`);
      expect(listError).to.not.be.undefined;
      expect(listError?.message).to.contain(
        "Expected --order-by=changsetIndex asc to be one of: changesetIndex desc, changesetIndex asc, createdDateTime desc, createdDateTime asc",
      );
    });
  });

export default tests;

runSuiteIfMainModule(import.meta, tests);
