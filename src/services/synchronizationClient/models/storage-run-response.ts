/*---------------------------------------------------------------------------------------------
* Copyright (c) Bentley Systems, Incorporated. All rights reserved.
* See LICENSE.md in the project root for license terms and full copyright notice.
*--------------------------------------------------------------------------------------------*/

import { Links } from "../../general-models/links.js";
import { StorageRun } from "./storage-run.js";

export type StorageRunResponse = {
    run?: StorageRun;
};

export type StorageRunsResponse = {
    _links: Links
    runs: StorageRun[];
}
