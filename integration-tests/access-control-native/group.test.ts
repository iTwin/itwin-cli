/*---------------------------------------------------------------------------------------------
* Copyright (c) Bentley Systems, Incorporated. All rights reserved.
* See LICENSE.md in the project root for license terms and full copyright notice.
*--------------------------------------------------------------------------------------------*/

import { ITwin } from "@itwin/itwins-client";
import { runCommand } from "@oclif/test";
import { expect } from "chai";

import { group } from "../../src/services/access-control-client/models/group";
import { nativeLoginToCli } from "../utils/helpers";
import runSuiteIfMainModule from "../utils/run-suite-if-main-module";

const tests = () => describe('group', () => {
    let iTwinId: string;
    let groupId: string;
    const groupName = "Test Group";
    const groupDescription = "Test Group Description";
    before(async () => {
        await nativeLoginToCli();
        
        const iTwinName = `cli-itwin-integration-test-${new Date().toISOString()}`;
        const iTwin = await runCommand<ITwin>(`itwin create --class Thing --sub-class Asset --name ${iTwinName}`);
        expect(iTwin.result?.id).is.not.undefined;
        iTwinId = iTwin.result!.id!;
        const group = await runCommand<group>(`access-control group create --itwin-id ${iTwinId} --name "${groupName}" --description "${groupDescription}"`);
        expect(group.result).to.not.be.undefined;
        groupId = group.result!.id!;
    });

    after(async () => {
        const result = await runCommand(`itwin delete --itwin-id ${iTwinId}`);
        expect(result.stdout).to.contain('deleted');
    });

    it('Should update group ims-group', async () => {
        const imsGroupName = "iTwin CLI Test Group";
        const groupUpdate = await runCommand<group>(`access-control group update --itwin-id ${iTwinId} --group-id ${groupId} --ims-group "${imsGroupName}"`);
        expect(groupUpdate.result).is.not.undefined;
        expect(groupUpdate.result!.id).is.not.undefined;
        expect(groupUpdate.result!.imsGroups?.length).to.be.equal(1);
        expect(groupUpdate.result!.imsGroups![0]).to.be.equal(imsGroupName);
    });
});    

export default tests;

runSuiteIfMainModule(import.meta, tests);