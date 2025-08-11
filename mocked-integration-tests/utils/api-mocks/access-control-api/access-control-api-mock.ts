/*---------------------------------------------------------------------------------------------
 * Copyright (c) Bentley Systems, Incorporated. All rights reserved.
 * See LICENSE.md in the project root for license terms and full copyright notice.
 *--------------------------------------------------------------------------------------------*/

import nock from "nock";

import { GroupMember, GroupResponse, GroupsResponse } from "../../../../src/services/access-control/models/group";
import { Permissions } from "../../../../src/services/access-control/models/permissions.js";
import { RoleResponse, RolesResponse } from "../../../../src/services/access-control/models/role.js";
import { ErrorResponse } from "../../../../src/services/general-models/error-response";
import { ITP_API_URL } from "../../mock-environment";
import { AccessControlErrors } from "./access-control-errors";
import membersCases from "./access-control-members-cases";
import { AccessControlResponses } from "./access-control-responses";

export class AccessControlApiMock {
  public static members = membersCases;

  public static groups = {
    createiTwinGroup: {
      success: (iTwinId: string, name: string, description: string): GroupResponse => {
        const response = AccessControlResponses.groupResponse(crypto.randomUUID(), name, description);
        nock(ITP_API_URL).post(`/accesscontrol/itwins/${iTwinId}/groups`, { name, description }).reply(201, response);
        return response;
      },
      iTwinNotFound: (iTwinId: string, name: string, description: string): ErrorResponse => {
        const response = AccessControlErrors.iTwinNotFound;
        nock(ITP_API_URL).post(`/accesscontrol/itwins/${iTwinId}/groups`, { name, description }).reply(404, response);
        return response;
      },
    },
    deleteiTwinGroup: {
      success: (iTwinId: string, groupId: string): void => {
        nock(ITP_API_URL).delete(`/accesscontrol/itwins/${iTwinId}/groups/${groupId}`).reply(204);
      },
      iTwinNotFound: (iTwinId: string, groupId: string): ErrorResponse => {
        const response = AccessControlErrors.iTwinNotFound;
        nock(ITP_API_URL).delete(`/accesscontrol/itwins/${iTwinId}/groups/${groupId}`).reply(404, response);
        return response;
      },
      groupNotFound: (iTwinId: string, groupId: string): ErrorResponse => {
        const response = AccessControlErrors.groupNotFound;
        nock(ITP_API_URL).delete(`/accesscontrol/itwins/${iTwinId}/groups/${groupId}`).reply(404, response);
        return response;
      },
    },
    getiTwinGroup: {
      success: (iTwinId: string, groupId: string): GroupResponse => {
        const response = AccessControlResponses.groupResponse(crypto.randomUUID(), "Group Name", "Group Description");
        nock(ITP_API_URL).get(`/accesscontrol/itwins/${iTwinId}/groups/${groupId}`).reply(200, response);
        return response;
      },
      iTwinNotFound: (iTwinId: string, groupId: string): ErrorResponse => {
        const response = AccessControlErrors.iTwinNotFound;
        nock(ITP_API_URL).get(`/accesscontrol/itwins/${iTwinId}/groups/${groupId}`).reply(404, response);
        return response;
      },
      groupNotFound: (iTwinId: string, groupId: string): ErrorResponse => {
        const response = AccessControlErrors.groupNotFound;
        nock(ITP_API_URL).get(`/accesscontrol/itwins/${iTwinId}/groups/${groupId}`).reply(404, response);
        return response;
      },
    },
    getiTwinGroups: {
      success: (iTwinId: string, groupIds: string[]): GroupsResponse => {
        const response = AccessControlResponses.groupsResponse(groupIds);
        nock(ITP_API_URL).get(`/accesscontrol/itwins/${iTwinId}/groups`).reply(200, response);
        return response;
      },
      iTwinNotFound: (iTwinId: string): ErrorResponse => {
        const response = AccessControlErrors.iTwinNotFound;
        nock(ITP_API_URL).get(`/accesscontrol/itwins/${iTwinId}/groups`).reply(404, response);
        return response;
      },
    },
    updateiTwinGroup: {
      success: (iTwinId: string, groupId: string, name: string, description: string, members: GroupMember[], imsGroups: string[]): GroupResponse => {
        const request = JSON.stringify({ description, imsGroups, members: members.map((member) => member.email), name });
        const response = AccessControlResponses.groupResponse(crypto.randomUUID(), name, description, members, imsGroups);
        nock(ITP_API_URL).patch(`/accesscontrol/itwins/${iTwinId}/groups/${groupId}`, request).reply(200, response);
        return response;
      },
      iTwinNotFound: (iTwinId: string, groupId: string, name: string, description: string, members: GroupMember[], imsGroups: string[]): ErrorResponse => {
        const request = JSON.stringify({ description, imsGroups, members: members.map((member) => member.email), name });
        const response = AccessControlErrors.iTwinNotFound;
        nock(ITP_API_URL).patch(`/accesscontrol/itwins/${iTwinId}/groups/${groupId}`, request).reply(404, response);
        return response;
      },
      groupNotFound: (iTwinId: string, groupId: string, name: string, description: string, members: GroupMember[], imsGroups: string[]): ErrorResponse => {
        const request = JSON.stringify({ description, imsGroups, members: members.map((member) => member.email), name });
        const response = AccessControlErrors.groupNotFound;
        nock(ITP_API_URL).patch(`/accesscontrol/itwins/${iTwinId}/groups/${groupId}`, request).reply(404, response);
        return response;
      },
      teamMemberNotFound: (iTwinId: string, groupId: string, name: string, description: string, members: GroupMember[], imsGroups: string[]): ErrorResponse => {
        const request = JSON.stringify({ description, imsGroups, members: members.map((member) => member.email), name });
        const response = AccessControlErrors.teamMemberNotFound;
        nock(ITP_API_URL).patch(`/accesscontrol/itwins/${iTwinId}/groups/${groupId}`, request).reply(404, response);
        return response;
      },
      imsGroupNotFound: (iTwinId: string, groupId: string, name: string, description: string, members: GroupMember[], imsGroups: string[]): ErrorResponse => {
        const request = JSON.stringify({ description, imsGroups, members: members.map((member) => member.email), name });
        const response = AccessControlErrors.imsGroupNotFound;
        nock(ITP_API_URL).patch(`/accesscontrol/itwins/${iTwinId}/groups/${groupId}`, request).reply(404, response);
        return response;
      },
    },
  };

