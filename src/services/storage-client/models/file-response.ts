/*---------------------------------------------------------------------------------------------
* Copyright (c) Bentley Systems, Incorporated. All rights reserved.
* See LICENSE.md in the project root for license terms and full copyright notice.
*--------------------------------------------------------------------------------------------*/

import { links } from "../../general-models/links.js";
import { fileTyped } from "./file-typed.js";

export type fileResponse = {
    file?: fileTyped;
};

export type filesResponse = {
    files: fileTyped[];
}

export type itemsResponse = {
    _links: links
    items: fileTyped[];
}
