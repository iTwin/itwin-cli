/*---------------------------------------------------------------------------------------------
* Copyright (c) Bentley Systems, Incorporated. All rights reserved.
* See LICENSE.md in the project root for license terms and full copyright notice.
*--------------------------------------------------------------------------------------------*/

import { TaskError } from "./task-error.js";

export interface StorageTask {
    endDateTime?: string;
    error?: TaskError;
    id?: string;
    result?: string;
    retryAttempts?: number;
    startDateTime?: string;
    state?: string;
    storageFileId?: string;
}
