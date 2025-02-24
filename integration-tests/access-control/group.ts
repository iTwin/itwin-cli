/*---------------------------------------------------------------------------------------------
* Copyright (c) Bentley Systems, Incorporated. All rights reserved.
* See LICENSE.md in the project root for license terms and full copyright notice.
*--------------------------------------------------------------------------------------------*/

import { ITwin } from "@itwin/itwins-client";
import { runCommand } from "@oclif/test";
import { expect } from "chai";

import { group } from "../../src/services/access-control-client/models/group";

const tests = () => {
    let iTwinId: string;

    before(async () => {
        const iTwinName = `cli-itwin-integration-test-${new Date().toISOString()}`;
        const iTwin = await runCommand<ITwin>(`itwin create --class Thing --sub-class Asset --display-name ${iTwinName}`);
        expect(iTwin.result?.id).is.not.undefined;
        iTwinId = iTwin.result!.id!;
    });

    after(async () => {
        const result = await runCommand(`itwin delete --id ${iTwinId}`);
        expect(result.stdout).to.contain('deleted');
    });

    it('Should create and update group info', async () => {
        const groupName = "Test Group";
        const groupDescription = "Test Group Description";

        const groupCreate = await runCommand<group>(`access-control group create --itwin-id ${iTwinId} --name "${groupName}" --description "${groupDescription}"`);

        expect(groupCreate.result).is.not.undefined;
        expect(groupCreate.result!.id).is.not.undefined;
        expect(groupCreate.result!.name).to.be.equal(groupName);
        expect(groupCreate.result!.description).to.be.equal(groupDescription);
        
        const groupInfo = await runCommand<group>(`access-control group info --itwin-id ${iTwinId} --group-id ${groupCreate.result!.id}`);
        
        expect(groupInfo.result).to.not.be.undefined;

        expect(groupInfo.result?.id).to.be.equal(groupCreate.result!.id);
        expect(groupInfo.result?.name).to.be.equal(groupName);
        expect(groupInfo.result?.description).to.be.equal(groupDescription);

        const updatedGroupName = "Updated Group Name";
        const updatedGroupDescription = "Updated Group Description";
        const memberEmail = "itwin.cli.qa-testaccount@be-mailinator.eastus.cloudapp.azure.com";

        const groupUpdate = await runCommand<group>(`access-control group update --itwin-id ${iTwinId} --group-id ${groupCreate.result!.id} --name "${updatedGroupName}" --description "${updatedGroupDescription}" --members ${memberEmail}`);
        expect(groupUpdate.result).is.not.undefined;
        expect(groupUpdate.result!.id).is.not.undefined;
        expect(groupUpdate.result!.name).to.be.equal(updatedGroupName);
        expect(groupUpdate.result!.description).to.be.equal(updatedGroupDescription);
        expect(groupUpdate.result!.members).is.not.undefined;
        expect(groupUpdate.result!.members!.some(member => member.email.toLowerCase() === memberEmail)).to.be.true;
    });

    it('Should list groups', async () => {
        const newGroup = await runCommand<group>(`access-control group create --itwin-id ${iTwinId} --name "Test2" --description "Description2"`);
        expect(newGroup.result).is.not.undefined;
        expect(newGroup.result!.id).is.not.undefined;
        expect(newGroup.result!.name).to.be.equal("Test2");
        expect(newGroup.result!.description).to.be.equal("Description2");

        const listedGroups = await runCommand<group[]>(`access-control group list --itwin-id ${iTwinId}`);
        expect(listedGroups.result).is.not.undefined;
        expect(listedGroups.result!.length).to.be.greaterThanOrEqual(1);

        expect(listedGroups).contain((entry: { id: string | undefined; }) => entry.id === newGroup.result!.id, "Newly created group not found in the list");
    });

    it('Should delete group', async () => {
        const newGroup = await runCommand<group>(`access-control group create --itwin-id ${iTwinId} --name "Test3" --description "Description3"`);
        expect(newGroup.result).is.not.undefined;
        expect(newGroup.result!.id).is.not.undefined;

        const deleteGroup = await runCommand(`access-control group delete --itwin-id ${iTwinId} --group-id ${newGroup.result!.id}`);
        expect(deleteGroup.stdout).to.contain('deleted');
    });
};    

export default tests;