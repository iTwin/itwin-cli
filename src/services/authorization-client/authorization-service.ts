import { LoggingCallbacks } from "../general-models/logging-callbacks.js";
import { AuthorizationClient } from "./authorization-client.js";
import { AuthorizationInformation } from "./authorization-type.js";

export class AuthorizationService {
  private _client: AuthorizationClient;
  private _callbacks: LoggingCallbacks;

  constructor(authorizationClient: AuthorizationClient, callbacks: LoggingCallbacks) {
    this._client = authorizationClient;
    this._callbacks = callbacks;
  }

  public async info(): Promise<AuthorizationInformation> {
    return this._client.info();
  }

  public async login(clientId?: string, clientSecret?: string): Promise<void> {
    try {
      const authInfo = await this._client.login(clientId, clientSecret);

      if (!authInfo.authToken) {
        this._callbacks.error("User login was not successful");
      }

      this._callbacks.log(`User successfully logged in using ${authInfo.authenticationType} login`);
    } catch {
      this._callbacks.error("User login was not successful");
    }
  }

  public async logout(): Promise<void> {
    try {
      await this._client.logout();
      this._callbacks.log("User successfully logged out");
    } catch (error) {
      this._callbacks.error(`User logout encountered an error: ${JSON.stringify(error)}`);
    }
  }
}
