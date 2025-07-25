/*---------------------------------------------------------------------------------------------
 * Copyright (c) Bentley Systems, Incorporated. All rights reserved.
 * See LICENSE.md in the project root for license terms and full copyright notice.
 *--------------------------------------------------------------------------------------------*/

import { ITwinPlatformApiClient, Query } from "../itwins/iTwin-api-client.js";
import { GroupMemberResponse, GroupMembersRequest, GroupMembersResponse } from "./models/group.js";
import { InvitationsResponse } from "./models/invitations.js";
import { ListOfMembers, MemberResponse, MembersListResponse, MembersResponse } from "./models/members.js";
import { OwnerListResponse, OwnerResponse } from "./models/owner.js";

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

  public async addOwner(iTwinId: string, email: string): Promise<OwnerResponse> {
    return this._iTwinPlatformApiClient.sendRequest({
      apiPath: `accesscontrol/itwins/${iTwinId}/members/owners`,
      body: {
        email,
      },
      method: "POST",
    });
  }

  public async addUserMembers(iTwinId: string, members: ListOfMembers): Promise<MembersResponse> {
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

  public async getOwnerList(iTwinId: string): Promise<OwnerListResponse> {
    return this._iTwinPlatformApiClient.sendRequest({
      apiPath: `accesscontrol/itwins/${iTwinId}/members/owners`,
      method: "GET",
    });
  }

  public async getUserMember(iTwinId: string, memberId: string): Promise<MemberResponse> {
    return this._iTwinPlatformApiClient.sendRequest({
      apiPath: `accesscontrol/itwins/${iTwinId}/members/users/${memberId}`,
      method: "GET",
    });
  }

  public async getUserMembers(iTwinId: string): Promise<MembersListResponse> {
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

  public async updateUserMember(iTwinId: string, memberId: string, roleIds: string[]): Promise<MemberResponse> {
    return this._iTwinPlatformApiClient.sendRequest({
      apiPath: `accesscontrol/itwins/${iTwinId}/members/users/${memberId}`,
      body: {
        roleIds,
      },
      method: "PATCH",
    });
  }
}
