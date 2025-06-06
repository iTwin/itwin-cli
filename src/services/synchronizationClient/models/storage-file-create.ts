/*---------------------------------------------------------------------------------------------
* Copyright (c) Bentley Systems, Incorporated. All rights reserved.
* See LICENSE.md in the project root for license terms and full copyright notice.
*--------------------------------------------------------------------------------------------*/

import { ConnectorType } from "./connector-type.js";

export type StorageFileCreate = {
    connectorType: ConnectorType;
    storageFileId: string;
};
