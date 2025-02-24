/*---------------------------------------------------------------------------------------------
* Copyright (c) Bentley Systems, Incorporated. All rights reserved.
* See LICENSE.md in the project root for license terms and full copyright notice.
*--------------------------------------------------------------------------------------------*/

import { fileTypedType } from "./file-typed-type.js";
import { linksItem } from "./links-item.js";


export type fileTyped = {
    _links?: linksItem;
    /**
     * Date when the file was created.
     */
    createdDateTime?: string;
    /**
     * Description of the file.
     */
    description?: string;
    /**
     * Display name of the file.
     */
    displayName?: string;
    /**
     * Unique Identifier of the file.
     */
    id?: string;
    /**
     * Display name of the user who modified file last.
     */
    lastModifiedByDisplayName?: string;
    /**
     * Date when the file was last time modified.
     */
    lastModifiedDateTime?: string;
    /**
     * Unique Identifier of the parent folder.
     */
    parentFolderId?: string;
    /**
     * Absolute path to the file.
     */
    path?: string;
    /**
     * Size to the file in bytes.
     */
    size?: number;
    /**
     * Identification of the file entity.
     */
    type?: fileTypedType;
};

