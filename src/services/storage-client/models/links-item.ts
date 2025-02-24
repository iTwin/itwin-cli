/*---------------------------------------------------------------------------------------------
* Copyright (c) Bentley Systems, Incorporated. All rights reserved.
* See LICENSE.md in the project root for license terms and full copyright notice.
*--------------------------------------------------------------------------------------------*/

import { link } from "../../general-models/links.js";

export type linksItem = {
    createdBy?: link;
    lastModifiedBy?: link;
    parentFolder?: link;
};
