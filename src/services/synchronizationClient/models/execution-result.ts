/*---------------------------------------------------------------------------------------------
* Copyright (c) Bentley Systems, Incorporated. All rights reserved.
* See LICENSE.md in the project root for license terms and full copyright notice.
*--------------------------------------------------------------------------------------------*/

export enum ExecutionResult {
    CANCELLED = "Cancelled",
    ERROR = "Error",
    PARTIAL_SUCCESS = "PartialSuccess",
    SKIPPED = "Skipped",
    SUCCESS = "Success",
    TIMED_OUT = "TimedOut",
    UNDETERMINED = "Undetermined"
}
