/*---------------------------------------------------------------------------------------------
* Copyright (c) Bentley Systems, Incorporated. All rights reserved.
* See LICENSE.md in the project root for license terms and full copyright notice.
*--------------------------------------------------------------------------------------------*/

import { Links } from "../../general-models/links.js";
import { Role } from "./role.js";

export interface Group {
    description?: string,
    id?: string,
    imsGroups?: string[]
    members?: GroupUser[],
    name?: string,
}

export interface GroupUser {
    email: string,
    givenName: string,
    organization: string
    surname: string,
    userId: string,
}

export interface GroupUpdate {
    description?: string,
    imsGroups?: string[]
    members?: string[],
    name?: string,
}

export interface GroupResponse {
    group: Group
}

export interface GroupsResponse {
    groups: Group[]
}

export interface GroupMember {
    groupId: string,
    roleIds: string[]
}

export interface GroupMembersRequest {
    members: GroupMember[]
}

export interface GroupMembersResponse {
    // eslint-disable-next-line @typescript-eslint/naming-convention
    _links: Links
    members: GroupMemberInfo[]
}

export interface GroupMemberResponse {
    member: GroupMemberInfo
}

export interface GroupMemberInfo {
    groupDescription: string,
    groupName: string,
    id: string,
    roles: Role[]
}

