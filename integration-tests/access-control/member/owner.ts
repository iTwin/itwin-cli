/*---------------------------------------------------------------------------------------------
* Copyright (c) Bentley Systems, Incorporated. All rights reserved.
* See LICENSE.md in the project root for license terms and full copyright notice.
*--------------------------------------------------------------------------------------------*/

import { ITwin } from "@itwin/itwins-client";
import { runCommand } from "@oclif/test";
import { expect } from "chai";

import { groupMember } from "../../../src/services/access-control-client/models/group-members";
import { ownerResponse } from "../../../src/services/access-control-client/models/owner";
import { User } from "../../../src/services/user-client/models/user";
import { fetchEmailsAndGetInvitationToken } from "../../utils/helpers";

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

    it('Should invite an external member to an iTwin, accept invitation and remove owner member', async () => {
        const emailToAdd = 'iTwin.CLI.QA.IntegrationTest@bentley.m8r.co';
        const invitedOwner = await runCommand<ownerResponse>(`access-control member owner add -i ${iTwinId} --email ${emailToAdd}`);
        expect(invitedOwner.result).is.not.undefined;
        expect(invitedOwner.result!.member).is.null;
        expect(invitedOwner.result!.invitation).is.not.undefined;
        expect(invitedOwner.result!.invitation.email.toLowerCase()).to.equal(emailToAdd.toLowerCase());

        const invitationToken = await fetchEmailsAndGetInvitationToken(emailToAdd.split('@')[0], iTwinName);

        await fetch(`https://qa-connect-rbacportal.bentley.com/AcceptInvitation?invitationToken=${invitationToken}`);

        const usersInfo = await runCommand<groupMember[]>(`access-control member owner list --itwin-id ${iTwinId}`);
        expect(usersInfo.result).is.not.undefined;
        expect(usersInfo.result!.length).to.be.equal(2);
        const joinedUser = usersInfo.result?.filter(user => user.email.toLowerCase() === emailToAdd.toLowerCase())[0];
        expect(joinedUser).to.not.be.undefined;

        const deletionResult = await runCommand<{result: string}>(`access-control member owner delete --itwin-id ${iTwinId} --member-id ${joinedUser?.id}`);
        expect(deletionResult.result).to.not.be.undefined;
        expect(deletionResult.result!.result).to.be.equal("deleted");
    });

    it('Should list owners of an iTwin', async () => {
        const owners = await runCommand<groupMember[]>(`access-control member owner list --itwin-id ${iTwinId}`);
        expect(owners.result).is.not.undefined;
        expect(owners.result!.length).to.be.greaterThanOrEqual(1);

        const userInfo = await runCommand<User>(`user me`);
        expect(userInfo.result).is.not.undefined;
        expect(userInfo.result!.id).is.not.undefined;
        expect(owners.result!.some(owner => owner.id === userInfo.result!.id)).to.be.true;
    });


};

export default tests;