  public static permissions = {
    getAllPermissions: {
      success: (permissions: string[]): Permissions => {
        const response: Permissions = { permissions };
        nock(ITP_API_URL).get(`/accesscontrol/itwins/permissions`).reply(200, response);
        return response;
      },
    },
    getMyiTwinPermissions: {
      success: (iTwinId: string, permissions: string[]): Permissions => {
        const response: Permissions = { permissions };
        nock(ITP_API_URL).get(`/accesscontrol/itwins/${iTwinId}/permissions`).reply(200, response);
        return response;
      },
      iTwinNotFound: (iTwinId: string): ErrorResponse => {
        const response = AccessControlErrors.iTwinNotFound;
        nock(ITP_API_URL).get(`/accesscontrol/itwins/${iTwinId}/permissions`).reply(404, response);
        return response;
      },
    },
  };

  public static roles = {
    createiTwinRole: {
      success: (iTwinId: string, name: string, description: string): RoleResponse => {
        const response = AccessControlResponses.roleResponse(crypto.randomUUID(), name, description);
        nock(ITP_API_URL).post(`/accesscontrol/itwins/${iTwinId}/roles`, { displayName: name, description }).reply(201, response);
        return response;
      },
      iTwinNotFound: (iTwinId: string, name: string, description: string): ErrorResponse => {
        const response = AccessControlErrors.iTwinNotFound;
        nock(ITP_API_URL).post(`/accesscontrol/itwins/${iTwinId}/roles`, { displayName: name, description }).reply(404, response);
        return response;
      },
    },
    deleteiTwinRole: {
      success: (iTwinId: string, roleId: string): void => {
        nock(ITP_API_URL).delete(`/accesscontrol/itwins/${iTwinId}/roles/${roleId}`).reply(204);
      },
      iTwinNotFound: (iTwinId: string, roleId: string): ErrorResponse => {
        const response = AccessControlErrors.iTwinNotFound;
        nock(ITP_API_URL).delete(`/accesscontrol/itwins/${iTwinId}/roles/${roleId}`).reply(404, response);
        return response;
      },
      roleNotFound: (iTwinId: string, roleId: string): ErrorResponse => {
        const response = AccessControlErrors.roleNotFound;
        nock(ITP_API_URL).delete(`/accesscontrol/itwins/${iTwinId}/roles/${roleId}`).reply(404, response);
        return response;
      },
    },
    getiTwinRole: {
      success: (iTwinId: string, roleId: string): RoleResponse => {
        const response = AccessControlResponses.roleResponse(crypto.randomUUID(), "Role Name", "Role Description");
        nock(ITP_API_URL).get(`/accesscontrol/itwins/${iTwinId}/roles/${roleId}`).reply(200, response);
        return response;
      },
      iTwinNotFound: (iTwinId: string, roleId: string): ErrorResponse => {
        const response = AccessControlErrors.iTwinNotFound;
        nock(ITP_API_URL).get(`/accesscontrol/itwins/${iTwinId}/roles/${roleId}`).reply(404, response);
        return response;
      },
      roleNotFound: (iTwinId: string, roleId: string): ErrorResponse => {
        const response = AccessControlErrors.roleNotFound;
        nock(ITP_API_URL).get(`/accesscontrol/itwins/${iTwinId}/roles/${roleId}`).reply(404, response);
        return response;
      },
    },
    getiTwinRoles: {
      success: (iTwinId: string, roleIds: string[]): RolesResponse => {
        const response = AccessControlResponses.rolesResponse(roleIds);
        nock(ITP_API_URL).get(`/accesscontrol/itwins/${iTwinId}/roles`).reply(200, response);
        return response;
      },
      iTwinNotFound: (iTwinId: string): ErrorResponse => {
        const response = AccessControlErrors.iTwinNotFound;
        nock(ITP_API_URL).get(`/accesscontrol/itwins/${iTwinId}/roles`).reply(404, response);
        return response;
      },
    },
    updateiTwinRole: {
      success: (iTwinId: string, roleId: string, name: string, description: string, permissions: string[]): RoleResponse => {
        const response = AccessControlResponses.roleResponse(crypto.randomUUID(), name, description);
        nock(ITP_API_URL).patch(`/accesscontrol/itwins/${iTwinId}/roles/${roleId}`, { displayName: name, description, permissions }).reply(200, response);
        return response;
      },
      iTwinNotFound: (iTwinId: string, roleId: string, name: string, description: string, permissions: string[]): ErrorResponse => {
        const response = AccessControlErrors.iTwinNotFound;
        nock(ITP_API_URL).patch(`/accesscontrol/itwins/${iTwinId}/roles/${roleId}`, { displayName: name, description, permissions }).reply(404, response);
        return response;
      },
      roleNotFound: (iTwinId: string, roleId: string, name: string, description: string, permissions: string[]): ErrorResponse => {
        const response = AccessControlErrors.roleNotFound;
        nock(ITP_API_URL).patch(`/accesscontrol/itwins/${iTwinId}/roles/${roleId}`, { displayName: name, description, permissions }).reply(404, response);
        return response;
      },
      permissionNotFound: (iTwinId: string, roleId: string, name: string, description: string, permissions: string[]): ErrorResponse => {
        const response = AccessControlErrors.permissionNotFound;
        nock(ITP_API_URL).patch(`/accesscontrol/itwins/${iTwinId}/roles/${roleId}`, { displayName: name, description, permissions }).reply(404, response);
        return response;
      },
    },
  };
}
