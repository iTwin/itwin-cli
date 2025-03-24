/*---------------------------------------------------------------------------------------------
* Copyright (c) Bentley Systems, Incorporated. All rights reserved.
* See LICENSE.md in the project root for license terms and full copyright notice.
*--------------------------------------------------------------------------------------------*/

import { ITwin } from "@itwin/itwins-client";
import { runCommand } from "@oclif/test";
import { expect } from "chai";

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

    it('Should retrieve my permissions', async () => {
        const myPermissions = await runCommand<string[]>(`access-control permissions me --itwin-id ${iTwinId}`);
        expect(myPermissions.result).is.not.undefined;
        expect(myPermissions.result!.length).to.be.greaterThan(0);
    });

    it('Should list all permissions', async () => {
        const allPermissions = await runCommand<string[]>(`access-control permissions all`);
        expect(allPermissions.result).is.not.undefined;
        expect(allPermissions.result!.length).to.be.greaterThan(0);
    });
};

export default tests;
