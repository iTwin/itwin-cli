/*---------------------------------------------------------------------------------------------
* Copyright (c) Bentley Systems, Incorporated. All rights reserved.
* See LICENSE.md in the project root for license terms and full copyright notice.
*--------------------------------------------------------------------------------------------*/

import { ITwin } from "@itwin/itwins-client";
import { runCommand } from "@oclif/test";
import { expect } from "chai";

import { member, membersResponse } from "../../../src/services/access-control-client/models/members";
import { Role } from "../../../src/services/access-control-client/models/role";
import { nativeLoginToCli } from "../../utils/helpers";
import runSuiteIfMainModule from "../../utils/run-suite-if-main-module";

const tests = () => describe('User', () => {
    let iTwinId: string;
    const iTwinName: string = `cli-itwin-integration-test-${new Date().toISOString()}`;
    
    before(async () => {
        await nativeLoginToCli();
        
        const iTwin = await runCommand<ITwin>(`itwin create --class Thing --sub-class Asset --name ${iTwinName}`);
        expect(iTwin.result?.id, "itwin create result").is.not.undefined;
        iTwinId = iTwin.result!.id!;
    });

    after(async () => {
        const result = await runCommand(`itwin delete --itwin-id ${iTwinId}`);
        expect(result.stdout).to.contain('deleted');
    });

    it('Should add an internal member to an iTwin and remove user member', async () => {
        const newRole = await runCommand<Role>(`access-control role create -i ${iTwinId} -n "Test Role 1" -d "Test Role Description"`);
        expect(newRole.result).is.not.undefined;
        expect(newRole.result!.id).is.not.undefined;
        
        const emailToAdd = 'APIM.Basic.QA-developer@bentley.m8r.co';

        const invitedUser = await runCommand<membersResponse>(`access-control member user add --itwin-id ${iTwinId} --members "[{"email": "${emailToAdd}", "roleIds": ["${newRole.result!.id}"]}]"`);

        expect(invitedUser.result).to.not.be.undefined;
        expect(invitedUser.result!.members.length).to.be.equal(1);
        expect(invitedUser.result!.members[0].email.toLowerCase()).to.be.equal(emailToAdd.toLowerCase());
        expect(invitedUser.result!.members[0].roles.length).to.be.equal(1);
        expect(invitedUser.result!.members[0].roles[0].id).to.be.equal(newRole.result!.id);

        const usersInfo = await runCommand<member[]>(`access-control member user list --itwin-id ${iTwinId}`);
        expect(usersInfo.result).is.not.undefined;
        expect(usersInfo.result!.length).to.be.equal(2);
        const joinedUser = usersInfo.result?.filter(user => user.email.toLowerCase() === emailToAdd.toLowerCase())[0];
        expect(joinedUser).to.not.be.undefined;
        expect(joinedUser?.roles.length).to.be.equal(1);
        expect(joinedUser?.roles[0].id).to.be.equal(newRole.result!.id);

        const deletionResult = await runCommand<{result: string}>(`access-control member user delete --itwin-id ${iTwinId} --member-id ${joinedUser?.id}`);
        expect(deletionResult.result).to.not.be.undefined;
        expect(deletionResult.result!.result).to.be.equal("deleted");
    });
});

export default tests;

runSuiteIfMainModule(import.meta, tests);