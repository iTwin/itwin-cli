/*---------------------------------------------------------------------------------------------
* Copyright (c) Bentley Systems, Incorporated. All rights reserved.
* See LICENSE.md in the project root for license terms and full copyright notice.
*--------------------------------------------------------------------------------------------*/

import { ITwin } from "@itwin/itwins-client";
import { runCommand } from "@oclif/test";
import { expect } from "chai";

import { GroupMemberInfo, group } from "../../../src/services/access-control-client/models/group";
import { Role } from "../../../src/services/access-control-client/models/role";

const tests = () => {
    let iTwinId: string;
    let groupId: string;
    let roleId: string;
    
    before(async () => {
        const iTwinName = `cli-itwin-integration-test-${new Date().toISOString()}`;
        const iTwin = await runCommand<ITwin>(`itwin create --class Thing --sub-class Asset --display-name ${iTwinName}`);
        expect(iTwin.result?.id).is.not.undefined;
        iTwinId = iTwin.result!.id!;

        const group = await runCommand<group>(`access-control group create --itwin-id ${iTwinId} --name "Test Group" --description "Test Group Description"`);
        expect(group.result?.id).is.not.undefined;
        groupId = group.result!.id!;

        const role = await runCommand<Role>(`access-control role create --itwin-id ${iTwinId} --display-name "Test Role" --description "Test Role Description"`);
        expect(role.result?.id).is.not.undefined;
        roleId = role.result!.id!;
    });

    after(async () => {
        const result = await runCommand(`itwin delete --itwin-id ${iTwinId}`);
        expect(result.stdout).to.contain('deleted');
    });

    it('Should create, update and list info and delete member group', async () => {
        const serializedGroupsInfo = JSON.stringify([
            { 
                groupId, 
                roleIds: [roleId]
            }
        ]);

        const resultCreate = await runCommand<GroupMemberInfo[]>(`access-control member group add --itwin-id ${iTwinId} --groups ${serializedGroupsInfo}`);
        expect(resultCreate.result).is.not.undefined;
        expect(resultCreate.result).to.have.lengthOf(1);
        expect(resultCreate.result![0].id).is.not.undefined;
        expect(resultCreate.result![0].id).to.be.equal(groupId);
        expect(resultCreate.result![0].roles).is.not.undefined;
        expect(resultCreate.result![0].roles).to.have.lengthOf(1);
        expect(resultCreate.result![0].roles![0].id).to.be.equal(roleId);

        const resultInfo = await runCommand<GroupMemberInfo>(`access-control member group info --itwin-id ${iTwinId} --group-id ${groupId}`);
        expect(resultInfo.result).is.not.undefined;
        expect(resultInfo.result!.id).is.not.undefined;
        expect(resultInfo.result!.id).to.be.equal(groupId);

        const additionalRole = await runCommand<Role>(`access-control role create --itwin-id ${iTwinId} --display-name "One More Test Role" --description "One More Test Role Description"`);
        expect(additionalRole.result).is.not.undefined;
        expect(additionalRole.result!.id).is.not.undefined;

        const resultUpdate = await runCommand<GroupMemberInfo>(`access-control member group update --itwin-id ${iTwinId} --group-id ${groupId} --role-ids ${roleId} --role-ids ${additionalRole.result!.id}`);
        expect(resultUpdate.result).is.not.undefined;
        expect(resultUpdate.result!.id).is.not.undefined;
        expect(resultUpdate.result!.id).to.be.equal(groupId);
        expect(resultUpdate.result!.roles).is.not.undefined;
        expect(resultUpdate.result!.roles).to.have.lengthOf(2);
        const assignedRoleIds = resultUpdate.result!.roles!.map(role => role.id);
        expect(assignedRoleIds).to.include(roleId);
        expect(assignedRoleIds).to.include(additionalRole.result!.id);

        const resultList = await runCommand<GroupMemberInfo[]>(`access-control member group list --itwin-id ${iTwinId}`);
        expect(resultList.result).is.not.undefined;
        expect(resultList.result).to.have.lengthOf(1);
        expect(resultList.result![0].id).is.not.undefined;
        expect(resultList.result![0].id).to.be.equal(groupId);
        expect(resultList.result![0].roles).is.not.undefined;
        expect(resultList.result![0].roles).to.have.lengthOf(2);
        expect(resultList.result![0].roles![0].id).to.be.equal(roleId);
        expect(resultList.result![0].roles![1].id).to.be.equal(additionalRole.result!.id);

        const resultDelete = await runCommand(`access-control member group delete --itwin-id ${iTwinId} --group-id ${groupId}`);
        expect(resultDelete.error).to.be.undefined;
        expect(resultDelete.stdout).to.contain('deleted');
    });
};

export default tests;