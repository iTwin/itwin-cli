/*---------------------------------------------------------------------------------------------
 * Copyright (c) Bentley Systems, Incorporated. All rights reserved.
 * See LICENSE.md in the project root for license terms and full copyright notice.
 *--------------------------------------------------------------------------------------------*/

import { LoggingCallbacks } from "./general-models/logging-callbacks.js";
import { User } from "./user-client/models/user.js";
import { UsersApiClient } from "./user-client/users-api-client.js";

export class UsersApiService {
  private _client: UsersApiClient;
  private _callbacks: LoggingCallbacks;

  constructor(userApiClient: UsersApiClient, callbacks: LoggingCallbacks) {
    this._client = userApiClient;
    this._callbacks = callbacks;
  }

  public async getMe(): Promise<User> {
    const userResponse = await this._client.getMe();
    return userResponse.user;
  }

  public async getUsers(userIds: string[]): Promise<User[]> {
    if (userIds !== undefined && userIds.length > 1000) {
      this._callbacks.error("A maximum of 1000 user IDs can be provided.");
    }

    const response = await this._client.getUsers(userIds);

    return response.users;
  }

  public async searchUsers(search: string): Promise<User[]> {
    const response = await this._client.searchUsers(search);

    return response.users;
  }
}
