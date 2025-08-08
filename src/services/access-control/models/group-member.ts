/*---------------------------------------------------------------------------------------------
 * Copyright (c) Bentley Systems, Incorporated. All rights reserved.
 * See LICENSE.md in the project root for license terms and full copyright notice.
 *--------------------------------------------------------------------------------------------*/

import { Links } from "../../general-models/links.js";
import { Role } from "./role.js";

export interface GroupMemberInfo {
  groupDescription: string;
  groupName: string;
  id: string;
  roles: Role[];
}

export interface GroupMembersResponse {
  // eslint-disable-next-line @typescript-eslint/naming-convention
  _links: Links;
  members: GroupMemberInfo[];
}

export interface AddedGroupMembersResponse {
  members: GroupMemberInfo[];
}

export interface GroupMemberResponse {
  member: GroupMemberInfo;
}

export interface GroupMembersRequest {
  members: GroupMemberRoles[];
}

export interface GroupMemberRoles {
  groupId: string;
  roleIds: string[];
}
