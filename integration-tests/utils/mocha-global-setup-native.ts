/*---------------------------------------------------------------------------------------------
 * Copyright (c) Bentley Systems, Incorporated. All rights reserved.
 * See LICENSE.md in the project root for license terms and full copyright notice.
 *--------------------------------------------------------------------------------------------*/

import { nativeLoginToCli } from "./helpers";

export async function mochaGlobalSetup(): Promise<void> {
  await nativeLoginToCli();
  // eslint-disable-next-line no-console
  console.log("\n\nRunning tests with native client");
}
