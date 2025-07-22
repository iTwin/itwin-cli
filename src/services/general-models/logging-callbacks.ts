/*---------------------------------------------------------------------------------------------
 * Copyright (c) Bentley Systems, Incorporated. All rights reserved.
 * See LICENSE.md in the project root for license terms and full copyright notice.
 *--------------------------------------------------------------------------------------------*/

import { PrettyPrintableError } from "@oclif/core/interfaces";

export interface LoggingCallbacks {
  log: (message?: string, ...args: any[]) => void;
  error: (input: Error | string, options?: { code?: string; exit?: number } & PrettyPrintableError) => void;
}
