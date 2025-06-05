/*---------------------------------------------------------------------------------------------
* Copyright (c) Bentley Systems, Incorporated. All rights reserved.
* See LICENSE.md in the project root for license terms and full copyright notice.
*--------------------------------------------------------------------------------------------*/

import { ExecutionResult } from "./execution-result.js";
import { ExecutionState } from "./execution-state.js";
import { jobPhase } from "./job-phase.js";
import { storageJob } from "./storage-job.js";

export type StorageRun = {
    connectionId?: string;
    endDateTime?: string;
    id?: string;
    jobs?: Array<storageJob>;
    phase?: jobPhase;
    result?: ExecutionResult;
    startDateTime?: string;
    state?: ExecutionState;
};
