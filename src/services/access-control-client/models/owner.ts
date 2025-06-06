/*---------------------------------------------------------------------------------------------
* Copyright (c) Bentley Systems, Incorporated. All rights reserved.
* See LICENSE.md in the project root for license terms and full copyright notice.
*--------------------------------------------------------------------------------------------*/

import { Links } from "../../general-models/links.js"
import { GroupMember } from "./group-members.js"
import { Invitation } from "./invitations.js"

export type OwnerResponse = {
    invitation: Invitation
    member: GroupMember,
}

export type OwnerListResponse = {
    _links: Links
    members: GroupMember[],
}