/*---------------------------------------------------------------------------------------------
 * Copyright (c) Bentley Systems, Incorporated. All rights reserved.
 * See LICENSE.md in the project root for license terms and full copyright notice.
 *--------------------------------------------------------------------------------------------*/

export interface Group {
  description?: string;
  id?: string;
  imsGroups?: string[];
  members?: GroupMember[];
  name?: string;
}

export interface GroupMember {
  email: string;
  givenName: string;
  organization: string;
  surname: string;
  userId: string;
}

export interface GroupUpdate {
  description?: string;
  imsGroups?: string[];
  members?: string[];
  name?: string;
}

export interface GroupResponse {
  group: Group;
}

export interface GroupsResponse {
  groups: Group[];
}
