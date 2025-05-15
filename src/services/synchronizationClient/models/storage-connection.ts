/*---------------------------------------------------------------------------------------------
* Copyright (c) Bentley Systems, Incorporated. All rights reserved.
* See LICENSE.md in the project root for license terms and full copyright notice.
*--------------------------------------------------------------------------------------------*/

import { authenticationType } from "./authentication-type.js";
import { connectionLinks } from "./connection-links.js";

export type storageConnection = {
    _links: connectionLinks;
    authenticationType: authenticationType;
    displayName: string;
    error: storageConnectionError
    iModelId: string;
    id: string;
};

export type storageConnectionError = {
    description: string;
    errorKey: string;
}
