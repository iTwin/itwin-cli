/*---------------------------------------------------------------------------------------------
 * Copyright (c) Bentley Systems, Incorporated. All rights reserved.
 * See LICENSE.md in the project root for license terms and full copyright notice.
 *--------------------------------------------------------------------------------------------*/

import { Links } from "../../general-models/links.js";
import { Invitation } from "./invitations.js";
import { Role } from "./role.js";

export interface ListOfMembers {
  members: UserMember[];
}

export interface UserMember {
  email: string;
  roleIds: string[];
}

export interface Member {
  email: string;
  givenName: string;
  id: string;
  organization: string;
  roles: Role[];
  surname: string;
}

export interface MembersResponse {
  invitations: Invitation[] | null;
  members: Member[] | null;
}

export interface MembersListResponse {
  // eslint-disable-next-line @typescript-eslint/naming-convention
  _links: Links;
  members: Member[];
}

export interface MemberResponse {
  member: Member;
}
