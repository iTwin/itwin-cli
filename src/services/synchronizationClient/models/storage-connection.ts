/*---------------------------------------------------------------------------------------------
* Copyright (c) Bentley Systems, Incorporated. All rights reserved.
* See LICENSE.md in the project root for license terms and full copyright notice.
*--------------------------------------------------------------------------------------------*/

import { authenticationType } from "./authentication-type.js";
import { connectionLinks } from "./connection-links.js";

export type StorageConnection = {
    _links: connectionLinks;
    authenticationType: authenticationType;
    displayName: string;
    iModelId: string;
    id: string;
};
