/*---------------------------------------------------------------------------------------------
* Copyright (c) Bentley Systems, Incorporated. All rights reserved.
* See LICENSE.md in the project root for license terms and full copyright notice.
*--------------------------------------------------------------------------------------------*/

import { taskError } from "./task-error.js";

export type storageTask = {
    endDateTime?: string;
    error?: taskError;
    id?: string;
    result?: string;
    retryAttempts?: number;
    startDateTime?: string;
    state?: string;
    storageFileId?: string;
};
