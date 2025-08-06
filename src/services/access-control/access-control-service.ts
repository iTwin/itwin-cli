/*---------------------------------------------------------------------------------------------
 * Copyright (c) Bentley Systems, Incorporated. All rights reserved.
 * See LICENSE.md in the project root for license terms and full copyright notice.
 *--------------------------------------------------------------------------------------------*/

import { LoggingCallbacks } from "../general-models/logging-callbacks.js";
import { ResultResponse } from "../general-models/result-response.js";
import { AccessControlClient } from "./access-control-client.js";
import { Group, GroupUpdate } from "./models/group.js";
import { Role } from "./models/role.js";

export class AccessControlService {
  private _accessControlClient: AccessControlClient;
  private _loggingCallbacks: LoggingCallbacks;

  constructor(accessControlClient: AccessControlClient, loggingCallbacks: LoggingCallbacks) {
    this._accessControlClient = accessControlClient;
    this._loggingCallbacks = loggingCallbacks;
  }

  public async createGroup(iTwinId: string, name: string, description: string): Promise<Group> {
    const response = await this._accessControlClient.createGroup(iTwinId, {
      description,
      name,
    });

    return response.group;
  }

  public async deleteGroup(iTwinId: string, groupId: string): Promise<ResultResponse> {
    await this._accessControlClient.deleteGroup(iTwinId, groupId);

    return { result: "deleted" };
  }

  public async getGroup(iTwinId: string, groupId: string): Promise<Group> {
    const response = await this._accessControlClient.getGroup(iTwinId, groupId);

    return response.group;
  }

  public async getGroups(iTwinId: string): Promise<Group[]> {
    const response = await this._accessControlClient.getGroups(iTwinId);

    return response.groups;
  }

  public async updateGroup(iTwinId: string, groupId: string, groupUpdate: GroupUpdate): Promise<Group> {
    if (groupUpdate.imsGroups !== undefined && groupUpdate.imsGroups.length > 50) {
      this._loggingCallbacks.error("A maximum of 50 ims groups can be provided.");
    }

    if (groupUpdate.members !== undefined && groupUpdate.members.length > 50) {
      this._loggingCallbacks.error("A maximum of 50 members can be provided.");
    }

    const response = await this._accessControlClient.updateGroup(iTwinId, groupId, groupUpdate);

    return response.group;
  }

  public async getAllAvailableiTwinPermissions(): Promise<string[]> {
    const response = await this._accessControlClient.getAllAvailableiTwinPermissions();

    return response.permissions;
  }

  public async getAlliTwinPermissions(iTwinId: string): Promise<string[]> {
    const response = await this._accessControlClient.getAlliTwinPermissions(iTwinId);

    return response.permissions;
  }

  public async createiTwinRole(iTwinId: string, name: string, description: string): Promise<Role> {
    const response = await this._accessControlClient.createiTwinRole(iTwinId, {
      description,
      displayName: name,
    });

    return response.role;
  }

  public async deleteiTwinRole(iTwinId: string, roleId: string): Promise<ResultResponse> {
    await this._accessControlClient.deleteiTwinRole(iTwinId, roleId);

    return { result: "deleted" };
  }

  public async getiTwinRole(iTwinId: string, roleId: string): Promise<Role> {
    const response = await this._accessControlClient.getiTwinRole(iTwinId, roleId);

    return response.role;
  }

  public async getiTwinRoles(iTwinId: string): Promise<Role[]> {
    const response = await this._accessControlClient.getiTwinRoles(iTwinId);

    return response.roles;
  }

  public async updateiTwinRole(iTwinId: string, roleId: string, roleUpdate: Role): Promise<Role> {
    const response = await this._accessControlClient.updateiTwinRole(iTwinId, roleId, roleUpdate);

    return response.role;
  }
}
