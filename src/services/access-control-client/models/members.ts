/*---------------------------------------------------------------------------------------------
* Copyright (c) Bentley Systems, Incorporated. All rights reserved.
* See LICENSE.md in the project root for license terms and full copyright notice.
*--------------------------------------------------------------------------------------------*/

import { links } from "../../general-models/links.js"
import { invitation } from "./invitations.js"
import { Role } from "./role.js"

export type listOfMembers = {
    members: UserMember[]
}

export type UserMember = {
    email: string
    roleIds: string[]
}

export type member = {
    email: string
    givenName: string
    id: string
    organization: string
    roles: Role[]
    surname: string
}

export type membersResponse = {
    invitations: invitation[]
    members: member[],
}

export type membersListResponse = {
    _links: links
    members: member[],
}

export type memberResponse = {
    member: member
}