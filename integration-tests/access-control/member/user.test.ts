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
    let roleId1: string;
    let roleId2: string;
    let roleId3: string;
    const iTwinName: string = `cli-itwin-integration-test-${new Date().toISOString()}`;
    
    before(async () => {
        const iTwin = await runCommand<ITwin>(`itwin create --class Thing --sub-class Asset --name ${iTwinName}`);
        expect(iTwin.result?.id).is.not.undefined;
        iTwinId = iTwin.result!.id!;

        const role1 = await runCommand<Role>(`access-control role create -i ${iTwinId} -n "Test Role #1" -d "Test Role Description"`);
        expect(role1.result?.id).is.not.undefined;
        roleId1 = role1.result!.id!;

        const role2 = await runCommand<Role>(`access-control role create -i ${iTwinId} -n "Test Role #2" -d "Test Role Description"`);
        expect(role2.result?.id).is.not.undefined;
        roleId2 = role2.result!.id!;

        const role3 = await runCommand<Role>(`access-control role create -i ${iTwinId} -n "Test Role #3" -d "Test Role Description"`);
        expect(role3.result?.id).is.not.undefined;
        roleId3 = role3.result!.id!;
    });

    after(async () => {
        const { result: deleteResult } = await runCommand(`itwin delete --itwin-id ${iTwinId}`);
        expect(deleteResult).to.have.property('result', 'deleted');
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

    it('Should add a new role to a user.', async () => {
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

    it('Should add multiple users to iTwin using `--group-id` and `--role-ids` flags and delete them', async () => {
        const usersInfo = [
            {
                email: `test-${crypto.randomUUID()}@example.com`,
                roleIds: [roleId1, roleId2]
            },
            {
                email: `test-${crypto.randomUUID()}@example.com`,
                roleIds: [roleId1, roleId3]
            },
            {
                email: `test-${crypto.randomUUID()}@example.com`,
                roleIds: [roleId2, roleId3]
            },
        ];

        const resultCreate = await runCommand<membersResponse>(`access-control member user add --itwin-id ${iTwinId} --email ${usersInfo[0].email} --email ${usersInfo[1].email} --email ${usersInfo[2].email}
            --role-ids ${usersInfo[0].roleIds.join(',')} --role-ids ${usersInfo[1].roleIds.join(',')} --role-ids ${usersInfo[2].roleIds.join(',')}`);
        expect(resultCreate.result).is.not.undefined;
        expect(resultCreate.result!.invitations).to.have.lengthOf(3);
        for (const [i, userInfo] of usersInfo.entries()) {
            expect(resultCreate.result!.invitations[i].email).to.be.equal(userInfo.email);
            expect(resultCreate.result!.invitations[i].roles.map(role => role.id)).to.be.deep.equal(userInfo.roleIds);
        }
    });

    it('Should add multiple users to iTwin using `--group-id` and `--role-ids` (single list) flags and delete them', async () => {
        const roleIds = [roleId1, roleId2];
        const usersInfo = [
            {
                email: `test-${crypto.randomUUID()}@example.com`,
            },
            {
                email: `test-${crypto.randomUUID()}@example.com`,
            },
            {
                email: `test-${crypto.randomUUID()}@example.com`,
            },
        ];

        const resultCreate = await runCommand<membersResponse>(`access-control member user add --itwin-id ${iTwinId} --email ${usersInfo[0].email} --email ${usersInfo[1].email} --email ${usersInfo[2].email} --role-ids ${roleIds.join(',')}`);
        expect(resultCreate.result).is.not.undefined;
        expect(resultCreate.result!.invitations).to.have.lengthOf(3);
        for (const [i, userInfo] of usersInfo.entries()) {
            expect(resultCreate.result!.invitations[i].email).to.be.equal(userInfo.email);
            expect(resultCreate.result!.invitations[i].roles.map(role => role.id)).to.be.deep.equal(roleIds);
        }
    });

    it('Should return an error when all of the following flags are provided: `--members`, `--email`, `--role-ids`', async () => {
        const usersInfo = [
            {
                email: "test1@example.com",
                roleIds: [roleId1, roleId2]
            },
            {
                email: "test2@example.com",
                roleIds: [roleId1, roleId3]
            },
            {
                email: "test3@example.com",
                roleIds: [roleId2, roleId3]
            },
        ];

        const resultCreate = await runCommand<membersResponse>(`access-control member user add --itwin-id ${iTwinId} --members ${JSON.stringify(usersInfo)} --email ${usersInfo[0].email} --email ${usersInfo[1].email} --email ${usersInfo[2].email}
            --role-ids ${usersInfo[0].roleIds.join(',')} --role-ids ${usersInfo[1].roleIds.join(',')} --role-ids ${usersInfo[2].roleIds.join(',')}`);
        expect(resultCreate.error).is.not.undefined;
        expect(resultCreate.error?.message).to.match(new RegExp(`--email=${usersInfo[0].email},${usersInfo[1].email},${usersInfo[2].email} cannot also be provided when using --members`))
    });

    it('Should return an error when none of the following flags are provided: `--members`, `--member`, `--role-ids`', async () => {
        const resultCreate = await runCommand<membersResponse>(`access-control member user add --itwin-id ${iTwinId}`);
        expect(resultCreate.error).is.not.undefined;
        expect(resultCreate.error?.message).to.match(/Exactly one of the following must be provided: --email, --members/);
    });

    it('should return an error when only `--email` flag is provided', async () => {
        const usersInfo = [
            {
                email: "test1@example.com",
            },
            {
                email: "test2@example.com",
            },
            {
                email: "test3@example.com",
            },
        ];

        const resultCreate = await runCommand<membersResponse>(`access-control member user add --itwin-id ${iTwinId} --email ${usersInfo[0].email} --email ${usersInfo[1].email} --email ${usersInfo[2].email}`);
        expect(resultCreate.error).is.not.undefined;
        expect(resultCreate.error?.message).to.match(/All of the following must be provided when using --email: --role-ids/)
    })

    it('should return an error when only `--role-ids` flag is provided', async  () => {
        const usersInfo = [
            {
                roleIds: [roleId1, roleId2]
            },
            {
                roleIds: [roleId1, roleId3]
            },
            {
                roleIds: [roleId2, roleId3]
            },
        ];

        const resultCreate = await runCommand<membersResponse>(`access-control member user add --itwin-id ${iTwinId} --role-ids ${usersInfo[0].roleIds.join(',')} --role-ids ${usersInfo[1].roleIds.join(',')} --role-ids ${usersInfo[2].roleIds.join(',')}`);
        expect(resultCreate.error).is.not.undefined;
        expect(resultCreate.error?.message).to.match(/All of the following must be provided when using --role-ids: --email/)
    });

    it('should return an error when invalid JSON is provided to `--members` flag', async () => {
        const resultCreate = await runCommand<membersResponse>(`access-control member user add --itwin-id ${iTwinId} --members not-a-serialized-json-string`);
        expect(resultCreate.error).is.not.undefined;
        expect(resultCreate.error?.message).to.match(/'not-a-serialized-json-string' is not valid serialized JSON./)
    });

    it('should return an error when there are invalid GUIDs provided to `--role-ids` flag', async () => {
        const usersInfo = [
            {
                email: 'test1@example.com',
                roleIds: [roleId1, roleId2]
            }
        ];

        const resultCreate = await runCommand<membersResponse>(`access-control member user add --itwin-id ${iTwinId} --email ${usersInfo[0].email}
            --role-ids ${usersInfo[0].roleIds.join(',')},some-invalid-guid`);
        expect(resultCreate.error).is.not.undefined;
        expect(resultCreate.error?.message).to.match(new RegExp(`There are invalid GUIDs in '${usersInfo[0].roleIds.join(',')},some-invalid-guid'`))
    });

    it('Should fail to add iTwin user members, when there are too many role assignments', async () => {
        const members: {email: string, roleIds:string[]}[] = [];
        for(let i = 0; i < 11; i++) {
            members.push({
                email: `test1${i}@bentley.m8r.co`,
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