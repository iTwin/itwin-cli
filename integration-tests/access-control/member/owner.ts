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

    it('Should add new owner to an iTwin', async () => {
        const emailToAdd = 'itwin.cli.qa-testaccount@be-mailinator.eastus.cloudapp.azure.com';
        const owner = await runCommand<ownerResponse>(`access-control member owner add -i ${iTwinId} --email ${emailToAdd}`);
        expect(owner.result).is.not.undefined;
        expect(owner.result!.member).is.null;
        expect(owner.result!.invitation).is.not.undefined;
        expect(owner.result!.invitation.email).to.equal(emailToAdd);
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