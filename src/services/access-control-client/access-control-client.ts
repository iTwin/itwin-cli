/*---------------------------------------------------------------------------------------------
* Copyright (c) Bentley Systems, Incorporated. All rights reserved.
* See LICENSE.md in the project root for license terms and full copyright notice.
*--------------------------------------------------------------------------------------------*/

import { ITwinPlatformApiClient } from "../iTwin-api-client.js";
import { GroupResponse, GroupsResponse, group, groupUpdate } from "./models/group.js";
import { permissions } from "./models/permissions.js";
import { Role, RoleResponse, RolesResponse } from "./models/role.js";

export class AccessControlClient {
    apiVersionHeader = 'application/vnd.bentley.itwin-platform.v2+json';
    iTwinPlatformApiClient: ITwinPlatformApiClient;

    constructor(apiUrl: string, authToken: string) {
        this.iTwinPlatformApiClient = new ITwinPlatformApiClient(apiUrl, authToken, this.apiVersionHeader);
    }

    createGroup(iTwinId: string, group: group): Promise<GroupResponse> {
        return this.iTwinPlatformApiClient.sendRequest({
            apiPath: `accesscontrol/itwins/${iTwinId}/groups`,
            body: group,
            method: 'POST'
        });
    }

    createiTwinRole(iTwinId: string, role: Role): Promise<RoleResponse> {
        return this.iTwinPlatformApiClient.sendRequest({
            apiPath: `accesscontrol/itwins/${iTwinId}/roles`,
            body: role,
            method: 'POST'
        });
    }

    async deleteGroup(iTwinId: string, groupId: string): Promise<void> {
        await this.iTwinPlatformApiClient.sendRequestNoResponse({
            apiPath: `accesscontrol/itwins/${iTwinId}/groups/${groupId}`,
            method: 'DELETE'
        });
    }

    async deleteiTwinRole(iTwinId: string, roleId: string): Promise<void> {
        await this.iTwinPlatformApiClient.sendRequestNoResponse({
            apiPath: `accesscontrol/itwins/${iTwinId}/roles/${roleId}`,
            method: 'DELETE'
        });
    }

    getAllAvailableiTwinPermissions(): Promise<permissions> {
        return this.iTwinPlatformApiClient.sendRequest({
            apiPath: `accesscontrol/itwins/permissions`,
            method: 'GET'
        });
    }

    getAlliTwinPermissions(iTwinId: string): Promise<permissions> {
        return this.iTwinPlatformApiClient.sendRequest({
            apiPath: `accesscontrol/itwins/${iTwinId}/permissions`,
            method: 'GET'
        });
    }

    getGroup(iTwinId: string, groupId: string): Promise<GroupResponse> {
        return this.iTwinPlatformApiClient.sendRequest({
            apiPath: `accesscontrol/itwins/${iTwinId}/groups/${groupId}`,
            method: 'GET'
        });
    }

    getGroups(iTwinId: string): Promise<GroupsResponse> {
        return this.iTwinPlatformApiClient.sendRequest({
            apiPath: `accesscontrol/itwins/${iTwinId}/groups`,
            method: 'GET'
        });
    }

    getiTwinRole(iTwinId: string, roleId: string): Promise<RoleResponse> {
        return this.iTwinPlatformApiClient.sendRequest({
            apiPath: `accesscontrol/itwins/${iTwinId}/roles/${roleId}`,
            method: 'GET'
        });
    }

    getiTwinRoles(iTwinId: string): Promise<RolesResponse> {
        return this.iTwinPlatformApiClient.sendRequest({
            apiPath: `accesscontrol/itwins/${iTwinId}/roles`,
            method: 'GET'
        });
    }

    updateGroup(iTwinId: string, groupId: string, group: groupUpdate): Promise<GroupResponse> {
        return this.iTwinPlatformApiClient.sendRequest({
            apiPath: `accesscontrol/itwins/${iTwinId}/groups/${groupId}`,
            body: group,
            method: 'PATCH'
        });
    }

    updateiTwinRole(iTwinId: string, roleId: string, role: Role): Promise<RoleResponse> {
        return this.iTwinPlatformApiClient.sendRequest({
            apiPath: `accesscontrol/itwins/${iTwinId}/roles/${roleId}`,
            body: role,
            method: 'PATCH'
        });
    }
}
