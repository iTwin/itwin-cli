/*---------------------------------------------------------------------------------------------
 * Copyright (c) Bentley Systems, Incorporated. All rights reserved.
 * See LICENSE.md in the project root for license terms and full copyright notice.
 *--------------------------------------------------------------------------------------------*/

import { expect } from "chai";

import { ITwin } from "@itwin/itwins-client";
import { runCommand } from "@oclif/test";

import { Member, MembersResponse } from "../../../src/services/access-control-client/models/members";
import { Role } from "../../../src/services/access-control-client/models/role";
import { ResultResponse } from "../../../src/services/general-models/result-response";
import { ITP_TEST_USER_SAMEORG } from "../../utils/environment";
import { nativeLoginToCli } from "../../utils/helpers";
import runSuiteIfMainModule from "../../utils/run-suite-if-main-module";

const tests = () =>
  describe("user", () => {
    let iTwinId: string;
    const iTwinName: string = `cli-itwin-integration-test-${new Date().toISOString()}`;

    before(async () => {
      await nativeLoginToCli();

      const { result: iTwin } = await runCommand<ITwin>(`itwin create --class Thing --sub-class Asset --name ${iTwinName}`);
      expect(iTwin, "itwin create result").to.have.property("id");
      iTwinId = iTwin!.id!;
    });

    after(async () => {
      const { result: deleteResult } = await runCommand<ResultResponse>(`itwin delete --itwin-id ${iTwinId}`);
      expect(deleteResult).to.have.property("result", "deleted");
    });

    it("Should add an internal member to an iTwin and remove user member", async () => {
      const { result: newRole } = await runCommand<Role>(`access-control role create -i ${iTwinId} -n "Test Role 1" -d "Test Role Description"`);
      expect(newRole).to.not.be.undefined;
      expect(newRole!.id).to.not.be.undefined;

      const emailToAdd = ITP_TEST_USER_SAMEORG;

      const { result: invitedUser } = await runCommand<MembersResponse>(
        `access-control member user add --itwin-id ${iTwinId} --members "[{"email": "${emailToAdd}", "roleIds": ["${newRole!.id}"]}]"`,
      );

      expect(invitedUser).to.not.be.undefined;
      expect(invitedUser!.members).to.have.lengthOf(1);
      expect(invitedUser!.members[0].email.toLowerCase()).to.be.equal(emailToAdd!.toLowerCase());
      expect(invitedUser!.members[0].roles).to.have.lengthOf(1);
      expect(invitedUser!.members[0].roles[0].id).to.be.equal(newRole!.id);

      const { result: usersInfo } = await runCommand<Member[]>(`access-control member user list --itwin-id ${iTwinId}`);
      expect(usersInfo).to.not.be.undefined;
      expect(usersInfo).to.have.lengthOf(2);
      const joinedUser = usersInfo?.filter((user) => user.email.toLowerCase() === emailToAdd!.toLowerCase())[0];
      expect(joinedUser).to.not.be.undefined;
      expect(joinedUser?.roles).to.have.lengthOf(1);
      expect(joinedUser?.roles[0].id).to.be.equal(newRole!.id);

      const { result: deleteResult } = await runCommand<ResultResponse>(
        `access-control member user delete --itwin-id ${iTwinId} --member-id ${joinedUser?.id}`,
      );
      expect(deleteResult).to.not.be.undefined;
      expect(deleteResult).to.have.property("result", "deleted");
    });
  });

export default tests;

runSuiteIfMainModule(import.meta, tests);
