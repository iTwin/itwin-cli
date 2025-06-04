/*---------------------------------------------------------------------------------------------
* Copyright (c) Bentley Systems, Incorporated. All rights reserved.
* See LICENSE.md in the project root for license terms and full copyright notice.
*--------------------------------------------------------------------------------------------*/

import { Links } from "../../general-models/links.js";
import { StorageConnection } from "./storage-connection.js";

export type StorageConnectionResponse = {
    connection?: StorageConnection;
};

export type StorageConnectionListResponse = {
    _links: Links;
    connections: StorageConnection[];
}

export type StorageConnectionUpdate = {
    authenticationType?: 'Service' | 'User';
    displayName?: string;
}
