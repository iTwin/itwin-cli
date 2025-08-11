/*---------------------------------------------------------------------------------------------
 * Copyright (c) Bentley Systems, Incorporated. All rights reserved.
 * See LICENSE.md in the project root for license terms and full copyright notice.
 *--------------------------------------------------------------------------------------------*/

import nock from "nock";

import {
  AddedGroupMembersResponse,
  GroupMemberResponse,
  GroupMemberRoles,
  GroupMembersResponse,
} from "../../../../src/services/access-control/models/group-member";
import { OwnerMemberListResponse, OwnerMemberResponse } from "../../../../src/services/access-control/models/owner-member";
// prettier-ignore
import {
    AddedUserMembersResponse, UserMemberListResponse, UserMemberResponse, UserMemberRoles
} from "../../../../src/services/access-control/models/user-member";
import { ErrorResponse } from "../../../../src/services/general-models/error-response";
import { ITP_API_URL } from "../../mock-environment";
import { AccessControlErrors } from "./access-control-errors";
import { AccessControlMembersResponses } from "./access-control-members-responses";

const membersCases = {
  addiTwinOwnerMember: {
    successInternal: (iTwinId: string, email: string): OwnerMemberResponse => {
      const response = AccessControlMembersResponses.ownerMemberResponse.internal(email);
      nock(ITP_API_URL).post(`/accesscontrol/itwins/${iTwinId}/members/owners`, { email }).reply(201, response);
      return response;
    },
    successExternal: (iTwinId: string, email: string): OwnerMemberResponse => {
      const response = AccessControlMembersResponses.ownerMemberResponse.external(email);
      nock(ITP_API_URL).post(`/accesscontrol/itwins/${iTwinId}/members/owners`, { email }).reply(201, response);
      return response;
    },
    iTwinNotFound: (iTwinId: string, email: string): ErrorResponse => {
      const response = AccessControlErrors.iTwinNotFound;
      nock(ITP_API_URL).post(`/accesscontrol/itwins/${iTwinId}/members/owners`, { email }).reply(404, response);
      return response;
    },
    ownerAlreadyExists: (iTwinId: string, email: string): ErrorResponse => {
      const response = AccessControlErrors.ownerAlreadyExists;
      nock(ITP_API_URL).post(`/accesscontrol/itwins/${iTwinId}/members/owners`, { email }).reply(409, response);
      return response;
    },
  },
  getiTwinOwnerMembers: {
    success: (iTwinId: string): OwnerMemberListResponse => {
      const response = AccessControlMembersResponses.ownerMemberListResponse(iTwinId);
      nock(ITP_API_URL).get(`/accesscontrol/itwins/${iTwinId}/members/owners`).reply(201, response);
      return response;
    },
    iTwinNotFound: (iTwinId: string): ErrorResponse => {
      const response = AccessControlErrors.iTwinNotFound;
      nock(ITP_API_URL).get(`/accesscontrol/itwins/${iTwinId}/members/owners`).reply(404, response);
      return response;
    },
  },
  removeiTwinOwnerMember: {
    success: (iTwinId: string, memberId: string): void => {
      nock(ITP_API_URL).delete(`/accesscontrol/itwins/${iTwinId}/members/owners/${memberId}`).reply(204);
    },
    iTwinNotFound: (iTwinId: string, memberId: string): ErrorResponse => {
      const response = AccessControlErrors.iTwinNotFound;
      nock(ITP_API_URL).delete(`/accesscontrol/itwins/${iTwinId}/members/owners/${memberId}`).reply(404, response);
      return response;
    },
    memberNotFound: (iTwinId: string, memberId: string): ErrorResponse => {
      const response = AccessControlErrors.teamMemberNotFound;
      nock(ITP_API_URL).delete(`/accesscontrol/itwins/${iTwinId}/members/owners/${memberId}`).reply(404, response);
      return response;
    },
  },

  addiTwinUserMembers: {
    successInternal: (iTwinId: string, userMembers: UserMemberRoles[]): AddedUserMembersResponse => {
      const response = AccessControlMembersResponses.addedUserMembersResponse.internal(userMembers);
      nock(ITP_API_URL)
        .post(`/accesscontrol/itwins/${iTwinId}/members/users`, JSON.stringify({ members: userMembers }))
        .reply(201, response);
      return response;
    },
    successExternal: (iTwinId: string, userMembers: UserMemberRoles[]): AddedUserMembersResponse => {
      const response = AccessControlMembersResponses.addedUserMembersResponse.external(userMembers);
      nock(ITP_API_URL)
        .post(`/accesscontrol/itwins/${iTwinId}/members/users`, JSON.stringify({ members: userMembers }))
        .reply(201, response);
      return response;
    },
    iTwinNotFound: (iTwinId: string, userMembers: UserMemberRoles[]): ErrorResponse => {
      const response = AccessControlErrors.iTwinNotFound;
      nock(ITP_API_URL)
        .post(`/accesscontrol/itwins/${iTwinId}/members/users`, JSON.stringify({ members: userMembers }))
        .reply(404, response);
      return response;
    },
    roleNotFound: (iTwinId: string, userMembers: UserMemberRoles[]): ErrorResponse => {
      const response = AccessControlErrors.roleNotFound;
      nock(ITP_API_URL)
        .post(`/accesscontrol/itwins/${iTwinId}/members/users`, JSON.stringify({ members: userMembers }))
        .reply(404, response);
      return response;
    },
  },
  getiTwinUserMember: {
    success: (iTwinId: string, memberId: string): UserMemberResponse => {
      const response = AccessControlMembersResponses.userMemberResponse(memberId, [crypto.randomUUID()]);
      nock(ITP_API_URL).get(`/accesscontrol/itwins/${iTwinId}/members/users/${memberId}`).reply(200, response);
      return response;
    },
    iTwinNotFound: (iTwinId: string, memberId: string): ErrorResponse => {
      const response = AccessControlErrors.iTwinNotFound;
      nock(ITP_API_URL).get(`/accesscontrol/itwins/${iTwinId}/members/users/${memberId}`).reply(404, response);
      return response;
    },
    teamMemberNotFound: (iTwinId: string, memberId: string): ErrorResponse => {
      const response = AccessControlErrors.teamMemberNotFound;
      nock(ITP_API_URL).get(`/accesscontrol/itwins/${iTwinId}/members/users/${memberId}`).reply(404, response);
      return response;
    },
  },
  getiTwinUserMembers: {
    success: (iTwinId: string): UserMemberListResponse => {
      const response = AccessControlMembersResponses.userMemberListResponse(iTwinId);
      nock(ITP_API_URL).get(`/accesscontrol/itwins/${iTwinId}/members/users`).reply(200, response);
      return response;
    },
    iTwinNotFound: (iTwinId: string): ErrorResponse => {
      const response = AccessControlErrors.iTwinNotFound;
      nock(ITP_API_URL).get(`/accesscontrol/itwins/${iTwinId}/members/users`).reply(404, response);
      return response;
    },
  },
  updateiTwinUserMember: {
    success: (iTwinId: string, memberId: string, roleIds: string[]): UserMemberResponse => {
      const response = AccessControlMembersResponses.userMemberResponse(memberId, roleIds);
      nock(ITP_API_URL).patch(`/accesscontrol/itwins/${iTwinId}/members/users/${memberId}`, { roleIds }).reply(200, response);
      return response;
    },
    iTwinNotFound: (iTwinId: string, memberId: string, roleIds: string[]): ErrorResponse => {
      const response = AccessControlErrors.iTwinNotFound;
      nock(ITP_API_URL).patch(`/accesscontrol/itwins/${iTwinId}/members/users/${memberId}`, { roleIds }).reply(404, response);
      return response;
    },
    teamMemberFound: (iTwinId: string, memberId: string, roleIds: string[]): ErrorResponse => {
      const response = AccessControlErrors.teamMemberNotFound;
      nock(ITP_API_URL).patch(`/accesscontrol/itwins/${iTwinId}/members/users/${memberId}`, { roleIds }).reply(404, response);
      return response;
    },
    roleNotFound: (iTwinId: string, memberId: string, roleIds: string[]): ErrorResponse => {
      const response = AccessControlErrors.roleNotFound;
      nock(ITP_API_URL).patch(`/accesscontrol/itwins/${iTwinId}/members/users/${memberId}`, { roleIds }).reply(404, response);
      return response;
    },
  },
  removeiTwinUserMember: {
    success: (iTwinId: string, memberId: string): void => {
      nock(ITP_API_URL).delete(`/accesscontrol/itwins/${iTwinId}/members/users/${memberId}`).reply(204);
    },
    iTwinNotFound: (iTwinId: string, memberId: string): ErrorResponse => {
      const response = AccessControlErrors.iTwinNotFound;
      nock(ITP_API_URL).delete(`/accesscontrol/itwins/${iTwinId}/members/users/${memberId}`).reply(404, response);
      return response;
    },
    memberNotFound: (iTwinId: string, memberId: string): ErrorResponse => {
      const response = AccessControlErrors.teamMemberNotFound;
      nock(ITP_API_URL).delete(`/accesscontrol/itwins/${iTwinId}/members/users/${memberId}`).reply(404, response);
      return response;
    },
  },

  addiTwinGroupMembers: {
    success: (iTwinId: string, groupMembers: GroupMemberRoles[]): AddedGroupMembersResponse => {
      const response = AccessControlMembersResponses.addedGroupMembersResponse(groupMembers);
      nock(ITP_API_URL)
        .post(`/accesscontrol/itwins/${iTwinId}/members/groups`, JSON.stringify({ members: groupMembers }))
        .reply(201, response);
      return response;
    },
    iTwinNotFound: (iTwinId: string, groupMembers: GroupMemberRoles[]): ErrorResponse => {
      const response = AccessControlErrors.iTwinNotFound;
      nock(ITP_API_URL)
        .post(`/accesscontrol/itwins/${iTwinId}/members/groups`, JSON.stringify({ members: groupMembers }))
        .reply(404, response);
      return response;
    },
    roleNotFound: (iTwinId: string, groupMembers: GroupMemberRoles[]): ErrorResponse => {
      const response = AccessControlErrors.roleNotFound;
      nock(ITP_API_URL)
        .post(`/accesscontrol/itwins/${iTwinId}/members/groups`, JSON.stringify({ members: groupMembers }))
        .reply(404, response);
      return response;
    },
    teamMemberNotFound: (iTwinId: string, groupMembers: GroupMemberRoles[]): ErrorResponse => {
      const response = AccessControlErrors.teamMemberNotFound;
      nock(ITP_API_URL)
        .post(`/accesscontrol/itwins/${iTwinId}/members/groups`, JSON.stringify({ members: groupMembers }))
        .reply(404, response);
      return response;
    },
  },
  getiTwinGroupMember: {
    success: (iTwinId: string, groupId: string): GroupMemberResponse => {
      const response = AccessControlMembersResponses.groupMemberResponse(groupId, [crypto.randomUUID()]);
      nock(ITP_API_URL).get(`/accesscontrol/itwins/${iTwinId}/members/groups/${groupId}`).reply(200, response);
      return response;
    },
    iTwinNotFound: (iTwinId: string, groupId: string): ErrorResponse => {
      const response = AccessControlErrors.iTwinNotFound;
      nock(ITP_API_URL).get(`/accesscontrol/itwins/${iTwinId}/members/groups/${groupId}`).reply(404, response);
      return response;
    },
    teamMemberNotFound: (iTwinId: string, groupId: string): ErrorResponse => {
      const response = AccessControlErrors.teamMemberNotFound;
      nock(ITP_API_URL).get(`/accesscontrol/itwins/${iTwinId}/members/groups/${groupId}`).reply(404, response);
      return response;
    },
  },
  getiTwinGroupMembers: {
    success: (iTwinId: string): GroupMembersResponse => {
      const response = AccessControlMembersResponses.groupMembersResponse([crypto.randomUUID(), crypto.randomUUID(), crypto.randomUUID()]);
      nock(ITP_API_URL).get(`/accesscontrol/itwins/${iTwinId}/members/groups`).reply(200, response);
      return response;
    },
    iTwinNotFound: (iTwinId: string): ErrorResponse => {
      const response = AccessControlErrors.iTwinNotFound;
      nock(ITP_API_URL).get(`/accesscontrol/itwins/${iTwinId}/members/groups`).reply(404, response);
      return response;
    },
  },
  updateiTwinGroupMember: {
    success: (iTwinId: string, groupId: string, roleIds: string[]): GroupMemberResponse => {
      const response = AccessControlMembersResponses.groupMemberResponse(groupId, roleIds);
      nock(ITP_API_URL).patch(`/accesscontrol/itwins/${iTwinId}/members/groups/${groupId}`, { roleIds }).reply(200, response);
      return response;
    },
    iTwinNotFound: (iTwinId: string, groupId: string, roleIds: string[]): ErrorResponse => {
      const response = AccessControlErrors.iTwinNotFound;
      nock(ITP_API_URL).patch(`/accesscontrol/itwins/${iTwinId}/members/groups/${groupId}`, { roleIds }).reply(404, response);
      return response;
    },
    teamMemberFound: (iTwinId: string, groupId: string, roleIds: string[]): ErrorResponse => {
      const response = AccessControlErrors.teamMemberNotFound;
      nock(ITP_API_URL).patch(`/accesscontrol/itwins/${iTwinId}/members/groups/${groupId}`, { roleIds }).reply(404, response);
      return response;
    },
    roleNotFound: (iTwinId: string, groupId: string, roleIds: string[]): ErrorResponse => {
      const response = AccessControlErrors.roleNotFound;
      nock(ITP_API_URL).patch(`/accesscontrol/itwins/${iTwinId}/members/groups/${groupId}`, { roleIds }).reply(404, response);
      return response;
    },
  },
  removeiTwinGroupMember: {
    success: (iTwinId: string, groupId: string): void => {
      nock(ITP_API_URL).delete(`/accesscontrol/itwins/${iTwinId}/members/groups/${groupId}`).reply(204);
    },
    iTwinNotFound: (iTwinId: string, groupId: string): ErrorResponse => {
      const response = AccessControlErrors.iTwinNotFound;
      nock(ITP_API_URL).delete(`/accesscontrol/itwins/${iTwinId}/members/groups/${groupId}`).reply(404, response);
      return response;
    },
    teamMemberNotFound: (iTwinId: string, groupId: string): ErrorResponse => {
      const response = AccessControlErrors.teamMemberNotFound;
      nock(ITP_API_URL).delete(`/accesscontrol/itwins/${iTwinId}/members/groups/${groupId}`).reply(404, response);
      return response;
    },
  },
};

export default membersCases;
