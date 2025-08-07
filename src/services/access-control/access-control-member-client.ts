/*---------------------------------------------------------------------------------------------
 * Copyright (c) Bentley Systems, Incorporated. All rights reserved.
 * See LICENSE.md in the project root for license terms and full copyright notice.
 *--------------------------------------------------------------------------------------------*/

import { ITwinPlatformApiClient, Query } from "../iTwin-platform-api-client.js";
import { GroupMemberResponse, GroupMembersRequest, GroupMembersResponse } from "./models/group-member.js";
import { InvitationsResponse } from "./models/invitations.js";
import { OwnerMemberListResponse, OwnerMemberResponse } from "./models/owner-member.js";
import { AddedUserMembersResponse, UserMemberListResponse, UserMemberResponse, UserMembersRequest } from "./models/user-member.js";

export class AccessControlMemberClient {
  private _apiVersionHeader = "application/vnd.bentley.itwin-platform.v2+json";
  private _iTwinPlatformApiClient: ITwinPlatformApiClient;

  constructor(apiUrl: string, accessToken: string) {
    this._iTwinPlatformApiClient = new ITwinPlatformApiClient(apiUrl, accessToken, this._apiVersionHeader);
  }

  public async addGroupMember(iTwinId: string, groups: GroupMembersRequest): Promise<GroupMembersResponse> {
    return this._iTwinPlatformApiClient.sendRequest({
      apiPath: `accesscontrol/itwins/${iTwinId}/members/groups`,
      body: groups,
      method: "POST",
    });
  }

  public async addOwner(iTwinId: string, email: string): Promise<OwnerMemberResponse> {
    return this._iTwinPlatformApiClient.sendRequest({
      apiPath: `accesscontrol/itwins/${iTwinId}/members/owners`,
      body: {
        email,
      },
      method: "POST",
    });
  }

  public async addUserMembers(iTwinId: string, members: UserMembersRequest): Promise<AddedUserMembersResponse> {
    return this._iTwinPlatformApiClient.sendRequest({
      apiPath: `accesscontrol/itwins/${iTwinId}/members/users`,
      body: members,
      method: "POST",
    });
  }

  public async deleteGroupMember(iTwinId: string, groupId: string): Promise<void> {
    await this._iTwinPlatformApiClient.sendRequestNoResponse({
      apiPath: `accesscontrol/itwins/${iTwinId}/members/groups/${groupId}`,
      method: "DELETE",
    });
  }

  public async deleteOwner(iTwinId: string, memberId: string): Promise<void> {
    await this._iTwinPlatformApiClient.sendRequestNoResponse({
      apiPath: `accesscontrol/itwins/${iTwinId}/members/owners/${memberId}`,
      method: "DELETE",
    });
  }

  public async deleteUserMember(iTwinId: string, memberId: string): Promise<void> {
    await this._iTwinPlatformApiClient.sendRequestNoResponse({
      apiPath: `accesscontrol/itwins/${iTwinId}/members/users/${memberId}`,
      method: "DELETE",
    });
  }

  public async getGroupMember(iTwinId: string, groupId: string): Promise<GroupMemberResponse> {
    return this._iTwinPlatformApiClient.sendRequest({
      apiPath: `accesscontrol/itwins/${iTwinId}/members/groups/${groupId}`,
      method: "GET",
    });
  }

  public async getGroupMembers(iTwinId: string): Promise<GroupMembersResponse> {
    return this._iTwinPlatformApiClient.sendRequest({
      apiPath: `accesscontrol/itwins/${iTwinId}/members/groups`,
      method: "GET",
    });
  }

  public async getMemberInvitations(iTwinId: string, skip?: number, top?: number): Promise<InvitationsResponse> {
    const query: Query[] = [
      {
        key: "$skip",
        value: skip,
      },
      {
        key: "$top",
        value: top,
      },
    ];

    return this._iTwinPlatformApiClient.sendRequest({
      apiPath: `accesscontrol/itwins/${iTwinId}/members/invitations`,
      method: "GET",
      query,
    });
  }

  public async getOwnerList(iTwinId: string): Promise<OwnerMemberListResponse> {
    return this._iTwinPlatformApiClient.sendRequest({
      apiPath: `accesscontrol/itwins/${iTwinId}/members/owners`,
      method: "GET",
    });
  }

  public async getUserMember(iTwinId: string, memberId: string): Promise<UserMemberResponse> {
    return this._iTwinPlatformApiClient.sendRequest({
      apiPath: `accesscontrol/itwins/${iTwinId}/members/users/${memberId}`,
      method: "GET",
    });
  }

  public async getUserMembers(iTwinId: string): Promise<UserMemberListResponse> {
    return this._iTwinPlatformApiClient.sendRequest({
      apiPath: `accesscontrol/itwins/${iTwinId}/members/users`,
      method: "GET",
    });
  }

  public async updateGroupMember(iTwinId: string, groupId: string, roleIds: string[]): Promise<GroupMemberResponse> {
    return this._iTwinPlatformApiClient.sendRequest({
      apiPath: `accesscontrol/itwins/${iTwinId}/members/groups/${groupId}`,
      body: {
        roleIds,
      },
      method: "PATCH",
    });
  }

  public async updateUserMember(iTwinId: string, memberId: string, roleIds: string[]): Promise<UserMemberResponse> {
    return this._iTwinPlatformApiClient.sendRequest({
      apiPath: `accesscontrol/itwins/${iTwinId}/members/users/${memberId}`,
      body: {
        roleIds,
      },
      method: "PATCH",
    });
  }
}
