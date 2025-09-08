/*---------------------------------------------------------------------------------------------
 * Copyright (c) Bentley Systems, Incorporated. All rights reserved.
 * See LICENSE.md in the project root for license terms and full copyright notice.
 *--------------------------------------------------------------------------------------------*/

import { expect } from "chai";

import { runCommand } from "@oclif/test";

import { ItwinShare } from "../../src/services/access-control/models/itwin-share.js";
import { ResultResponse } from "../../src/services/general-models/result-response.js";
import { createITwin } from "../utils/helpers";
import runSuiteIfMainModule from "../utils/run-suite-if-main-module";

function assertItwinShare(share?: ItwinShare): ItwinShare {
  expect(share).to.be.instanceOf(Object);
  expect(share).to.have.property("id");
  expect(share).to.have.property("iTwinId");
  expect(share).to.have.property("shareKey");
  expect(share).to.have.property("shareContract");
  expect(share).to.have.property("expiration");
  expect(share!.shareContract).equals("Default");
  expect(share!.expiration).match(/\d{4}-[01]\d-[0-3]\dT[0-2]\d:[0-5]\d:[0-5]\d\.\d+([+-][0-2]\d:[0-5]\d|Z)/);
  return share!;
}

const tests = () =>
  describe("share", () => {
    let testITwinId: string;
    let shareId: string;

    before(async () => {
      const testITwin = await createITwin(`cli-itwin-integration-test-${new Date().toISOString()}`, "Thing", "Asset");
      testITwinId = testITwin.id as string;

      // Create iTwin Share
      const { result: iTwinShare, error } = await runCommand<ItwinShare>(`itwin share create --itwin-id ${testITwinId}`);
      expect(error).to.be.undefined;
      const share = assertItwinShare(iTwinShare);
      shareId = share.id;
    });

    after(async () => {
      const { result: deleteResult } = await runCommand<ResultResponse>(`itwin delete --itwin-id ${testITwinId}`);
      expect(deleteResult).to.have.property("result", "deleted");
    });

    it("should get specific iTwin share info", async () => {
      const { result: iTwinShare, error } = await runCommand<ItwinShare>(`itwin share info --itwin-id ${testITwinId} --share-id ${shareId}`);
      expect(error).to.be.undefined;
      assertItwinShare(iTwinShare);
    });

    it("should get a list of iTwin shares", async () => {
      const { result: iTwinShares, error } = await runCommand<ItwinShare[]>(`itwin share list --itwin-id ${testITwinId}`);
      expect(error).to.be.undefined;
      expect(iTwinShares).to.be.instanceOf(Array);
      expect(iTwinShares).to.have.lengthOf(1);
      assertItwinShare(iTwinShares![0]);
    });

    it("should return error if share does not exist", async () => {
      const invalidShareId = "bf4d8b36-25d7-4b72-b38b-12c1f0325f42";
      const { result: iTwinShare, error } = await runCommand<ResultResponse>(`itwin share revoke --itwin-id ${testITwinId} --share-id ${invalidShareId}`);
      expect(iTwinShare).to.be.undefined;
      expect(error?.message).to.contain("ShareNotFound");
    });

    it("should create and revoke iTwin share", async () => {
      // Create iTwin Share
      const { result: iTwinShare, error: createError } = await runCommand<ItwinShare>(`itwin share create --itwin-id ${testITwinId}`);
      expect(createError).to.be.undefined;
      const share = assertItwinShare(iTwinShare);

      // Revoke iTwin share
      const { result: revokeResult, error: revokeError } = await runCommand<ResultResponse>(
        `itwin share revoke --itwin-id ${testITwinId} --share-id ${share.id}`,
      );
      expect(revokeError).to.be.undefined;
      expect(revokeResult).to.have.property("result", "revoked");

      // Verify the share has been revoked
      const { result: getResult, error: getError } = await runCommand<ResultResponse>(`itwin share info --itwin-id ${testITwinId} --share-id ${share.id}`);
      expect(getResult).to.be.undefined;
      expect(getError?.message).to.contain("ShareNotFound");
    });

    it("should not create iTwin share with too long expiration period", async () => {
      const { result: iTwinShare, error } = await runCommand<ItwinShare>(`itwin share create --itwin-id ${testITwinId} --expiration 2100-01-01`);
      expect(iTwinShare).to.be.undefined;
      expect(error?.message).to.contain("InvalidShareRequest");
      expect(error?.message).to.contain("Value outside of valid range.");
    });

    it("should not create iTwin share with non-existing contract name", async () => {
      const { result: iTwinShare, error } = await runCommand<ItwinShare>(`itwin share create --itwin-id ${testITwinId} --contract InvalidContractName`);
      expect(iTwinShare).to.be.undefined;
      expect(error?.message).to.contain("ShareContractNotFound");
      expect(error?.message).to.contain("Requested share contract is not available.");
    });
  });

export default tests;

runSuiteIfMainModule(import.meta, tests);
