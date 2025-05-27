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
import { ITP_TEST_USER_EXTERNAL } from "../../utils/environment";
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
        const { result: deleteResult } = await runCommand(`itwin delete --itwin-id ${iTwinId}`);
        expect(deleteResult).to.have.property('result', 'deleted');
    });

    it('Should invite an external member to an iTwin, accept sent invitation and remove user member', async () => {
        const newRole = await runCommand<Role>(`access-control role create -i ${iTwinId} -n "Test Role 1" -d "Test Role Description"`);
        expect(newRole.result).is.not.undefined;
        expect(newRole.result!.id).is.not.undefined;
        
        const emailToAdd = ITP_TEST_USER_EXTERNAL;

        const invitedUser = await runCommand<membersResponse>(`access-control member user add --itwin-id ${iTwinId} --members "[{"email": "${emailToAdd}", "roleIds": ["${newRole.result!.id}"]}]"`);

        expect(invitedUser.result).to.not.be.undefined;
        expect(invitedUser.result!.invitations.length).to.be.equal(1);
        expect(invitedUser.result!.invitations[0].email.toLowerCase()).to.be.equal(emailToAdd!.toLowerCase());
        expect(invitedUser.result!.invitations[0].roles.length).to.be.equal(1);
        expect(invitedUser.result!.invitations[0].roles[0].id).to.be.equal(newRole.result!.id);

        const invitationLink = await fetchEmailsAndGetInvitationLink(emailToAdd!.split('@')[0], iTwinName);

        await fetch(invitationLink);

        let usersInfo: member[];
        do {
            // eslint-disable-next-line no-await-in-loop
            await new Promise<void>(resolve => {setTimeout(_ => resolve(), 10 * 1000);});
            // eslint-disable-next-line no-await-in-loop
            const listResult = await runCommand<member[]>(`access-control member user list --itwin-id ${iTwinId}`);
            expect(listResult.result).is.not.undefined;
            usersInfo = listResult.result!
        } while (usersInfo.length !== 2);

        await new Promise<void>(resolve => {setTimeout(_ => resolve(), 30 * 1000);});

        const joinedUser = usersInfo.find(user => user.email.toLowerCase() === emailToAdd!.toLowerCase());
        expect(joinedUser).to.not.be.undefined;
        expect(joinedUser?.roles.length).to.be.equal(1);
        expect(joinedUser?.roles[0].id).to.be.equal(newRole.result!.id);

        const deletionResult = await runCommand<{result: string}>(`access-control member user delete --itwin-id ${iTwinId} --member-id ${joinedUser?.id}`);
        expect(deletionResult.result).to.not.be.undefined;
        expect(deletionResult.result!.result).to.be.equal("deleted");
    }).timeout(180 * 1000);

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

    it('Should fail to add iTwin user members, when there are too many role assignments', async () => {
        const members: {email: string, roleIds:string[]}[] = [];
        for(let i = 0; i < 11; i++) {
            members.push({
                email: `email${i}@example.com`,
                roleIds: [
                    crypto.randomUUID(),
                    crypto.randomUUID(),
                    crypto.randomUUID(),
                    crypto.randomUUID(),
                    crypto.randomUUID(),
                ]
            })
        }
        
        const serializedMembersInfo = JSON.stringify(members);

        const result = await runCommand<membersResponse>(`access-control member user add --itwin-id ${iTwinId} --members ${serializedMembersInfo}`);
        expect(result.error).to.not.be.undefined;
        expect(result.error?.message).to.be.equal('A maximum of 50 role assignments can be performed.');
    });

    it('Should fail to update iTwin group, when there are too many roles assigned', async () => { 
        const usersInfo = await runCommand<member[]>(`access-control member user list --itwin-id ${iTwinId}`);
        expect(usersInfo.result).is.not.undefined;
        expect(usersInfo.result!.length).to.be.equal(1);

        let command = `access-control member user update --itwin-id ${iTwinId} --member-id ${usersInfo.result![0].id}`;
        for(let i = 0; i < 51; i++)
            command += ` --role-id role${i}`

        const result = await runCommand<membersResponse>(command);
        expect(result.error).to.not.be.undefined;
        expect(result.error?.message).to.be.equal('A maximum of 50 roles can be assigned.');
    });
};

export default tests;

runSuiteIfMainModule(import.meta, () => describe("Access Control Member User Tests", () => tests()));