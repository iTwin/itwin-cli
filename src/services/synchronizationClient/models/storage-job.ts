/*---------------------------------------------------------------------------------------------
* Copyright (c) Bentley Systems, Incorporated. All rights reserved.
* See LICENSE.md in the project root for license terms and full copyright notice.
*--------------------------------------------------------------------------------------------*/

import { ConnectorType } from "./connector-type.js";
import { StorageTask } from "./storage-task.js";

export type StorageJob = {
    connectorType?: ConnectorType;
    endDateTime?: string;
    id?: string;
    result?: string;
    startDateTime?: string;
    state?: string;
    tasks?: Array<StorageTask>;
};
