import { runCommand } from "@oclif/test";
import { expect } from "chai";

import { authInfo } from '../../src/services/synchronizationClient/models/connection-auth';
import { nativeLoginToCli } from "./helpers";

export async function mochaGlobalSetup() {
    await nativeLoginToCli();
    const { result } = await runCommand<authInfo>(`imodel connection auth`);
    expect(result?.isUserAuthorized).to.be.equal(true);
    console.log("\n\nRunning tests with native client")
}