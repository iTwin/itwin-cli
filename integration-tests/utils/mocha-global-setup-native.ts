import { runCommand } from "@oclif/test";
import { expect } from "chai";

import { AuthInfo } from '../../src/services/synchronizationClient/models/connection-auth';
import { nativeLoginToCli } from "./helpers";

export async function mochaGlobalSetup() {
  await nativeLoginToCli();
  const { result } = await runCommand<AuthInfo>(`imodel connection auth`);
  expect(result?.isUserAuthorized).to.be.equal(true);
     
  // eslint-disable-next-line no-console
  console.log("\n\nRunning tests with native client");
}