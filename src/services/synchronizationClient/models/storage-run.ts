/*---------------------------------------------------------------------------------------------
* Copyright (c) Bentley Systems, Incorporated. All rights reserved.
* See LICENSE.md in the project root for license terms and full copyright notice.
*--------------------------------------------------------------------------------------------*/

import { executionResult } from "./execution-result.js";
import { executionState } from "./execution-state.js";
import { jobPhase } from "./job-phase.js";
import { storageJob } from "./storage-job.js";

export type storageRun = {
    connectionId?: string;
    endDateTime?: string;
    id?: string;
    jobs?: Array<storageJob>;
    phase?: jobPhase;
    result?: executionResult;
    startDateTime?: string;
    state?: executionState;
};
