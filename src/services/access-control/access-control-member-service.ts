/*---------------------------------------------------------------------------------------------
 * Copyright (c) Bentley Systems, Incorporated. All rights reserved.
 * See LICENSE.md in the project root for license terms and full copyright notice.
 *--------------------------------------------------------------------------------------------*/

import { LoggingCallbacks } from "../general-models/logging-callbacks.js";
import { ResultResponse } from "../general-models/result-response.js";
import { AccessControlMemberClient } from "./access-control-member-client.js";
import { GroupMemberInfo, GroupMemberRoles } from "./models/group-member.js";
import { Invitation } from "./models/invitations.js";
import { OwnerMember, OwnerMemberResponse } from "./models/owner-member.js";
import { AddedUserMembersResponse, UserMember, UserMemberRoles } from "./models/user-member.js";

export class AccessControlMemberService {
  private _accessControlMemberClient: AccessControlMemberClient;
  private _loggingCallbacks: LoggingCallbacks;

  constructor(accessControlMemberClient: AccessControlMemberClient, loggingCallbacks: LoggingCallbacks) {
    this._accessControlMemberClient = accessControlMemberClient;
    this._loggingCallbacks = loggingCallbacks;
  }

  public async addGroupMember(iTwinId: string, groupMembers: GroupMemberRoles[]): Promise<GroupMemberInfo[]> {
    let roleAssignmentCount = 0;
    for (const member of groupMembers) roleAssignmentCount += member.roleIds.length;

    if (roleAssignmentCount > 50) {
      this._loggingCallbacks.error("A maximum of 50 role assignments can be performed.");
    }

    const response = await this._accessControlMemberClient.addGroupMember(iTwinId, {
      members: groupMembers,
    });

    return response.members;
  }

  public async deleteGroupMember(iTwinId: string, groupId: string): Promise<ResultResponse> {
    await this._accessControlMemberClient.deleteGroupMember(iTwinId, groupId);

    return { result: "deleted" };
  }

  public async getGroupMember(iTwinId: string, groupId: string): Promise<GroupMemberInfo> {
    const result = await this._accessControlMemberClient.getGroupMember(iTwinId, groupId);

    return result.member;
  }

  public async getGroupMembers(iTwinId: string): Promise<GroupMemberInfo[]> {
    const result = await this._accessControlMemberClient.getGroupMembers(iTwinId);

    return result.members;
  }

  public async updateGroupMember(iTwinId: string, groupId: string, roleIds: string[]): Promise<GroupMemberInfo> {
    if (roleIds !== undefined && roleIds.length > 50) {
      this._loggingCallbacks.error("A maximum of 50 roles can be assigned.");
    }

    const response = await this._accessControlMemberClient.updateGroupMember(iTwinId, groupId, roleIds);

    return response.member;
  }

  public async addOwnerMember(iTwinId: string, email: string): Promise<OwnerMemberResponse> {
    const response = await this._accessControlMemberClient.addOwner(iTwinId, email);

    return response;
  }

  public async deleteOwnerMember(iTwinId: string, memberId: string): Promise<ResultResponse> {
    await this._accessControlMemberClient.deleteOwner(iTwinId, memberId);

    return { result: "deleted" };
  }

  public async getOwnerMembers(iTwinId: string): Promise<OwnerMember[]> {
    const result = await this._accessControlMemberClient.getOwnerList(iTwinId);

    return result.members;
  }

  public async addUserMember(iTwinId: string, userMembers: UserMemberRoles[]): Promise<AddedUserMembersResponse> {
    let roleAssignmentCount = 0;
    for (const member of userMembers) roleAssignmentCount += member.roleIds.length;

    if (roleAssignmentCount > 50) {
      this._loggingCallbacks.error("A maximum of 50 role assignments can be performed.");
    }

    const response = await this._accessControlMemberClient.addUserMembers(iTwinId, {
      members: userMembers,
    });

    return response;
  }

  public async deleteUserMember(iTwinId: string, memberId: string): Promise<ResultResponse> {
    await this._accessControlMemberClient.deleteUserMember(iTwinId, memberId);

    return { result: "deleted" };
  }

  public async getUserMember(iTwinId: string, memberId: string): Promise<UserMember> {
    const result = await this._accessControlMemberClient.getUserMember(iTwinId, memberId);

    return result.member;
  }

  public async getUserMembers(iTwinId: string): Promise<UserMember[]> {
    const result = await this._accessControlMemberClient.getUserMembers(iTwinId);

    return result.members;
  }

  public async updateUserMember(iTwinId: string, memberId: string, roleIds: string[]): Promise<UserMember> {
    if (roleIds !== undefined && roleIds.length > 50) {
      this._loggingCallbacks.error("A maximum of 50 roles can be assigned.");
    }

    const response = await this._accessControlMemberClient.updateUserMember(iTwinId, memberId, roleIds);

    return response.member;
  }

  public async getMemberInvitations(iTwinId: string): Promise<Invitation[]> {
    const response = await this._accessControlMemberClient.getMemberInvitations(iTwinId);

    return response.invitations;
  }
}
