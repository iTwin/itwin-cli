/*---------------------------------------------------------------------------------------------
* Copyright (c) Bentley Systems, Incorporated. All rights reserved.
* See LICENSE.md in the project root for license terms and full copyright notice.
*--------------------------------------------------------------------------------------------*/

import { ITwin } from "@itwin/itwins-client";
import { runCommand } from "@oclif/test";
import { expect } from "chai";

import { Member, MembersResponse } from "../../../src/services/access-control-client/models/members";
import { Role } from "../../../src/services/access-control-client/models/role";
import { User } from "../../../src/services/user-client/models/user";
import { ITP_TEST_USER_EXTERNAL } from "../../utils/environment";
import { fetchEmailsAndGetInvitationLink } from "../../utils/helpers";
import runSuiteIfMainModule from "../../utils/run-suite-if-main-module";

const tests = () => {
  let iTwinId: string;
  let roleId1: string;
  let roleId2: string;
  let roleId3: string;
  const iTwinName: string = `cli-itwin-integration-test-${new Date().toISOString()}`;
    
  before(async () => {
    const { result: iTwin } = await runCommand<ITwin>(`itwin create --class Thing --sub-class Asset --name ${iTwinName}`);
    expect(iTwin?.id).to.not.be.undefined;
    iTwinId = iTwin!.id!;

    const { result: role1 } = await runCommand<Role>(`access-control role create -i ${iTwinId} -n "Test Role #1" -d "Test Role Description"`);
    expect(role1?.id).to.not.be.undefined;
    roleId1 = role1!.id!;

    const { result: role2 } = await runCommand<Role>(`access-control role create -i ${iTwinId} -n "Test Role #2" -d "Test Role Description"`);
    expect(role2?.id).to.not.be.undefined;
    roleId2 = role2!.id!;

    const { result: role3 } = await runCommand<Role>(`access-control role create -i ${iTwinId} -n "Test Role #3" -d "Test Role Description"`);
    expect(role3?.id).to.not.be.undefined;
    roleId3 = role3!.id!;
  });

  after(async () => {
    const { result: deleteResult } = await runCommand<{ result: string }>(`itwin delete --itwin-id ${iTwinId}`);
    expect(deleteResult).to.have.property('result', 'deleted');
  });

  it('Should invite an external member to an iTwin, accept sent invitation and remove user member', async () => {
    const { result: newRole } = await runCommand<Role>(`access-control role create -i ${iTwinId} -n "Test Role 1" -d "Test Role Description"`);
    expect(newRole).to.not.be.undefined;
    expect(newRole!.id).to.not.be.undefined;
        
    const emailToAdd = ITP_TEST_USER_EXTERNAL;

    const { result: invitedUser } = await runCommand<MembersResponse>(`access-control member user add --itwin-id ${iTwinId} --members "[{"email": "${emailToAdd}", "roleIds": ["${newRole!.id}"]}]"`);

    expect(invitedUser).to.not.be.undefined;
    expect(invitedUser!.invitations).to.have.lengthOf(1);
    expect(invitedUser!.invitations[0].email.toLowerCase()).to.be.equal(emailToAdd!.toLowerCase());
    expect(invitedUser!.invitations[0].roles).to.have.lengthOf(1);
    expect(invitedUser!.invitations[0].roles[0].id).to.be.equal(newRole!.id);

    const invitationLink = await fetchEmailsAndGetInvitationLink(emailToAdd!.split('@')[0], iTwinName);

    await fetch(invitationLink);

    let usersInfo: Member[];
    do {             
      await new Promise<void>(resolve => { setTimeout(_ => resolve(), 10 * 1000); });    
      
      const listResult = await runCommand<Member[]>(`access-control member user list --itwin-id ${iTwinId}`);
      expect(listResult.result).to.not.be.undefined;
      usersInfo = listResult.result!;
    } while (usersInfo.length !== 2);

    await new Promise<void>(resolve => { setTimeout(_ => resolve(), 30 * 1000); });

    const joinedUser = usersInfo.find(user => user.email.toLowerCase() === emailToAdd!.toLowerCase());
    expect(joinedUser).to.not.be.undefined;
    expect(joinedUser?.roles).to.have.lengthOf(1);
    expect(joinedUser?.roles[0].id).to.be.equal(newRole!.id);

    const { result: deleteResult } = await runCommand<{ result: string }>(`access-control member user delete --itwin-id ${iTwinId} --member-id ${joinedUser?.id}`);
    expect(deleteResult).to.not.be.undefined;
    expect(deleteResult).to.have.property('result', "deleted");
  }).timeout(180 * 1000);

  it('Should display owner info of an iTwin in member info', async () => {
    const { result: userInfo } = await runCommand<User>(`user me`);
    expect(userInfo).to.not.be.undefined;

    const { result: getMemberUserInfo } = await runCommand<Member>(`access-control member user info --itwin-id ${iTwinId} --member-id ${userInfo!.id}`);
    expect(getMemberUserInfo).to.not.be.undefined;
    expect(getMemberUserInfo!.id).to.not.be.undefined;
    expect(getMemberUserInfo!.id).to.be.equal(userInfo!.id);
  });

  it('Should add a new role to a user.', async () => {
    const { result: newRole } = await runCommand<Role>(`access-control role create -i ${iTwinId} -n "Test Role 2" -d "Test Role Description"`);
    expect(newRole).to.not.be.undefined;
    expect(newRole!.id).to.not.be.undefined;

    const { result: usersInfo } = await runCommand<Member[]>(`access-control member user list --itwin-id ${iTwinId}`);
    expect(usersInfo).to.not.be.undefined;
    expect(usersInfo).to.have.lengthOf(1);
    expect(usersInfo![0].roles).to.have.lengthOf(1);

    const { result: updateMemberResult } = await runCommand<Member>(`access-control member user update --itwin-id ${iTwinId} --member-id ${usersInfo![0].id} --role-id ${usersInfo![0].roles[0].id} --role-id ${newRole!.id}`);
    expect(updateMemberResult).to.not.be.undefined;
    expect(updateMemberResult!.roles).to.have.lengthOf(2);
    expect(updateMemberResult!.roles.some(role => role.id === newRole!.id)).to.be.true;
    expect(updateMemberResult!.roles.some(role => role.id === usersInfo![0].roles[0].id)).to.be.true;
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

    const { result: createResult } = await runCommand<MembersResponse>(`access-control member user add --itwin-id ${iTwinId} --email ${usersInfo[0].email} --email ${usersInfo[1].email} --email ${usersInfo[2].email}
            --role-ids ${usersInfo[0].roleIds.join(',')} --role-ids ${usersInfo[1].roleIds.join(',')} --role-ids ${usersInfo[2].roleIds.join(',')}`);
    expect(createResult).to.not.be.undefined;
    expect(createResult!.invitations).to.have.lengthOf(3);
    for (const [i, userInfo] of usersInfo.entries()) {
      expect(createResult!.invitations[i].email).to.be.equal(userInfo.email);
      expect(createResult!.invitations[i].roles.map(role => role.id)).to.be.deep.equal(userInfo.roleIds);
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

    const { result: createResult } = await runCommand<MembersResponse>(`access-control member user add --itwin-id ${iTwinId} --email ${usersInfo[0].email} --email ${usersInfo[1].email} --email ${usersInfo[2].email} --role-ids ${roleIds.join(',')}`);
    expect(createResult).to.not.be.undefined;
    expect(createResult!.invitations).to.have.lengthOf(3);
    for (const [i, userInfo] of usersInfo.entries()) {
      expect(createResult!.invitations[i].email).to.be.equal(userInfo.email);
      expect(createResult!.invitations[i].roles.map(role => role.id)).to.be.deep.equal(roleIds);
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

    const { error: createError } = await runCommand<MembersResponse>(`access-control member user add --itwin-id ${iTwinId} --members ${JSON.stringify(usersInfo)} --email ${usersInfo[0].email} --email ${usersInfo[1].email} --email ${usersInfo[2].email}
            --role-ids ${usersInfo[0].roleIds.join(',')} --role-ids ${usersInfo[1].roleIds.join(',')} --role-ids ${usersInfo[2].roleIds.join(',')}`);
    expect(createError).to.not.be.undefined;
    expect(createError?.message).to.match(new RegExp(`--email=${usersInfo[0].email},${usersInfo[1].email},${usersInfo[2].email} cannot also be provided when using --members`));
  });

  it('Should return an error when none of the following flags are provided: `--members`, `--member`, `--role-ids`', async () => {
    const { error: createError } = await runCommand<MembersResponse>(`access-control member user add --itwin-id ${iTwinId}`);
    expect(createError).to.not.be.undefined;
    expect(createError?.message).to.match(/Exactly one of the following must be provided: --email, --members/);
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

    const { error: createError } = await runCommand<MembersResponse>(`access-control member user add --itwin-id ${iTwinId} --email ${usersInfo[0].email} --email ${usersInfo[1].email} --email ${usersInfo[2].email}`);
    expect(createError).to.not.be.undefined;
    expect(createError?.message).to.match(/All of the following must be provided when using --email: --role-ids/);
  });

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

    const { error: createError } = await runCommand<MembersResponse>(`access-control member user add --itwin-id ${iTwinId} --role-ids ${usersInfo[0].roleIds.join(',')} --role-ids ${usersInfo[1].roleIds.join(',')} --role-ids ${usersInfo[2].roleIds.join(',')}`);
    expect(createError).to.not.be.undefined;
    expect(createError?.message).to.match(/All of the following must be provided when using --role-ids: --email/);
  });

  it('should return an error when there are invalid UUIDs provided to `--role-ids` flag', async () => {
    const usersInfo = [
      {
        email: 'test1@example.com',
        roleIds: [roleId1, roleId2]
      }
    ];

    const { error: createError } = await runCommand<MembersResponse>(`access-control member user add --itwin-id ${iTwinId} --email ${usersInfo[0].email}
            --role-ids ${usersInfo[0].roleIds.join(',')},some-invalid-uuid`);
    expect(createError).to.not.be.undefined;
    expect(createError?.message).to.match(new RegExp(`There are invalid UUIDs in '${usersInfo[0].roleIds.join(',')},some-invalid-uuid'`));
  });

  it('should return an error when invalid JSON is provided to `--members` flag', async () => {
    const { error: createError } = await runCommand<MembersResponse>(`access-control member user add --itwin-id ${iTwinId} --members not-valid-serialized-json`);
    expect(createError).to.not.be.undefined;
    expect(createError!.message).to.match(/'not-valid-serialized-json' is not valid serialized JSON./);
  });

  it('should return an error when JSON of invalid schema is provided to `--members` flag', async () => {
    const usersInfo = [
      {
        email: "not-an-email",
        roleIds: [roleId1, roleId2]
      },
      {
        email: true,
        roleIds: [roleId1, 123]
      },
      {
        email: "test3@example.com",
        roleIds: ["not-a-uuid", roleId3]
      },
    ];
        
    const { error: createError } = await runCommand<MembersResponse>(`access-control member user add --itwin-id ${iTwinId} --members ${JSON.stringify(usersInfo)}`);
    expect(createError).to.not.be.undefined;
    expect(createError!.message).to.match(/\[0].email is not a valid email/);
    expect(createError!.message).to.match(/\[1].email: expected type 'string', received 'boolean'/);
    expect(createError!.message).to.match(/\[1].roleIds\[1]: expected type 'string', received 'number'/);
    expect(createError!.message).to.match(/\[2].roleIds\[0] is not a valid uuid/);
  });

  it('Should fail to add iTwin user members, when there are too many role assignments', async () => {
    const members: { email: string, roleIds: string[] }[] = [];
    for (let i = 0; i < 11; i++) {
      members.push({
        email: `email1${i}@example.com`,
        roleIds: [
          crypto.randomUUID(),
          crypto.randomUUID(),
          crypto.randomUUID(),
          crypto.randomUUID(),
          crypto.randomUUID(),
        ]
      });
    }
        
    const serializedMembersInfo = JSON.stringify(members);

    const { error: createError } = await runCommand<MembersResponse>(`access-control member user add --itwin-id ${iTwinId} --members ${serializedMembersInfo}`);
    expect(createError).to.not.be.undefined;
    expect(createError?.message).to.be.equal('A maximum of 50 role assignments can be performed.');
  });

  it('Should fail to update iTwin group, when there are too many roles assigned', async () => { 
    const { result: usersInfo } = await runCommand<Member[]>(`access-control member user list --itwin-id ${iTwinId}`);
    expect(usersInfo).to.not.be.undefined;
    expect(usersInfo!).to.have.lengthOf(1);

    let command = `access-control member user update --itwin-id ${iTwinId} --member-id ${usersInfo![0].id}`;
    for (let i = 0; i < 51; i++)
      command += ` --role-id role${i}`;

    const result = await runCommand<MembersResponse>(command);
    expect(result.error).to.not.be.undefined;
    expect(result.error?.message).to.be.equal('A maximum of 50 roles can be assigned.');
  });
};

export default tests;

runSuiteIfMainModule(import.meta, () => describe("Access Control Member User Tests", () => tests()));