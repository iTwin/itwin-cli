/*---------------------------------------------------------------------------------------------
* Copyright (c) Bentley Systems, Incorporated. All rights reserved.
* See LICENSE.md in the project root for license terms and full copyright notice.
*--------------------------------------------------------------------------------------------*/

import { link } from "../../general-models/links.js";

export type linksPagingWithFolderLink = {
    folder?: link;
    next?: link;
    prev?: link;
    self?: link;
};

