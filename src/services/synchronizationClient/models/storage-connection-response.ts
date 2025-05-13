/*---------------------------------------------------------------------------------------------
* Copyright (c) Bentley Systems, Incorporated. All rights reserved.
* See LICENSE.md in the project root for license terms and full copyright notice.
*--------------------------------------------------------------------------------------------*/

import { links } from "../../general-models/links.js";
import { storageConnection } from "./storage-connection.js";

export type storageConnectionResponse = {
    connection?: storageConnection;
};

export type storageConnectionListResponse = {
    _links: links;
    connections: storageConnection[];
}

export type storageConnectionUpdate = {
    authenticationType?: 'Service' | 'User';
    displayName?: string;
}
