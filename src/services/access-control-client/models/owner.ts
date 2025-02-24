/*---------------------------------------------------------------------------------------------
* Copyright (c) Bentley Systems, Incorporated. All rights reserved.
* See LICENSE.md in the project root for license terms and full copyright notice.
*--------------------------------------------------------------------------------------------*/

import { links } from "../../general-models/links.js"
import { groupMember } from "./group-members.js"
import { invitation } from "./invitations.js"

export type ownerResponse = {
    invitation: invitation
    member: groupMember,
}

export type ownerListRepsonse = {
    _links: links
    members: groupMember[],
}