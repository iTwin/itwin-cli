/*---------------------------------------------------------------------------------------------
 * Copyright (c) Bentley Systems, Incorporated. All rights reserved.
 * See LICENSE.md in the project root for license terms and full copyright notice.
 *--------------------------------------------------------------------------------------------*/

import nock from "nock";

import { MemberResponse, MembersListResponse, MembersResponse, UserMember } from "../../../../src/services/access-control/models/members";
import { OwnerListResponse, OwnerResponse } from "../../../../src/services/access-control/models/owner";
import { ErrorResponse } from "../../../../src/services/general-models/error-response";
import { ITP_API_URL } from "../../mock-environment";
import { AccessControlErrors } from "./access-control-errors";
import { AccessControlMembersResponses } from "./access-control-members-responses";

const membersCases = {
  addiTwinOwnerMember: {
    successInternal: (iTwinId: string, email: string): OwnerResponse => {
      const response = AccessControlMembersResponses.ownerResponse.internal(email);
      nock(ITP_API_URL).post(`/accesscontrol/itwins/${iTwinId}/members/owners`, { email }).reply(201, response);
      return response;
    },
    successExternal: (iTwinId: string, email: string): OwnerResponse => {
      const response = AccessControlMembersResponses.ownerResponse.external(email);
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
    success: (iTwinId: string): OwnerListResponse => {
      const response = AccessControlMembersResponses.ownerListResponse(iTwinId);
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
    successInternal: (iTwinId: string, userMembers: UserMember[]): MembersResponse => {
      const response = AccessControlMembersResponses.membersResponse.internal(userMembers);
      nock(ITP_API_URL)
        .post(`/accesscontrol/itwins/${iTwinId}/members/users`, JSON.stringify({ members: userMembers }))
        .reply(201, response);
      return response;
    },
    successExternal: (iTwinId: string, userMembers: UserMember[]): MembersResponse => {
      const response = AccessControlMembersResponses.membersResponse.external(userMembers);
      nock(ITP_API_URL)
        .post(`/accesscontrol/itwins/${iTwinId}/members/users`, JSON.stringify({ members: userMembers }))
        .reply(201, response);
      return response;
    },
    iTwinNotFound: (iTwinId: string, userMembers: UserMember[]): ErrorResponse => {
      const response = AccessControlErrors.iTwinNotFound;
      nock(ITP_API_URL)
        .post(`/accesscontrol/itwins/${iTwinId}/members/users`, JSON.stringify({ members: userMembers }))
        .reply(404, response);
      return response;
    },
    roleNotFound: (iTwinId: string, userMembers: UserMember[]): ErrorResponse => {
      const response = AccessControlErrors.roleNotFound;
      nock(ITP_API_URL)
        .post(`/accesscontrol/itwins/${iTwinId}/members/users`, JSON.stringify({ members: userMembers }))
        .reply(404, response);
      return response;
    },
  },
  getiTwinUserMember: {
    success: (iTwinId: string, memberId: string): MemberResponse => {
      const response = AccessControlMembersResponses.memberResponse(memberId, [crypto.randomUUID()]);
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
    success: (iTwinId: string): MembersListResponse => {
      const response = AccessControlMembersResponses.membersListResponse(iTwinId);
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
    success: (iTwinId: string, memberId: string, roleIds: string[]): MemberResponse => {
      const response = AccessControlMembersResponses.memberResponse(memberId, roleIds);
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
};

export default membersCases;
