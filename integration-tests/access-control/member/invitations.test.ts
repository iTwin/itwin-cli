/*---------------------------------------------------------------------------------------------
* Copyright (c) Bentley Systems, Incorporated. All rights reserved.
* See LICENSE.md in the project root for license terms and full copyright notice.
*--------------------------------------------------------------------------------------------*/

import { ITwin } from "@itwin/itwins-client";
import { runCommand } from "@oclif/test";
import { expect } from "chai";

import { Invitation } from "../../../src/services/access-control-client/models/invitations";
import { OwnerResponse } from "../../../src/services/access-control-client/models/owner";
import { ITP_TEST_USER_EXTERNAL } from "../../utils/environment";
import runSuiteIfMainModule from "../../utils/run-suite-if-main-module";

const tests = () => {
  let iTwinId: string;
    
  before(async () => {
    const iTwinName = `cli-itwin-integration-test-${new Date().toISOString()}`;
    const { result: iTwin } = await runCommand<ITwin>(`itwin create --class Thing --sub-class Asset --name ${iTwinName}`);
    expect(iTwin?.id).to.not.be.undefined;
    iTwinId = iTwin!.id!;
  });

  after(async () => {
    const { result: deleteResult } = await runCommand<{ result: string }>(`itwin delete --itwin-id ${iTwinId}`);
    expect(deleteResult).to.have.property('result', 'deleted');
  });

  it('Should get pending invitations', async () => {
    const emailToAdd = ITP_TEST_USER_EXTERNAL;
    const { result: owner } = await runCommand<OwnerResponse>(`access-control member owner add --itwin-id ${iTwinId} --email ${emailToAdd}`);
    expect(owner).to.not.be.undefined;
    expect(owner!.member).is.null;
    expect(owner!.invitation).to.not.be.undefined;
    expect(owner!.invitation.email.toLowerCase()).to.equal(emailToAdd!.toLowerCase());

    const { result: invitationResults } = await runCommand<Invitation[]>(`access-control member invitations --itwin-id ${iTwinId}`);
    expect(invitationResults).to.not.be.undefined;
    expect(invitationResults!.length).to.be.greaterThanOrEqual(1);
    expect(invitationResults!.some(invitation => invitation.email.toLowerCase() === emailToAdd!.toLowerCase())).to.be.true;
  });
};

export default tests;

runSuiteIfMainModule(import.meta, () => describe("Access Control Member Invitation Tests", () => tests()));