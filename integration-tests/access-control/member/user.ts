/*---------------------------------------------------------------------------------------------
* Copyright (c) Bentley Systems, Incorporated. All rights reserved.
* See LICENSE.md in the project root for license terms and full copyright notice.
*--------------------------------------------------------------------------------------------*/

import { ITwin } from "@itwin/itwins-client";
import { runCommand } from "@oclif/test";
import { expect } from "chai";

import { member } from "../../../src/services/access-control-client/models/members";
import { Role } from "../../../src/services/access-control-client/models/role";
import { User } from "../../../src/services/user-client/models/user";

const tests = () => {
    let iTwinId: string;
    
    before(async () => {
        const iTwinName = `cli-itwin-integration-test-${new Date().toISOString()}`;
        const iTwin = await runCommand<ITwin>(`itwin create --class Thing --sub-class Asset --name ${iTwinName}`);
        expect(iTwin.result?.id).is.not.undefined;
        iTwinId = iTwin.result!.id!;
    });

    after(async () => {
        const result = await runCommand(`itwin delete --itwin-id ${iTwinId}`);
        expect(result.stdout).to.contain('deleted');
    });

    it('Should dispaly owner info of an iTwin in member info', async () => {
        const userInfo = await runCommand<User>(`user me`);
        expect(userInfo.result).is.not.undefined;

        const getMemberUserInfo = await runCommand<member>(`access-control member user info --itwin-id ${iTwinId} --member-id ${userInfo.result!.id}`);
        expect(getMemberUserInfo.result).is.not.undefined;
        expect(getMemberUserInfo.result!.id).is.not.undefined;
        expect(getMemberUserInfo.result!.id).to.be.equal(userInfo.result!.id);
    });

    it('Should add new member to an iTwin and update the role', async () => {
        const newRole = await runCommand<Role>(`access-control role create -i ${iTwinId} -n "Test Role" -d "Test Role Description"`);
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