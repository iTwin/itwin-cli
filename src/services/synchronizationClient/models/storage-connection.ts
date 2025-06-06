/*---------------------------------------------------------------------------------------------
* Copyright (c) Bentley Systems, Incorporated. All rights reserved.
* See LICENSE.md in the project root for license terms and full copyright notice.
*--------------------------------------------------------------------------------------------*/

import { AuthenticationType } from "./authentication-type.js";
import { ConnectionLinks } from "./connection-links.js";

export type StorageConnection = {
    _links: ConnectionLinks;
    authenticationType: AuthenticationType;
    displayName: string;
    error: StorageConnectionError
    iModelId: string;
    iTwinId: string;
    id: string;
};

export type StorageConnectionError = {
    description: string;
    errorKey: string;
}
