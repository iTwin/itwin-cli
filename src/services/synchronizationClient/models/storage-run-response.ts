/*---------------------------------------------------------------------------------------------
* Copyright (c) Bentley Systems, Incorporated. All rights reserved.
* See LICENSE.md in the project root for license terms and full copyright notice.
*--------------------------------------------------------------------------------------------*/

import { Links } from "../../general-models/links.js";
import { StorageRun } from "./storage-run.js";

export interface StorageRunResponse {
    run?: StorageRun;
}

export interface StorageRunsResponse {
    // eslint-disable-next-line @typescript-eslint/naming-convention
    _links: Links
    runs: StorageRun[];
}
