/*---------------------------------------------------------------------------------------------
 * Copyright (c) Bentley Systems, Incorporated. All rights reserved.
 * See LICENSE.md in the project root for license terms and full copyright notice.
 *--------------------------------------------------------------------------------------------*/

import { expect } from "chai";

import { runCommand } from "@oclif/test";

import { AuthInfo } from "../../src/services/synchronizationClient/models/connection-auth";
import { nativeLoginToCli } from "./helpers";

export async function mochaGlobalSetup(): Promise<void> {
  await nativeLoginToCli();
  const { result } = await runCommand<AuthInfo>(`imodel connection auth`);
  expect(result?.isUserAuthorized).to.be.equal(true);

  // eslint-disable-next-line no-console
  console.log("\n\nRunning tests with native client");
}
