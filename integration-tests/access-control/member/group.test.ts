/*---------------------------------------------------------------------------------------------
* Copyright (c) Bentley Systems, Incorporated. All rights reserved.
* See LICENSE.md in the project root for license terms and full copyright notice.
*--------------------------------------------------------------------------------------------*/

import { ITwin } from "@itwin/itwins-client";
import { runCommand } from "@oclif/test";
import { expect } from "chai";

import { GroupMemberInfo, group } from "../../../src/services/access-control-client/models/group";
import { Role } from "../../../src/services/access-control-client/models/role";
import runSuiteIfMainModule from '../../utils/run-suite-if-main-module';

const tests = () => {
    let iTwinId: string;
    let groupId1: string;
    let groupId2: string;
    let groupId3: string;
    let roleId1: string;
    let roleId2: string;
    let roleId3: string;


    before(async () => {
        const iTwinName = `cli-itwin-integration-test-${new Date().toISOString()}`;
        const iTwin = await runCommand<ITwin>(`itwin create --class Thing --sub-class Asset --name ${iTwinName}`);
        expect(iTwin.result?.id).is.not.undefined;
        iTwinId = iTwin.result!.id!;

        const group1 = await runCommand<group>(`access-control group create --itwin-id ${iTwinId} --name "Test Group #1" --description "Test Group Description"`);
        expect(group1.result?.id).is.not.undefined;
        groupId1 = group1.result!.id!;

        const group2 = await runCommand<group>(`access-control group create --itwin-id ${iTwinId} --name "Test Group #2" --description "Test Group Description"`);
        expect(group2.result?.id).is.not.undefined;
        groupId2 = group2.result!.id!;

        const group3 = await runCommand<group>(`access-control group create --itwin-id ${iTwinId} --name "Test Group #3" --description "Test Group Description"`);
        expect(group3.result?.id).is.not.undefined;
        groupId3 = group3.result!.id!;

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

    it('Should create, update and list info and delete member group', async () => {
        const serializedGroupsInfo = JSON.stringify([
            { 
                groupId: groupId1, 
                roleIds: [roleId1]
            }
        ]);

        const resultCreate = await runCommand<GroupMemberInfo[]>(`access-control member group add --itwin-id ${iTwinId} --groups ${serializedGroupsInfo}`);
        expect(resultCreate.result).is.not.undefined;
        expect(resultCreate.result).to.have.lengthOf(1);
        expect(resultCreate.result![0].id).is.not.undefined;
        expect(resultCreate.result![0].id).to.be.equal(groupId1);
        expect(resultCreate.result![0].roles).is.not.undefined;
        expect(resultCreate.result![0].roles).to.have.lengthOf(1);
        expect(resultCreate.result![0].roles![0].id).to.be.equal(roleId1);

        const resultInfo = await runCommand<GroupMemberInfo>(`access-control member group info --itwin-id ${iTwinId} --group-id ${groupId1}`);
        expect(resultInfo.result).is.not.undefined;
        expect(resultInfo.result!.id).is.not.undefined;
        expect(resultInfo.result!.id).to.be.equal(groupId1);

        const additionalRole = await runCommand<Role>(`access-control role create -i ${iTwinId} -n "One More Test Role" -d "One More Test Role Description"`);
        expect(additionalRole.result).is.not.undefined;
        expect(additionalRole.result!.id).is.not.undefined;

        const resultUpdate = await runCommand<GroupMemberInfo>(`access-control member group update --itwin-id ${iTwinId} --group-id ${groupId1} --role-id ${roleId1} --role-id ${additionalRole.result!.id}`);
        expect(resultUpdate.result).is.not.undefined;
        expect(resultUpdate.result!.id).is.not.undefined;
        expect(resultUpdate.result!.id).to.be.equal(groupId1);
        expect(resultUpdate.result!.roles).is.not.undefined;
        expect(resultUpdate.result!.roles).to.have.lengthOf(2);
        const assignedRoleIds = resultUpdate.result!.roles!.map(role => role.id);
        expect(assignedRoleIds).to.include(roleId1);
        expect(assignedRoleIds).to.include(additionalRole.result!.id);

        const resultList = await runCommand<GroupMemberInfo[]>(`access-control member group list --itwin-id ${iTwinId}`);
        expect(resultList.result).is.not.undefined;
        expect(resultList.result).to.have.lengthOf(1);
        expect(resultList.result![0].id).is.not.undefined;
        expect(resultList.result![0].id).to.be.equal(groupId1);
        expect(resultList.result![0].roles).is.not.undefined;
        expect(resultList.result![0].roles).to.have.lengthOf(2);
        expect(resultList.result![0].roles![0].id).to.be.equal(roleId1);
        expect(resultList.result![0].roles![1].id).to.be.equal(additionalRole.result!.id);

        const resultDelete = await runCommand(`access-control member group delete --itwin-id ${iTwinId} --group-id ${groupId1}`);
        expect(resultDelete.error).to.be.undefined;
        expect(resultDelete.stdout).to.contain('deleted');
    });

    it('Should create multiple member groups using `--groups` flag and delete them', async () => {
        const groupsInfo = [
            {
                groupId: groupId1,
                roleIds: [roleId1, roleId2]
            },
            {
                groupId: groupId2,
                roleIds: [roleId1, roleId3]
            },
            {
                groupId: groupId3,
                roleIds: [roleId2, roleId3]
            },
        ];

        const resultCreate = await runCommand<GroupMemberInfo[]>(`access-control member group add --itwin-id ${iTwinId} --groups ${JSON.stringify(groupsInfo)}`);
        expect(resultCreate.result).is.not.undefined;
        expect(resultCreate.result).to.have.lengthOf(3);
        for (const [i, groupInfo] of groupsInfo.entries()) {
            expect(resultCreate.result![i].id).to.be.equal(groupInfo.groupId);
            expect(resultCreate.result![i].roles.map(role => role.id)).to.be.deep.equal(groupInfo.roleIds);
        }

        const resultDelete1 = await runCommand(`access-control member group delete --itwin-id ${iTwinId} --group-id ${groupId1}`);
        expect(resultDelete1.error).to.be.undefined;
        expect(resultDelete1.stdout).to.contain('deleted');

        const resultDelete2 = await runCommand(`access-control member group delete --itwin-id ${iTwinId} --group-id ${groupId2}`);
        expect(resultDelete2.error).to.be.undefined;
        expect(resultDelete2.stdout).to.contain('deleted');

        const resultDelete3 = await runCommand(`access-control member group delete --itwin-id ${iTwinId} --group-id ${groupId3}`);
        expect(resultDelete3.error).to.be.undefined;
        expect(resultDelete3.stdout).to.contain('deleted');
    });

    it('Should create multiple member groups using `--group-id` and `--role-ids` flags and delete them', async () => {
        const groupIds = [groupId1, groupId2, groupId3];
        const roleIds = [roleId1, roleId2, roleId3];

        const resultCreate = await runCommand<GroupMemberInfo[]>(`access-control member group add --itwin-id ${iTwinId} --group-id ${groupIds[0]} --group-id ${groupIds[1]} --group-id ${groupIds[2]} --role-ids ${roleIds.join(',')}`);
        expect(resultCreate.result).is.not.undefined;
        expect(resultCreate.result).to.have.lengthOf(3);
        for (const memberInfo of resultCreate.result!) {
            expect(groupIds.includes(memberInfo.id)).to.be.true;
            expect(memberInfo.roles.map(role => role.id)).to.be.deep.equal(roleIds);
        }

        const resultDelete1 = await runCommand(`access-control member group delete --itwin-id ${iTwinId} --group-id ${groupIds[0]}`);
        expect(resultDelete1.error).to.be.undefined;
        expect(resultDelete1.stdout).to.contain('deleted');

        const resultDelete2 = await runCommand(`access-control member group delete --itwin-id ${iTwinId} --group-id ${groupIds[1]}`);
        expect(resultDelete2.error).to.be.undefined;
        expect(resultDelete2.stdout).to.contain('deleted');

        const resultDelete3 = await runCommand(`access-control member group delete --itwin-id ${iTwinId} --group-id ${groupIds[2]}`);
        expect(resultDelete3.error).to.be.undefined;
        expect(resultDelete3.stdout).to.contain('deleted');
    });

    it('Should return an error when all of the following flags are provided: `--groups`, `--group-id`, `--role-ids`', async () => {
        const groupsInfo = [
            {
                groupId: groupId1,
                roleIds: [roleId1, roleId2]
            },
            {
                groupId: groupId2,
                roleIds: [roleId1, roleId3]
            },
            {
                groupId: groupId3,
                roleIds: [roleId2, roleId3]
            },
        ];

        const roleIds = [roleId1, roleId2, roleId3];

        const resultCreate = await runCommand<GroupMemberInfo[]>(`access-control member group add --itwin-id ${iTwinId} --groups ${JSON.stringify(groupsInfo)} --group-id ${groupsInfo[0].groupId} --group-id ${groupsInfo[1].groupId} --group-id ${groupsInfo[2].groupId} --role-ids ${roleIds.join(',')}`);
        expect(resultCreate.error).is.not.undefined;
        expect(resultCreate.error?.message).to.match(new RegExp(`--group-id=${groupsInfo[0].groupId},${groupsInfo[1].groupId},${groupsInfo[2].groupId} cannot also be provided when using --groups`))
    });

    it('Should return an error when none of the following flags are provided: `--groups`, `--group-id`, `--role-ids`', async () => {
        const resultCreate = await runCommand<GroupMemberInfo[]>(`access-control member group add --itwin-id ${iTwinId}`);
        expect(resultCreate.error).is.not.undefined;
        expect(resultCreate.error?.message).to.match(/Exactly one of the following must be provided: --group-id, --groups/);
    });

    it('should return an error when only `--group-id` flag is provided', async () => {
        const groupsInfo = [
            {
                groupId: groupId1,
            },
            {
                groupId: groupId2,
            },
            {
                groupId: groupId3,
            },
        ];

        const resultCreate = await runCommand<GroupMemberInfo[]>(`access-control member group add --itwin-id ${iTwinId} --group-id ${groupsInfo[0].groupId} --group-id ${groupsInfo[1].groupId} --group-id ${groupsInfo[2].groupId}`);
        expect(resultCreate.error).is.not.undefined;
        expect(resultCreate.error?.message).to.match(/All of the following must be provided when using --group-id: --role-ids/)
    })

    it('should return an error when only `--role-ids` flag is provided', async  () => {
        const roleIds = [roleId1, roleId2, roleId3];

        const resultCreate = await runCommand<GroupMemberInfo[]>(`access-control member group add --itwin-id ${iTwinId} --role-ids ${roleIds.join(',')}`);
        expect(resultCreate.error).is.not.undefined;
        expect(resultCreate.error?.message).to.match(/All of the following must be provided when using --role-ids: --group-id/)
    });

    it('should return an error when there are invalid GUIDs provided to `--role-ids` flag', async () => {
        const groupsInfo = [
            {
                groupId: groupId1,
                roleIds: [roleId1, roleId2]
            }
        ];

        const resultCreate = await runCommand<GroupMemberInfo[]>(`access-control member group add --itwin-id ${iTwinId} --group-id ${groupsInfo[0].groupId}
            --role-ids ${groupsInfo[0].roleIds.join(',')},some-invalid-guid`);
        expect(resultCreate.error).is.not.undefined;
        expect(resultCreate.error?.message).to.match(new RegExp(`There are invalid GUIDs in '${groupsInfo[0].roleIds.join(',')},some-invalid-guid'`))
    });

    it('Should return an error when there are too many role assignments', async () => {
        const groups: { groupId: string, roleIds: string[] }[] = [];
        for (let i = 0; i < 11; i++) {
            groups.push({
                groupId: crypto.randomUUID(),
                roleIds: [
                    crypto.randomUUID(),
                    crypto.randomUUID(),
                    crypto.randomUUID(),
                    crypto.randomUUID(),
                    crypto.randomUUID(),
                ]
            })
        }

        const serializedGroupsInfo = JSON.stringify(groups);

        const result = await runCommand<GroupMemberInfo[]>(`access-control member group add --itwin-id ${iTwinId} --groups ${serializedGroupsInfo}`);
        expect(result.error).to.not.be.undefined;
        expect(result.error?.message).to.be.equal('A maximum of 50 role assignments can be performed.');
    });

    it('Should return an error when there are too many roles assigned', async () => {
        let command = `access-control member group update --itwin-id ${iTwinId} --group-id ${groupId1}`;

        for (let i = 0; i < 51; i++)
            command += ` --role-id role${i}`

        const result = await runCommand<GroupMemberInfo[]>(command);
        expect(result.error).to.not.be.undefined;
        expect(result.error?.message).to.be.equal('A maximum of 50 roles can be assigned.');
    });
};

export default tests;

runSuiteIfMainModule(import.meta, () => describe("Access Control Member Group Tests", () => tests()));