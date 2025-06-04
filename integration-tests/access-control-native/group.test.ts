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
    before(async function() {
        this.timeout(5 * 60 * 1000);
        await nativeLoginToCli();
        
        const iTwinName = `cli-itwin-integration-test-${new Date().toISOString()}`;
        const { result: iTwin } = await runCommand<ITwin>(`itwin create --class Thing --sub-class Asset --name ${iTwinName}`);
        expect(iTwin?.id).to.not.be.undefined;
        iTwinId = iTwin!.id!;
        const { result: group } = await runCommand<group>(`access-control group create --itwin-id ${iTwinId} --name "${groupName}" --description "${groupDescription}"`);
        expect(group).to.not.be.undefined;
        groupId = group!.id!;
    });

    after(async () => {
        const { result: deleteResult } = await runCommand<{result: string}>(`itwin delete --itwin-id ${iTwinId}`);
        expect(deleteResult).to.have.property('result', 'deleted');
    });

    it('Should update group ims-group', async () => {
        const imsGroupName = "iTwin CLI Test Group";
        const { result: groupUpdate } = await runCommand<group>(`access-control group update --itwin-id ${iTwinId} --group-id ${groupId} --ims-group "${imsGroupName}"`);
        expect(groupUpdate).to.not.be.undefined;
        expect(groupUpdate!.id).to.not.be.undefined;
        expect(groupUpdate!.imsGroups).to.have.lengthOf(1);
        expect(groupUpdate!.imsGroups![0]).to.be.equal(imsGroupName);
    });
});    

export default tests;

runSuiteIfMainModule(import.meta, tests);