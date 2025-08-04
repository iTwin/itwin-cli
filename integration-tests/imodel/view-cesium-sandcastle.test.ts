/*---------------------------------------------------------------------------------------------
 * Copyright (c) Bentley Systems, Incorporated. All rights reserved.
 * See LICENSE.md in the project root for license terms and full copyright notice.
 *--------------------------------------------------------------------------------------------*/

import { expect } from "chai";

import { IModel } from "@itwin/imodels-client-management";
import { ITwin } from "@itwin/itwins-client";
import { runCommand } from "@oclif/test";

import { ResultResponse } from "../../src/services/general-models/result-response";
import { PopulateResponse } from "../../src/services/synchronization/models/populate-response";
import { createFile, createIModel, createITwin, decodeCompressedBase64, getRootFolderId } from "../utils/helpers";
import runSuiteIfMainModule from "../utils/run-suite-if-main-module";

const tests = () =>
  describe("view cesium-sandcastle", () => {
    const testITwinName = "ITwinCLI_IntegrationTestITwin_viewCesiumSandcastle";
    const testIModelName = "ITwinCLI_IntegrationTestIModel_viewCesiumSandcastle";
    const testFileName = "ExtonCampus.dgn";
    const testFilePath = "examples/datasets/ExtonCampus.dgn";
    let testIModelId: string;
    let testITwinId: string;

    before(async () => {
      const { result: filteredITwins } = await runCommand<ITwin[]>(`itwin list --name ${testITwinName}`);
      expect(filteredITwins).to.not.be.undefined;

      if (filteredITwins!.length === 0) {
        const testITwin = await createITwin(testITwinName, "Thing", "Asset");
        testITwinId = testITwin.id as string;
        const testIModel = await createIModel(testIModelName, testITwinId);
        testIModelId = testIModel.id;

        await runCommand<ResultResponse>(`changed-elements enable --imodel-id ${testIModelId} --itwin-id ${testITwinId}`);

        const rootFolderId = await getRootFolderId(testITwinId);
        await createFile(rootFolderId, testFileName, testFilePath);
        const { result: populateResult } = await runCommand<PopulateResponse>(
          `imodel populate --imodel-id ${testIModelId} --file ${testFilePath} --connector-type MSTN`,
        );
        expect(populateResult).to.have.property("iModelId", testIModelId);
        expect(populateResult).to.have.property("iTwinId", testITwinId);
      } else {
        testITwinId = filteredITwins![0].id!;
        const { result: iModels } = await runCommand<IModel[]>(`imodel list --itwin-id ${testITwinId}`);
        expect(iModels).to.not.be.undefined;
        expect(iModels).to.have.lengthOf(1);
        testIModelId = iModels![0].id;
      }
    });

    it("should not use terrain when no terrain is specified", async () => {
      const { result } = await runCommand<{ url: string }>(`imodel view cesium-sandcastle --imodel-id ${testIModelId}`);
      expect(result).to.not.be.undefined;
      expect(result!.url).to.not.be.undefined;

      const base64String = result!.url.slice("https://sandcastle.cesium.com/#c=".length);
      const dataString = decodeCompressedBase64(base64String);
      const pattern = new RegExp(
        'const viewer = new Cesium.Viewer("cesiumContainer",{})'.replaceAll("(", "\\(").replaceAll(")", "\\)").replaceAll('"', '\\\\"'),
      );
      expect(dataString).to.match(pattern);
    });

    it(`should use cesium world terrain, when '--terrain cesiumWorldTerrain' is provided`, async () => {
      const { result } = await runCommand<{ url: string }>(`imodel view cesium-sandcastle --imodel-id ${testIModelId} --terrain cesiumWorldTerrain`);
      expect(result).to.not.be.undefined;
      expect(result!.url).to.not.be.undefined;

      const base64String = result!.url.slice("https://sandcastle.cesium.com/#c=".length);
      const dataString = decodeCompressedBase64(base64String);
      const pattern = new RegExp(
        'const viewer = new Cesium.Viewer("cesiumContainer",{terrain: Cesium.Terrain.fromWorldTerrain(),})'
          .replaceAll("(", "\\(")
          .replaceAll(")", "\\)")
          .replaceAll('"', '\\\\"'),
      );
      expect(dataString).to.match(pattern);
    });

    it("should return an error when invalid uuid is provided as --imodel-id", async () => {
      const { error } = await runCommand<{ url: string }>(`imodel view cesium-sandcastle -m an-invalid-uuid`);
      expect(error?.message).to.contain("'an-invalid-uuid' is not a valid UUID.");
    });
  });

export default tests;

runSuiteIfMainModule(import.meta, tests);
