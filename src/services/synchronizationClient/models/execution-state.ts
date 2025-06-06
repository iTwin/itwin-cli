/*---------------------------------------------------------------------------------------------
* Copyright (c) Bentley Systems, Incorporated. All rights reserved.
* See LICENSE.md in the project root for license terms and full copyright notice.
*--------------------------------------------------------------------------------------------*/

export enum ExecutionState {
    COMPLETED = "Completed",
    EXECUTING = "Executing",
    FINALIZING = "Finalizing",
    IDLE = "Idle",
    NOT_STARTED = "NotStarted",
    QUEUED = "Queued",
    WAITING_TO_EXECUTE = "WaitingToExecute",
    WAITING_TO_RETRY = "WaitingToRetry"
}
