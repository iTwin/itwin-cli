/*---------------------------------------------------------------------------------------------
* Copyright (c) Bentley Systems, Incorporated. All rights reserved.
* See LICENSE.md in the project root for license terms and full copyright notice.
*--------------------------------------------------------------------------------------------*/

import { ITwin } from "@itwin/itwins-client";
import { runCommand } from "@oclif/test";
import { expect } from "chai";

import { Role } from "../../src/services/access-control-client/models/role";

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

    it('Should create and update role info', async () => {
        const roleName = "Test Role";
        const roleDescription = "Test Role Description";

        const roleCreate = await runCommand<Role>(`access-control role create --itwin-id ${iTwinId} --name "${roleName}" --description "${roleDescription}"`);

        expect(roleCreate.result).is.not.undefined;
        expect(roleCreate.result!.id).is.not.undefined;
        expect(roleCreate.result!.displayName).to.be.equal(roleName);
        expect(roleCreate.result!.description).to.be.equal(roleDescription);
        
        const roleInfo = await runCommand<Role>(`access-control role info --itwin-id ${iTwinId} --role-id ${roleCreate.result!.id}`);
        
        expect(roleInfo.result).to.not.be.undefined;

        expect(roleInfo.result?.id).to.be.equal(roleCreate.result!.id);
        expect(roleInfo.result?.displayName).to.be.equal(roleName);
        expect(roleInfo.result?.description).to.be.equal(roleDescription);

        const updatedRoleName = "Updated Role Name";
        const updatedRoleDescription = "Updated Role Description";
        const permissions = ["administration_invite_member"];

        const roleUpdate = await runCommand<Role>(`access-control role update --itwin-id ${iTwinId} --role-id ${roleCreate.result!.id} --name "${updatedRoleName}" --description "${updatedRoleDescription}" --permission ${permissions[0]}`);
        expect(roleUpdate.result).is.not.undefined;
        expect(roleUpdate.result!.id).is.not.undefined;
        expect(roleUpdate.result!.displayName).to.be.equal(updatedRoleName);
        expect(roleUpdate.result!.description).to.be.equal(updatedRoleDescription);
        expect(roleUpdate.result!.permissions).is.not.undefined;
        expect(roleUpdate.result!.permissions).to.include.members(permissions);
    });

    it('Should list roles', async () => {
        const newRole = await runCommand<Role>(`access-control role create --itwin-id ${iTwinId} --name Test2 --description Description2`);
        expect(newRole.result).is.not.undefined;
        expect(newRole.result!.id).is.not.undefined;
        expect(newRole.result!.displayName).to.be.equal("Test2");
        expect(newRole.result!.description).to.be.equal("Description2");

        const listedRoles = await runCommand<Role[]>(`access-control role list --itwin-id ${iTwinId}`);
        expect(listedRoles.result).is.not.undefined;
        expect(listedRoles.result!.length).to.be.greaterThanOrEqual(1);

        expect(listedRoles.result).to.deep.include(newRole.result);
    });

    it('Should delete role', async () => {
        const newRole = await runCommand<Role>(`access-control role create --itwin-id ${iTwinId} --name Test3 --description Description3`);
        expect(newRole.result).is.not.undefined;
        expect(newRole.result!.id).is.not.undefined;

        const deleteRole = await runCommand(`access-control role delete --itwin-id ${iTwinId} --role-id ${newRole.result!.id}`);
        expect(deleteRole.stdout).to.contain('deleted');
    });
};    

export default tests;
