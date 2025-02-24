/*---------------------------------------------------------------------------------------------
* Copyright (c) Bentley Systems, Incorporated. All rights reserved.
* See LICENSE.md in the project root for license terms and full copyright notice.
*--------------------------------------------------------------------------------------------*/

import { authenticationType } from "./authentication-type.js";
import { storageFileCreate } from "./storage-file-create.js";

export type storageConnectionCreate = {
    authenticationType?: authenticationType;
    displayName?: string;
    iModelId: string;
    sourceFiles: Array<storageFileCreate>;
};


