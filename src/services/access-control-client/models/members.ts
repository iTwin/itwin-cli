/*---------------------------------------------------------------------------------------------
* Copyright (c) Bentley Systems, Incorporated. All rights reserved.
* See LICENSE.md in the project root for license terms and full copyright notice.
*--------------------------------------------------------------------------------------------*/

import { Links } from "../../general-models/links.js"
import { Invitation } from "./invitations.js"
import { Role } from "./role.js"

export type ListOfMembers = {
    members: UserMember[]
}

export type UserMember = {
    email: string
    roleIds: string[]
}

export type Member = {
    email: string
    givenName: string
    id: string
    organization: string
    roles: Role[]
    surname: string
}

export type MembersResponse = {
    invitations: Invitation[]
    members: Member[],
}

export type MembersListResponse = {
    _links: Links
    members: Member[],
}

export type MemberResponse = {
    member: Member
}