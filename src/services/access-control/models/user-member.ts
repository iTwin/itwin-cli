/*---------------------------------------------------------------------------------------------
 * Copyright (c) Bentley Systems, Incorporated. All rights reserved.
 * See LICENSE.md in the project root for license terms and full copyright notice.
 *--------------------------------------------------------------------------------------------*/

import { Links } from "../../general-models/links.js";
import { Invitation } from "./invitations.js";
import { Role } from "./role.js";

export interface UserMembersRequest {
  members: UserMemberRoles[];
}

export interface UserMemberRoles {
  email: string;
  roleIds: string[];
}

export interface UserMember {
  email: string;
  givenName: string;
  id: string;
  organization: string;
  roles: Role[];
  surname: string;
}

export interface AddedUserMembersResponse {
  invitations: Invitation[] | null;
  members: UserMember[] | null;
}

export interface UserMemberListResponse {
  // eslint-disable-next-line @typescript-eslint/naming-convention
  _links: Links;
  members: UserMember[];
}

export interface UserMemberResponse {
  member: UserMember;
}
