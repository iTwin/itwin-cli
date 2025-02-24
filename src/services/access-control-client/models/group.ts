/*---------------------------------------------------------------------------------------------
* Copyright (c) Bentley Systems, Incorporated. All rights reserved.
* See LICENSE.md in the project root for license terms and full copyright notice.
*--------------------------------------------------------------------------------------------*/

import { links } from "../../general-models/links.js"
import { Role } from "./role.js"

export type group = {
    description?: string,
    id?: string,
    imsGroups?: string[]
    members?: GroupUser[],
    name?: string,
}

export type GroupUser = {
    email: string,
    givenName: string,
    organization: string
    surname: string,
    userId: string,
}

export type groupUpdate = {
    description?: string,
    imsGroups?: string[]
    members?: string[],
    name?: string,
}

export type GroupResponse = {
    group: group
}

export type GroupsResponse = {
    groups: group[]
}

export type GroupMember = {
    groupId: string,
    roleIds: string[]
}

export type GroupMembersRequest = {
    members: GroupMember[]
}

export type GroupMembersResponse = {
    _links: links
    members: GroupMemberInfo[]
}

export type GroupMemberResponse = {
    member: GroupMemberInfo
}

export type GroupMemberInfo = {
    groupDescription: string,
    groupName: string,
    id: string,
    roles: Role[]
}

