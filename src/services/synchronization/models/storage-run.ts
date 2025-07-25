/*---------------------------------------------------------------------------------------------
 * Copyright (c) Bentley Systems, Incorporated. All rights reserved.
 * See LICENSE.md in the project root for license terms and full copyright notice.
 *--------------------------------------------------------------------------------------------*/

import { ExecutionResult } from "./execution-result.js";
import { ExecutionState } from "./execution-state.js";
import { JobPhase } from "./job-phase.js";
import { StorageJob } from "./storage-job.js";

export interface StorageRun {
  connectionId?: string;
  endDateTime?: string;
  id?: string;
  jobs?: Array<StorageJob>;
  phase?: JobPhase;
  result?: ExecutionResult;
  startDateTime?: string;
  state?: ExecutionState;
}
