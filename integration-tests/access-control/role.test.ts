/*---------------------------------------------------------------------------------------------
* Copyright (c) Bentley Systems, Incorporated. All rights reserved.
* See LICENSE.md in the project root for license terms and full copyright notice.
*--------------------------------------------------------------------------------------------*/

import { ITwin } from "@itwin/itwins-client";
import { runCommand } from "@oclif/test";
import { expect } from "chai";

import { Role } from "../../src/services/access-control-client/models/role";
import runSuiteIfMainModule from "../utils/run-suite-if-main-module";

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

  it('Should create and update role info', async () => {
    const roleName = "Test Role";
    const roleDescription = "Test Role Description";

    const { result: roleCreate } = await runCommand<Role>(`access-control role create --itwin-id ${iTwinId} --name "${roleName}" --description "${roleDescription}"`);

    expect(roleCreate).to.not.be.undefined;
    expect(roleCreate!.id).to.not.be.undefined;
    expect(roleCreate!.displayName).to.be.equal(roleName);
    expect(roleCreate!.description).to.be.equal(roleDescription);
        
    const { result: roleInfo } = await runCommand<Role>(`access-control role info --itwin-id ${iTwinId} --role-id ${roleCreate!.id}`);
        
    expect(roleInfo).to.not.be.undefined;

    expect(roleInfo?.id).to.be.equal(roleCreate!.id);
    expect(roleInfo?.displayName).to.be.equal(roleName);
    expect(roleInfo?.description).to.be.equal(roleDescription);

    const updatedRoleName = "Updated Role Name";
    const updatedRoleDescription = "Updated Role Description";
    const permissions = ["administration_invite_member"];

    const { result: roleUpdate } = await runCommand<Role>(`access-control role update --itwin-id ${iTwinId} --role-id ${roleCreate!.id} --name "${updatedRoleName}" --description "${updatedRoleDescription}" --permission ${permissions[0]}`);
    expect(roleUpdate).to.not.be.undefined;
    expect(roleUpdate!.id).to.not.be.undefined;
    expect(roleUpdate!.displayName).to.be.equal(updatedRoleName);
    expect(roleUpdate!.description).to.be.equal(updatedRoleDescription);
    expect(roleUpdate!.permissions).to.not.be.undefined;
    expect(roleUpdate!.permissions).to.include.members(permissions);
  });

  it('Should list roles', async () => {
    const { result: newRole } = await runCommand<Role>(`access-control role create --itwin-id ${iTwinId} --name Test2 --description Description2`);
    expect(newRole).to.not.be.undefined;
    expect(newRole!.id).to.not.be.undefined;
    expect(newRole!.displayName).to.be.equal("Test2");
    expect(newRole!.description).to.be.equal("Description2");

    const { result: listedRoles } = await runCommand<Role[]>(`access-control role list --itwin-id ${iTwinId}`);
    expect(listedRoles).to.not.be.undefined;
    expect(listedRoles!.length).to.be.greaterThanOrEqual(1);

    expect(listedRoles).to.deep.include(newRole);
  });

  it('Should delete role', async () => {
    const { result: newRole } = await runCommand<Role>(`access-control role create --itwin-id ${iTwinId} --name Test3 --description Description3`);
    expect(newRole).to.not.be.undefined;
    expect(newRole!.id).to.not.be.undefined;

    const { result: deleteResult } = await runCommand<{ result: string }>(`access-control role delete --itwin-id ${iTwinId} --role-id ${newRole!.id}`);
    expect(deleteResult).to.have.property('result', 'deleted');
  });
};    

export default tests;

runSuiteIfMainModule(import.meta, () => describe("Access Control Role Tests", () => tests()));