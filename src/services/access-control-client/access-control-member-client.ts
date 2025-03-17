/*---------------------------------------------------------------------------------------------
* Copyright (c) Bentley Systems, Incorporated. All rights reserved.
* See LICENSE.md in the project root for license terms and full copyright notice.
*--------------------------------------------------------------------------------------------*/

import { ITwinPlatformApiClient, Query } from "../iTwin-api-client.js";
import { GroupMemberResponse, GroupMembersRequest, GroupMembersResponse } from "./models/group.js";
import { invitationsResponse } from "./models/invitations.js";
import { listOfMembers, memberResponse, membersListResponse, membersResponse } from "./models/members.js";
import { ownerListRepsonse, ownerResponse } from "./models/owner.js";

export class AccessControlMemberClient {
    apiVersionHeader = 'application/vnd.bentley.itwin-platform.v2+json';
    iTwinPlatformApiClient: ITwinPlatformApiClient;

    constructor(apiUrl: string, accessToken: string) {
        this.iTwinPlatformApiClient = new ITwinPlatformApiClient(apiUrl, accessToken, this.apiVersionHeader);
    }

    async addGroupMember(iTwinId: string, groups: GroupMembersRequest): Promise<GroupMembersResponse> {
        return this.iTwinPlatformApiClient.sendRequest({
            apiPath: `accesscontrol/itwins/${iTwinId}/members/groups`,
            body: groups,
            method: 'POST'
        });
    }

    async addOwner(iTwinId: string, email: string): Promise<ownerResponse> {
        return this.iTwinPlatformApiClient.sendRequest({
            apiPath: `accesscontrol/itwins/${iTwinId}/members/owners`,
            body: {
                email
            },
            method: 'POST'
        });
    }

    async addUserMembers(iTwinId: string, members: listOfMembers): Promise<membersResponse> {
        return this.iTwinPlatformApiClient.sendRequest({
            apiPath: `accesscontrol/itwins/${iTwinId}/members/users`,
            body: members,
            method: 'POST'
        });
    }

    async deleteGroupMember(iTwinId: string, groupId: string): Promise<void> {
        await this.iTwinPlatformApiClient.sendRequestNoResponse({
            apiPath: `accesscontrol/itwins/${iTwinId}/members/groups/${groupId}`,
            method: 'DELETE'
        });
    }

    async deleteOwner(iTwinId: string, memberId: string): Promise<void> {
        await this.iTwinPlatformApiClient.sendRequestNoResponse({
            apiPath: `accesscontrol/itwins/${iTwinId}/members/owners/${memberId}`,
            method: 'DELETE'
        });
    }

    async deleteUserMember(iTwinId: string, memberId: string): Promise<void> {
        await this.iTwinPlatformApiClient.sendRequestNoResponse({
            apiPath: `accesscontrol/itwins/${iTwinId}/members/users/${memberId}`,
            method: 'DELETE'
        });
    }

    async getGroupMember(iTwinId: string, groupId: string): Promise<GroupMemberResponse> {
        return this.iTwinPlatformApiClient.sendRequest({
            apiPath: `accesscontrol/itwins/${iTwinId}/members/groups/${groupId}`,
            method: 'GET'
        });
    }

    async getGroupMembers(iTwinId: string): Promise<GroupMembersResponse> {
        return this.iTwinPlatformApiClient.sendRequest({
            apiPath: `accesscontrol/itwins/${iTwinId}/members/groups`,
            method: 'GET'
        });
    }

    async getMemberInvitations(iTwinId: string, skip?: number, top?: number): Promise<invitationsResponse> {
        const query: Query[] = [
            {
                key: "$skip",
                value: skip
            },
            {
                key: "$top",
                value: top
            }
        ];

        return this.iTwinPlatformApiClient.sendRequest({
            apiPath: `accesscontrol/itwins/${iTwinId}/members/invitations`,
            method: 'GET',
            query
        });
    }

    async getOwnerList(iTwinId: string): Promise<ownerListRepsonse> {
        return this.iTwinPlatformApiClient.sendRequest({
            apiPath: `accesscontrol/itwins/${iTwinId}/members/owners`,
            method: 'GET'
        });
    }

    async getUserMember(iTwinId: string, memberId: string): Promise<memberResponse> {
        return this.iTwinPlatformApiClient.sendRequest({
            apiPath: `accesscontrol/itwins/${iTwinId}/members/users/${memberId}`,
            method: 'GET'
        });
    }

    async getUserMembers(iTwinId: string): Promise<membersListResponse> {
        return this.iTwinPlatformApiClient.sendRequest({
            apiPath: `accesscontrol/itwins/${iTwinId}/members/users`,
            method: 'GET'
        });
    }

    async updateGroupMember(iTwinId: string, groupId: string, roleIds: string[]): Promise<GroupMemberResponse> {
        return this.iTwinPlatformApiClient.sendRequest({
            apiPath: `accesscontrol/itwins/${iTwinId}/members/groups/${groupId}`,
            body: {
                roleIds
            },
            method: 'PATCH'
        });
    }

    async updateUserMember(iTwinId: string, memberId: string, roleIds: string[]): Promise<memberResponse> {
        return this.iTwinPlatformApiClient.sendRequest({
            apiPath: `accesscontrol/itwins/${iTwinId}/members/users/${memberId}`,
            body: {
                roleIds
            },
            method: 'PATCH'
        });
    }
}
