/*---------------------------------------------------------------------------------------------
 * Copyright (c) Bentley Systems, Incorporated. All rights reserved.
 * See LICENSE.md in the project root for license terms and full copyright notice.
 *--------------------------------------------------------------------------------------------*/

import { ITwinPlatformApiClient } from "../iTwin-api-client.js";
import { Group, GroupResponse, GroupsResponse, GroupUpdate } from "./models/group.js";
import { Permissions } from "./models/permissions.js";
import { Role, RoleResponse, RolesResponse } from "./models/role.js";

export class AccessControlClient {
  private _apiVersionHeader = "application/vnd.bentley.itwin-platform.v2+json";
  private _iTwinPlatformApiClient: ITwinPlatformApiClient;

  constructor(apiUrl: string, authToken: string) {
    this._iTwinPlatformApiClient = new ITwinPlatformApiClient(apiUrl, authToken, this._apiVersionHeader);
  }

  public async createGroup(iTwinId: string, group: Group): Promise<GroupResponse> {
    return this._iTwinPlatformApiClient.sendRequest({
      apiPath: `accesscontrol/itwins/${iTwinId}/groups`,
      body: group,
      method: "POST",
    });
  }

  public async createiTwinRole(iTwinId: string, role: Role): Promise<RoleResponse> {
    return this._iTwinPlatformApiClient.sendRequest({
      apiPath: `accesscontrol/itwins/${iTwinId}/roles`,
      body: role,
      method: "POST",
    });
  }

  public async deleteGroup(iTwinId: string, groupId: string): Promise<void> {
    await this._iTwinPlatformApiClient.sendRequestNoResponse({
      apiPath: `accesscontrol/itwins/${iTwinId}/groups/${groupId}`,
      method: "DELETE",
    });
  }

  public async deleteiTwinRole(iTwinId: string, roleId: string): Promise<void> {
    await this._iTwinPlatformApiClient.sendRequestNoResponse({
      apiPath: `accesscontrol/itwins/${iTwinId}/roles/${roleId}`,
      method: "DELETE",
    });
  }

  public async getAllAvailableiTwinPermissions(): Promise<Permissions> {
    return this._iTwinPlatformApiClient.sendRequest({
      apiPath: `accesscontrol/itwins/permissions`,
      method: "GET",
    });
  }

  public async getAlliTwinPermissions(iTwinId: string): Promise<Permissions> {
    return this._iTwinPlatformApiClient.sendRequest({
      apiPath: `accesscontrol/itwins/${iTwinId}/permissions`,
      method: "GET",
    });
  }

  public async getGroup(iTwinId: string, groupId: string): Promise<GroupResponse> {
    return this._iTwinPlatformApiClient.sendRequest({
      apiPath: `accesscontrol/itwins/${iTwinId}/groups/${groupId}`,
      method: "GET",
    });
  }

  public async getGroups(iTwinId: string): Promise<GroupsResponse> {
    return this._iTwinPlatformApiClient.sendRequest({
      apiPath: `accesscontrol/itwins/${iTwinId}/groups`,
      method: "GET",
    });
  }

  public async getiTwinRole(iTwinId: string, roleId: string): Promise<RoleResponse> {
    return this._iTwinPlatformApiClient.sendRequest({
      apiPath: `accesscontrol/itwins/${iTwinId}/roles/${roleId}`,
      method: "GET",
    });
  }

  public async getiTwinRoles(iTwinId: string): Promise<RolesResponse> {
    return this._iTwinPlatformApiClient.sendRequest({
      apiPath: `accesscontrol/itwins/${iTwinId}/roles`,
      method: "GET",
    });
  }

  public async updateGroup(iTwinId: string, groupId: string, group: GroupUpdate): Promise<GroupResponse> {
    return this._iTwinPlatformApiClient.sendRequest({
      apiPath: `accesscontrol/itwins/${iTwinId}/groups/${groupId}`,
      body: group,
      method: "PATCH",
    });
  }

  public async updateiTwinRole(iTwinId: string, roleId: string, role: Role): Promise<RoleResponse> {
    return this._iTwinPlatformApiClient.sendRequest({
      apiPath: `accesscontrol/itwins/${iTwinId}/roles/${roleId}`,
      body: role,
      method: "PATCH",
    });
  }
}
