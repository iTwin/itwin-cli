/*---------------------------------------------------------------------------------------------
* Copyright (c) Bentley Systems, Incorporated. All rights reserved.
* See LICENSE.md in the project root for license terms and full copyright notice.
*--------------------------------------------------------------------------------------------*/

import { Link } from "../../general-models/links.js";

export interface LinksPagingWithFolderLink {
    folder?: Link;
    next?: Link;
    prev?: Link;
    self?: Link;
}

