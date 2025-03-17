/*---------------------------------------------------------------------------------------------
* Copyright (c) Bentley Systems, Incorporated. All rights reserved.
* See LICENSE.md in the project root for license terms and full copyright notice.
*--------------------------------------------------------------------------------------------*/

import { ITwinPlatformApiClient, Query } from "../iTwin-api-client.js";
import { UserResponse, UsersResponse } from "./models/user.js";

export class UserApiClient {
    iTwinPlatformApiClient: ITwinPlatformApiClient;

    constructor(client: ITwinPlatformApiClient) {
        this.iTwinPlatformApiClient = client;
    }

    async getMe() : Promise<UserResponse> {
        return this.iTwinPlatformApiClient.sendRequest({
            apiPath: 'users/me',
            method: 'GET'
        })
    }

    async getUsers(userIDs: string[]) : Promise<UsersResponse> {
        return this.iTwinPlatformApiClient.sendRequest({
            apiPath: 'users/getbyidlist',
            body: userIDs,
            method: 'POST'
        })
    }

    async searchUsers(search: string) : Promise<UsersResponse> {
        const query : Query[] = [];
        query.push({
            key: "$search",
            value: search
        });

        return this.iTwinPlatformApiClient.sendRequest({
            apiPath: 'users/',
            method: 'GET',
            query
        })
    }
}