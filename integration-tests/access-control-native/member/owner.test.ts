/*---------------------------------------------------------------------------------------------
* Copyright (c) Bentley Systems, Incorporated. All rights reserved.
* See LICENSE.md in the project root for license terms and full copyright notice.
*--------------------------------------------------------------------------------------------*/

import { ITwin } from "@itwin/itwins-client";
import { runCommand } from "@oclif/test";
import { expect } from "chai";

import { groupMember } from "../../../src/services/access-control-client/models/group-members.js";
import { ownerResponse } from "../../../src/services/access-control-client/models/owner.js";
import { ITP_TEST_USER_SAMEORG } from "../../utils/environment.js";
import { nativeLoginToCli } from "../../utils/helpers.js";
import runSuiteIfMainModule from "../../utils/run-suite-if-main-module.js";

const tests = () => describe('owner', () => {
    let iTwinId: string;
    const iTwinName: string = `cli-itwin-integration-test-${new Date().toISOString()}`;
    
    before(async () => {
        await nativeLoginToCli();

        const iTwin = await runCommand<ITwin>(`itwin create --class Thing --sub-class Asset --name ${iTwinName}`);
        expect(iTwin.result?.id).is.not.undefined;
        iTwinId = iTwin.result!.id!;
    });

    after(async () => {
        const { result: deleteResult } = await runCommand(`itwin delete --itwin-id ${iTwinId}`);
        expect(deleteResult).to.have.property('result', 'deleted');
    });

    it('Should add an internal member to an iTwin and remove owner member', async () => {
        const emailToAdd = ITP_TEST_USER_SAMEORG;

        const invitedUser = await runCommand<ownerResponse>(`access-control member owner add --itwin-id ${iTwinId} --email ${emailToAdd}`);

        expect(invitedUser.result).to.not.be.undefined;
        expect(invitedUser.result!.member).to.not.be.undefined;
        expect(invitedUser.result!.member.email.toLowerCase()).to.be.equal(emailToAdd!.toLowerCase());

        const usersInfo = await runCommand<groupMember[]>(`access-control member owner list --itwin-id ${iTwinId}`);
        expect(usersInfo.result).is.not.undefined;
        expect(usersInfo.result).to.have.lengthOf(2);
        const joinedUser = usersInfo.result?.filter(user => user.email.toLowerCase() === emailToAdd!.toLowerCase())[0];
        expect(joinedUser).to.not.be.undefined;

        const deletionResult = await runCommand<{result: string}>(`access-control member owner delete --itwin-id ${iTwinId} --member-id ${joinedUser?.id}`);
        expect(deletionResult.result).to.not.be.undefined;
        expect(deletionResult.result!.result).to.be.equal("deleted");
    });
});

export default tests;

runSuiteIfMainModule(import.meta, tests);