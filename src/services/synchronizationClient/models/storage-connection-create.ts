/*---------------------------------------------------------------------------------------------
* Copyright (c) Bentley Systems, Incorporated. All rights reserved.
* See LICENSE.md in the project root for license terms and full copyright notice.
*--------------------------------------------------------------------------------------------*/

import { AuthenticationType } from "./authentication-type.js";
import { StorageFileCreate } from "./storage-file-create.js";

export interface StorageConnectionCreate {
    authenticationType?: AuthenticationType;
    displayName?: string;
    iModelId: string;
    sourceFiles: Array<StorageFileCreate>;
}


