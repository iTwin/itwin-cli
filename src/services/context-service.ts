/*---------------------------------------------------------------------------------------------
 * Copyright (c) Bentley Systems, Incorporated. All rights reserved.
 * See LICENSE.md in the project root for license terms and full copyright notice.
 *--------------------------------------------------------------------------------------------*/

import * as fs from "node:fs";

import { LoggingCallbacks } from "./general-models/logging-callbacks.js";
import { UserContext } from "./general-models/user-context.js";

export class ContextService {
  private _cacheDir: string;
  private _loggingCallbacks: LoggingCallbacks;

  constructor(cacheDir: string, loggingCallbacks: LoggingCallbacks) {
    this._cacheDir = cacheDir;
    this._loggingCallbacks = loggingCallbacks;
  }

  public getContext(): UserContext | undefined {
    const contextPath = `${this._cacheDir}/context.json`;
    if (!fs.existsSync(contextPath)) {
      return;
    }

    try {
      const contextFile = fs.readFileSync(contextPath, "utf8");
      const context = JSON.parse(contextFile) as UserContext;

      if (!context.iModelId && !context.iTwinId) {
        return undefined;
      }

      return context;
    } catch (error) {
      this._loggingCallbacks.debug("Error parsing context file:", error);
    }
  }

  public async clearContext(): Promise<void> {
    const contextPath = `${this._cacheDir}/context.json`;
    if (fs.existsSync(contextPath)) {
      fs.rmSync(contextPath, { force: true });
    }

    this._loggingCallbacks.debug(`Cleared context file: ${contextPath}`);
  }

  public async setContext(iTwinId: string, iModelId?: string): Promise<UserContext> {
    const contextPath = `${this._cacheDir}/context.json`;

    const context: UserContext = {
      iModelId,
      iTwinId,
    };

    if (!fs.existsSync(this._cacheDir)) {
      fs.mkdirSync(this._cacheDir, { recursive: true });
    }

    fs.writeFileSync(contextPath, JSON.stringify(context, null, 2), "utf8");

    this._loggingCallbacks.log(`Context set to iTwinId: ${iTwinId}, iModelId: ${iModelId}`);

    return context;
  }
}
