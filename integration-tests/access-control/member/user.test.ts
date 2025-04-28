/*---------------------------------------------------------------------------------------------
* Copyright (c) Bentley Systems, Incorporated. All rights reserved.
* See LICENSE.md in the project root for license terms and full copyright notice.
*--------------------------------------------------------------------------------------------*/

import { ITwin } from "@itwin/itwins-client";
import { runCommand } from "@oclif/test";
import { expect } from "chai";

import { member, membersResponse } from "../../../src/services/access-control-client/models/members";
import { Role } from "../../../src/services/access-control-client/models/role";
import { User } from "../../../src/services/user-client/models/user";
import { fetchEmailsAndGetInvitationLink } from "../../utils/helpers";
import runSuiteIfMainModule from "../../utils/run-suite-if-main-module";

const tests = () => {
    let iTwinId: string;
    const iTwinName: string = `cli-itwin-integration-test-${new Date().toISOString()}`;
    
    before(async () => {
        const iTwin = await runCommand<ITwin>(`itwin create --class Thing --sub-class Asset --name ${iTwinName}`);
        expect(iTwin.result?.id).is.not.undefined;
        iTwinId = iTwin.result!.id!;
    });

    after(async () => {
        const result = await runCommand(`itwin delete --itwin-id ${iTwinId}`);
        expect(result.stdout).to.contain('deleted');
    });

    it('Should invite an external member to an iTwin, accept sent invitation and remove user member', async () => {
        const newRole = await runCommand<Role>(`access-control role create -i ${iTwinId} -n "Test Role 1" -d "Test Role Description"`);
        expect(newRole.result).is.not.undefined;
        expect(newRole.result!.id).is.not.undefined;
        
        const emailToAdd = 'APIM.OrgTest.Unassigned.QA@bentley.m8r.co';

        const invitedUser = await runCommand<membersResponse>(`access-control member user add --itwin-id ${iTwinId} --members "[{"email": "${emailToAdd}", "roleIds": ["${newRole.result!.id}"]}]"`);

        expect(invitedUser.result).to.not.be.undefined;
        expect(invitedUser.result!.invitations.length).to.be.equal(1);
        expect(invitedUser.result!.invitations[0].email.toLowerCase()).to.be.equal(emailToAdd.toLowerCase());
        expect(invitedUser.result!.invitations[0].roles.length).to.be.equal(1);
        expect(invitedUser.result!.invitations[0].roles[0].id).to.be.equal(newRole.result!.id);

        const invitationLink = await fetchEmailsAndGetInvitationLink(emailToAdd.split('@')[0], iTwinName);

        await fetch(invitationLink);

        await new Promise<void>(resolve => {setTimeout(_ => resolve(), 30 * 1000);});

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
    }).timeout(120 * 1000);

    it('Should display owner info of an iTwin in member info', async () => {
        const userInfo = await runCommand<User>(`user me`);
        expect(userInfo.result).is.not.undefined;

        const getMemberUserInfo = await runCommand<member>(`access-control member user info --itwin-id ${iTwinId} --member-id ${userInfo.result!.id}`);
        expect(getMemberUserInfo.result).is.not.undefined;
        expect(getMemberUserInfo.result!.id).is.not.undefined;
        expect(getMemberUserInfo.result!.id).to.be.equal(userInfo.result!.id);
    });

    it('Should add new member to an iTwin and update the role', async () => {
        const newRole = await runCommand<Role>(`access-control role create -i ${iTwinId} -n "Test Role 2" -d "Test Role Description"`);
        expect(newRole.result).is.not.undefined;
        expect(newRole.result!.id).is.not.undefined;

        const usersInfo = await runCommand<member[]>(`access-control member user list --itwin-id ${iTwinId}`);
        expect(usersInfo.result).is.not.undefined;
        expect(usersInfo.result!.length).to.be.equal(1);
        expect(usersInfo.result![0].roles.length).to.be.equal(1);

        const updateMemberResult = await runCommand<member>(`access-control member user update --itwin-id ${iTwinId} --member-id ${usersInfo.result![0].id} --role-id ${usersInfo.result![0].roles[0].id} --role-id ${newRole.result!.id}`);
        expect(updateMemberResult.result).is.not.undefined;
        expect(updateMemberResult.result!.roles.length).to.be.equal(2);
        expect(updateMemberResult.result!.roles.some(role => role.id === newRole.result!.id)).to.be.true;
        expect(updateMemberResult.result!.roles.some(role => role.id === usersInfo.result![0].roles[0].id)).to.be.true;
    });

};

export default tests;

runSuiteIfMainModule(import.meta, () => describe("Access Control Member User Tests", () => tests()));