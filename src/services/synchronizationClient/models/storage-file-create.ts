/*---------------------------------------------------------------------------------------------
* Copyright (c) Bentley Systems, Incorporated. All rights reserved.
* See LICENSE.md in the project root for license terms and full copyright notice.
*--------------------------------------------------------------------------------------------*/

import { connectorType } from "./connector-type.js";

export type storageFileCreate = {
    connectorType: connectorType;
    storageFileId: string;
};
