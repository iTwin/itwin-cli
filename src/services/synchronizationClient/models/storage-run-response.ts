/*---------------------------------------------------------------------------------------------
* Copyright (c) Bentley Systems, Incorporated. All rights reserved.
* See LICENSE.md in the project root for license terms and full copyright notice.
*--------------------------------------------------------------------------------------------*/

import { links } from "../../general-models/links.js";
import { storageRun } from "./storage-run.js";

export type storageRunResponse = {
    run?: storageRun;
};

export type storageRunsResponse = {
    _links: links
    runs: storageRun[];
}
