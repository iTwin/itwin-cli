/*---------------------------------------------------------------------------------------------
 * Copyright (c) Bentley Systems, Incorporated. All rights reserved.
 * See LICENSE.md in the project root for license terms and full copyright notice.
 *--------------------------------------------------------------------------------------------*/

import fs from "node:fs";
import os from "node:os";
import path from "node:path";

export const ITP_API_URL = "https://mock-api.bentley.com";
export const ITP_ISSUER_URL = "https://mock-ims.bentley.com";

let tempDir: string | undefined;

export const setupMockEnvironment = (): void => {
  process.env.ITP_API_URL = ITP_API_URL;
  process.env.ITP_ISSUER_URL = ITP_ISSUER_URL;

  // Keep the mocked token, context and config away from a real itp login on this machine.
  tempDir = fs.mkdtempSync(path.join(os.tmpdir(), "itp-mocked-tests-"));
  process.env.ITP_CACHE_DIR = path.join(tempDir, "cache");
  process.env.ITP_CONFIG_DIR = path.join(tempDir, "config");
};

export const cleanupMockEnvironment = (): void => {
  if (tempDir) fs.rmSync(tempDir, { force: true, recursive: true });
  tempDir = undefined;
};
