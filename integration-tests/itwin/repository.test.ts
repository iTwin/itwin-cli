/*---------------------------------------------------------------------------------------------
 * Copyright (c) Bentley Systems, Incorporated. All rights reserved.
 * See LICENSE.md in the project root for license terms and full copyright notice.
 *--------------------------------------------------------------------------------------------*/

import { expect } from "chai";

import { Repository } from "@itwin/itwins-client";
import { runCommand } from "@oclif/test";

import { ResultResponse } from "../../src/services/general-models/result-response";
import { createITwin } from "../utils/helpers";
import runSuiteIfMainModule from "../utils/run-suite-if-main-module";

const tests = () =>
  describe("repository", () => {
    let testRepositoryId: string;
    let testITwinId: string;
    let iModelClass: string;
    let iModelSubclass: string;
    let iModelUri: string;

    before(async () => {
      const testITwin = await createITwin(`cli-itwin-integration-test-${new Date().toISOString()}`, "Thing", "Asset");
      testITwinId = testITwin.id as string;
    });

    after(async () => {
      const { result: deleteResult } = await runCommand<ResultResponse>(`itwin delete --itwin-id ${testITwinId}`);
      expect(deleteResult).to.have.property("result", "deleted");
    });

    it("should create a new iTwin repository", async () => {
      iModelClass = "GeographicInformationSystem";
      iModelSubclass = "WebMapService";
      iModelUri = "https://example.com/gis-repo";

      const { result: createdITwinRepository } = await runCommand<Repository>(
        `itwin repository create --itwin-id ${testITwinId} --class ${iModelClass} --sub-class ${iModelSubclass} --uri ${iModelUri}`,
      );

      expect(createdITwinRepository).to.have.property("id");
      expect(createdITwinRepository).to.have.property("class", iModelClass);
      expect(createdITwinRepository).to.have.property("subClass", iModelSubclass);
      expect(createdITwinRepository).to.have.property("uri", iModelUri);

      testRepositoryId = createdITwinRepository!.id!;
    });

    it("should list iTwin repositories for the specified iTwin", async () => {
      const { result: repositories } = await runCommand<Repository[]>(`itwin repository list --itwin-id ${testITwinId}`);

      expect(repositories).to.be.an("array").that.is.not.empty;
      expect(repositories!.some((repository) => repository.id === testRepositoryId)).to.be.true;
    });

    it("should list iTwin repositories for the specified iTwin (class/subclass found)", async () => {
      const { result: repositories } = await runCommand<Repository[]>(
        `itwin repository list -i ${testITwinId} --class ${iModelClass} --sub-class ${iModelSubclass}`,
      );

      expect(repositories).to.be.an("array").that.is.not.empty;
      expect(repositories!.some((repository) => repository.id === testRepositoryId)).to.be.true;
    });

    it("should list iTwin repositories for the specified iTwin (class/subclass not found)", async () => {
      const { result: repositories } = await runCommand<Repository[]>(`itwin repository list -i ${testITwinId} --class ${iModelClass} --sub-class MapServer`);

      expect(repositories).to.be.an("array").that.is.empty;
    });

    it("should delete the iTwin repository", async () => {
      const { result: deleteResult } = await runCommand<ResultResponse>(
        `itwin repository delete --itwin-id ${testITwinId} --repository-id ${testRepositoryId}`,
      );
      expect(deleteResult).to.have.property("result", "deleted");
    });

    it("should return an error when invalid uuid is provided as --itwin-id", async () => {
      const { error: createError } = await runCommand<Repository>(
        `itwin repository create -i an-invalid-uuid --class Construction --uri https://example.com/some/path`,
      );
      expect(createError?.message).to.contain("'an-invalid-uuid' is not a valid UUID.");

      const { error: listError } = await runCommand<Repository>(`itwin repository list -i an-invalid-uuid`);
      expect(listError?.message).to.contain("'an-invalid-uuid' is not a valid UUID.");

      const { error: deleteError } = await runCommand<Repository>(`itwin repository delete -i an-invalid-uuid --repository-id ${crypto.randomUUID()}`);
      expect(deleteError?.message).to.contain("'an-invalid-uuid' is not a valid UUID.");
    });

    it("should return an error when invalid uuid is provided as --repository-id", async () => {
      const { error: deleteError } = await runCommand<Repository>(`itwin repository delete -i ${crypto.randomUUID()} --repository-id an-invalid-uuid`);
      expect(deleteError?.message).to.contain("'an-invalid-uuid' is not a valid UUID.");
    });
  });

export default tests;

runSuiteIfMainModule(import.meta, tests);
