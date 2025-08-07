/*---------------------------------------------------------------------------------------------
 * Copyright (c) Bentley Systems, Incorporated. All rights reserved.
 * See LICENSE.md in the project root for license terms and full copyright notice.
 *--------------------------------------------------------------------------------------------*/

import { Links } from "../../general-models/links.js";
import { Invitation } from "./invitations.js";

export interface OwnerMemberResponse {
  invitation: Invitation | null;
  member: OwnerMember | null;
}

export interface OwnerMemberListResponse {
  // eslint-disable-next-line @typescript-eslint/naming-convention
  _links: Links;
  members: OwnerMember[];
}

export interface OwnerMember {
  email: string;
  givenName: string;
  id: string;
  organization: string;
  surname: string;
}
