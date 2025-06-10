/*---------------------------------------------------------------------------------------------
* Copyright (c) Bentley Systems, Incorporated. All rights reserved.
* See LICENSE.md in the project root for license terms and full copyright notice.
*--------------------------------------------------------------------------------------------*/

import { Links } from "../../general-models/links.js";
import { GroupMember } from "./group-members.js";
import { Invitation } from "./invitations.js";

export interface OwnerResponse {
  invitation: Invitation
  member: GroupMember,
}

export interface OwnerListResponse {
  // eslint-disable-next-line @typescript-eslint/naming-convention
  _links: Links
  members: GroupMember[],
}