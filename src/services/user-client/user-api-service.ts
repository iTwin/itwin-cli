import { LoggingCallbacks } from "../general-models/logging-callbacks.js";
import { User } from "./models/user.js";
import { UserApiClient } from "./user-api-client.js";

export class UserApiService {
  private _client: UserApiClient;
  private _callbacks: LoggingCallbacks;

  constructor(userApiClient: UserApiClient, callbacks: LoggingCallbacks) {
    this._client = userApiClient;
    this._callbacks = callbacks;
  }

  public async me(): Promise<User> {
    const userResponse = await this._client.getMe();
    return userResponse.user;
  }

  public async info(userIds: string[]): Promise<User[]> {
    if (userIds !== undefined && userIds.length > 1000) {
      this._callbacks.error("A maximum of 1000 user IDs can be provided.");
    }

    const response = await this._client.getUsers(userIds);

    return response.users;
  }

  public async search(search: string): Promise<User[]> {
    const response = await this._client.searchUsers(search);

    return response.users;
  }
}
