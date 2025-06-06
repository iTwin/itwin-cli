/*---------------------------------------------------------------------------------------------
* Copyright (c) Bentley Systems, Incorporated. All rights reserved.
* See LICENSE.md in the project root for license terms and full copyright notice.
*--------------------------------------------------------------------------------------------*/

import { LinksItem } from "./links-item.js";

export type FolderTyped = {
    _links?: LinksItem;
    /**
     * Date when the folder was created.
     */
    createdDateTime?: string;
    /**
     * Description of the folder.
     */
    description?: string;
    /**
     * Display name of the folder.
     */
    displayName?: string;
    /**
     * Unique Identifier of the folder.
     */
    id?: string;
    /**
     * Display name of the user who modified folder last.
     */
    lastModifiedByDisplayName?: string;
    /**
     * Date when the folder was last time modified.
     */
    lastModifiedDateTime?: string;
    /**
     * Unique Identifier of the parent folder.
     */
    parentFolderId?: string;
    /**
     * Absolute path to the folder.
     */
    path?: string;
    /**
     * Identification of the folder entity.
     */
    type?: FolderTypedType;

};

export enum FolderTypedType {
    FOLDER = 'folder'
}

export type FolderInfo = {
    description?: string
    displayName?: string
}

export type FolderResponse = {
    folder: FolderTyped;
}

export type FoldersResponse = {
    folders: FolderTyped[];
}