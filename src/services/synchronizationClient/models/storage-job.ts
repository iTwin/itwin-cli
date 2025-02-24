/*---------------------------------------------------------------------------------------------
* Copyright (c) Bentley Systems, Incorporated. All rights reserved.
* See LICENSE.md in the project root for license terms and full copyright notice.
*--------------------------------------------------------------------------------------------*/

import { connectorType } from "./connector-type.js";
import { storageTask } from "./storage-task.js";

export type storageJob = {
    connectorType?: connectorType;
    endDateTime?: string;
    id?: string;
    result?: string;
    startDateTime?: string;
    state?: string;
    tasks?: Array<storageTask>;
};
