/*---------------------------------------------------------------------------------------------
* Copyright (c) Bentley Systems, Incorporated. All rights reserved.
* See LICENSE.md in the project root for license terms and full copyright notice.
*--------------------------------------------------------------------------------------------*/

import { Link } from "../../general-models/links.js";

export interface LinksItem {
    createdBy?: Link;
    lastModifiedBy?: Link;
    parentFolder?: Link;
}
