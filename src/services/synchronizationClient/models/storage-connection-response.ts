/*---------------------------------------------------------------------------------------------
* Copyright (c) Bentley Systems, Incorporated. All rights reserved.
* See LICENSE.md in the project root for license terms and full copyright notice.
*--------------------------------------------------------------------------------------------*/

import { links } from "../../general-models/links.js";
import { StorageConnection } from "./storage-connection.js";

export type storageConnectionResponse = {
    connection?: StorageConnection;
};

export type storageConnectionListResponse = {
    _links: links;
    connections: StorageConnection[];
}

export type storageConnectionUpdate = {
    authenticationType?: 'Service' | 'User';
    displayName?: string;
}
