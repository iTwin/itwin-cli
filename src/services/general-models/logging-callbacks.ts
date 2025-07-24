/*---------------------------------------------------------------------------------------------
 * Copyright (c) Bentley Systems, Incorporated. All rights reserved.
 * See LICENSE.md in the project root for license terms and full copyright notice.
 *--------------------------------------------------------------------------------------------*/

export interface LoggingCallbacks {
  log: (message?: string) => void;
  error: (input: Error | string) => void;
  debug: (...args: any[]) => void;
}
