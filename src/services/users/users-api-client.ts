/*---------------------------------------------------------------------------------------------
 * Copyright (c) Bentley Systems, Incorporated. All rights reserved.
 * See LICENSE.md in the project root for license terms and full copyright notice.
 *--------------------------------------------------------------------------------------------*/

import { ITwinPlatformApiClient, Query } from "../iTwin-platform-api-client.js";
import { UserResponse, UsersResponse } from "./models/user.js";

export class UsersApiClient {
  private _iTwinPlatformApiClient: ITwinPlatformApiClient;

  constructor(client: ITwinPlatformApiClient) {
    this._iTwinPlatformApiClient = client;
  }

  public async getMe(): Promise<UserResponse> {
    return this._iTwinPlatformApiClient.sendRequest({
      apiPath: "users/me",
      method: "GET",
    });
  }

  public async getUsers(userIDs: string[]): Promise<UsersResponse> {
    return this._iTwinPlatformApiClient.sendRequest({
      apiPath: "users/getbyidlist",
      body: userIDs,
      method: "POST",
    });
  }

  public async searchUsers(search: string): Promise<UsersResponse> {
    const query: Query[] = [];
    query.push({
      key: "$search",
      value: search,
    });

    return this._iTwinPlatformApiClient.sendRequest({
      apiPath: "users/",
      method: "GET",
      query,
    });
  }
}
