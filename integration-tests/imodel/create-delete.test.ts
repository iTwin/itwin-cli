/*---------------------------------------------------------------------------------------------
 * Copyright (c) Bentley Systems, Incorporated. All rights reserved.
 * See LICENSE.md in the project root for license terms and full copyright notice.
 *--------------------------------------------------------------------------------------------*/

import { expect } from "chai";

import { IModel } from "@itwin/imodels-client-management";
import { runCommand } from "@oclif/test";

import { ResultResponse } from "../../src/services/general-models/result-response";
import { createIModel, createITwin, deleteIModel } from "../utils/helpers";
import runSuiteIfMainModule from "../utils/run-suite-if-main-module";

const tests = () =>
  describe("create + delete", () => {
    const testIModelName = `cli-imodel-integration-test-${new Date().toISOString()}`;
    const testIModelDescription = "Some Description";
    let testITwinId: string;

    before(async () => {
      const testITwin = await createITwin(`cli-itwin-integration-test-${new Date().toISOString()}`, "Thing", "Asset");
      testITwinId = testITwin.id as string;
    });

    after(async () => {
      const { result: deleteResult } = await runCommand<ResultResponse>(`itwin delete --itwin-id ${testITwinId}`);
      expect(deleteResult).to.have.property("result", "deleted");
    });

    it("should create a new iModel (JSON extent)", async () => {
      const extent = {
        northEast: {
          latitude: 46.302_763_954_781_234,
          longitude: 7.835_541_640_797_823,
        },
        southWest: {
          latitude: 46.132_677_028_348_06,
          longitude: 7.672_120_009_938_448,
        },
      };

      const iModelName = `${testIModelName}-create1`;
      const { result: createdIModel } = await runCommand<IModel>(
        `imodel create --itwin-id ${testITwinId} --name "${iModelName}" --description "${testIModelDescription}" --extent "${JSON.stringify(extent)}"`,
      );

      expect(createdIModel).to.not.be.undefined;
      expect(createdIModel!.id).to.not.be.undefined;
      expect(createdIModel).to.have.property("iTwinId", testITwinId);
      expect(createdIModel!.name).to.be.equal(iModelName);
      expect(createdIModel!.description).to.be.equal(testIModelDescription);
      expect(createdIModel!.extent).to.be.deep.equal(extent);
    });

    it("should create a new iModel (seperate flag extent)", async () => {
      const extent = {
        northEast: {
          latitude: 46.302_763_954_781_234,
          longitude: 7.835_541_640_797_823,
        },
        southWest: {
          latitude: 46.132_677_028_348_06,
          longitude: 7.672_120_009_938_448,
        },
      };

      const iModelName = `${testIModelName}-create2`;
      const { result: createdIModel } = await runCommand<IModel>(
        `imodel create --itwin-id ${testITwinId} --name "${iModelName}" --description "${testIModelDescription}" --ne-latitude ${extent.northEast.latitude} --ne-longitude ${extent.northEast.longitude} --sw-latitude ${extent.southWest.latitude} --sw-longitude ${extent.southWest.longitude}`,
      );

      expect(createdIModel).to.not.be.undefined;
      expect(createdIModel!.id).to.not.be.undefined;
      expect(createdIModel).to.have.property("iTwinId", testITwinId);
      expect(createdIModel!.name).to.be.equal(iModelName);
      expect(createdIModel!.description).to.be.equal(testIModelDescription);
      expect(createdIModel!.extent).to.be.deep.equal(extent);
    });

    it("should return an error if user provides extent in both ways", async () => {
      const extent = {
        northEast: {
          latitude: 46.302_763_954_781_234,
          longitude: 7.835_541_640_797_823,
        },
        southWest: {
          latitude: 46.132_677_028_348_06,
          longitude: 7.672_120_009_938_448,
        },
      };

      const iModelName = `${testIModelName}-create2`;
      const { error: createError } = await runCommand<IModel>(
        `imodel create --itwin-id ${testITwinId} --name "${iModelName}" --description "${testIModelDescription}" --extent "${JSON.stringify(extent)}" --ne-latitude ${extent.northEast.latitude} --ne-longitude ${extent.northEast.longitude} --sw-latitude ${extent.southWest.latitude} --sw-longitude ${extent.southWest.longitude}`,
      );

      expect(createError).to.not.be.undefined;
      expect(createError?.message).to.contain("--extent=[object Object] cannot also be provided when using --ne-latitude");
      expect(createError?.message).to.contain("--extent=[object Object] cannot also be provided when using --ne-longitude");
      expect(createError?.message).to.contain("--extent=[object Object] cannot also be provided when using --sw-latitude");
      expect(createError?.message).to.contain("--extent=[object Object] cannot also be provided when using --sw-longitude");
    });

    it("should return an error if user does not provide all extent flags", async () => {
      const extent = {
        northEast: {
          latitude: 46.302_763_954_781_234,
          longitude: 7.835_541_640_797_823,
        },
        southWest: {
          latitude: 46.132_677_028_348_06,
          longitude: 7.672_120_009_938_448,
        },
      };

      const iModelName = `${testIModelName}-create2`;
      const { error: createError } = await runCommand<IModel>(
        `imodel create --itwin-id ${testITwinId} --name "${iModelName}" --description "${testIModelDescription}" --ne-latitude ${extent.northEast.latitude} --ne-longitude ${extent.northEast.longitude} --sw-latitude ${extent.southWest.latitude}`,
      );

      expect(createError).to.not.be.undefined;
      expect(createError?.message).to.contain("All of the following must be provided when using --sw-latitude: --ne-latitude, --ne-longitude, --sw-longitude");
    });

    it("should return an error if a component of the provided extent is not a valid number", async () => {
      const iModelName = `${testIModelName}-create2`;
      const { error: createError } = await runCommand<IModel>(
        `imodel create --itwin-id ${testITwinId} --name "${iModelName}" --description "${testIModelDescription}" --ne-latitude 46.302abc --ne-longitude 7.835 --sw-latitude 46.132 --sw-longitude 7.672`,
      );

      expect(createError).to.not.be.undefined;
      expect(createError?.message).to.contain("46.302abc is not a valid number. Expected format: '1234.56'.");
    });

    it("should return an error if a component of the provided extent is not valid JSON", async () => {
      const iModelName = `${testIModelName}-create2`;
      const { error: createError } = await runCommand<IModel>(
        `imodel create --itwin-id ${testITwinId} --name "${iModelName}" --description "${testIModelDescription}" --extent not-valid-json`,
      );

      expect(createError).to.not.be.undefined;
      expect(createError?.message).to.contain("'not-valid-json' is not valid serialized JSON.");
    });

    it("should return an error if a component of the provided extent is not of valid JSON schema", async () => {
      const extent = {
        northEast: {
          latitude: 46.302_763_954_781_234,
          longitude: "some wrong value",
        },
        southWest: {
          longitude: 7.672_120_009_938_448,
        },
      };

      const iModelName = `${testIModelName}-create2`;
      const { error: createError } = await runCommand<IModel>(
        `imodel create --itwin-id ${testITwinId} --name "${iModelName}" --description "${testIModelDescription}" --extent ${JSON.stringify(extent)}`,
      );

      expect(createError).to.not.be.undefined;
      expect(createError?.message).to.contain("missing required property 'southWest.latitude' of type 'number'");
      expect(createError?.message).to.contain("northEast.longitude: expected type 'number', received 'string'");
    });

    it("should delete the iModel", async () => {
      const iModelName = `${testIModelName}-delete`;
      const createdIModel = await createIModel(iModelName, testITwinId);
      await deleteIModel(createdIModel.id);

      const result = await runCommand(`imodel info -m ${createdIModel.id}`);
      expect(result.error).to.be.not.undefined;
      expect(result.error!.code).to.be.equal("iModelNotFound");
    });

    it("should return an error when invalid uuid is provided as --itwin-id", async () => {
      const { error: createError } = await runCommand<IModel>(`imodel create --itwin-id an-invalid-uuid --name Name --description "${testIModelDescription}"`);
      expect(createError).to.not.be.undefined;
      expect(createError?.message).to.contain("'an-invalid-uuid' is not a valid UUID.");

      const { error: deleteError } = await runCommand<ResultResponse>(`imodel delete --imodel-id an-invalid-uuid`);
      expect(deleteError).to.not.be.undefined;
      expect(deleteError?.message).to.contain("'an-invalid-uuid' is not a valid UUID.");
    });
  });

export default tests;

runSuiteIfMainModule(import.meta, tests);
