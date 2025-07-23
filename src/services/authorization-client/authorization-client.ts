/*---------------------------------------------------------------------------------------------
 * Copyright (c) Bentley Systems, Incorporated. All rights reserved.
 * See LICENSE.md in the project root for license terms and full copyright notice.
 *--------------------------------------------------------------------------------------------*/

import { jwtDecode } from "jwt-decode";
import * as fs from "node:fs";
import path from "node:path";

import { NodeCliAuthorizationClient } from "@itwin/node-cli-authorization";
import { ServiceAuthorizationClient } from "@itwin/service-authorization";
import { Config } from "@oclif/core";

import { Configuration } from "../../extensions/configuration.js";
import { AuthTokenInfo } from "./auth-token-info.js";
import { AuthorizationInformation, AuthorizationType } from "./authorization-type.js";

export class AuthorizationClient {
  private readonly _cliConfiguration: Config;
  private readonly _environmentConfiguration: Configuration;

  constructor(envConfig: Configuration, cliConfig: Config) {
    this._environmentConfiguration = envConfig;
    this._cliConfiguration = cliConfig;
  }

  public async getTokenAsync(): Promise<string | undefined> {
    const tokenInfo = this.getExistingAuthTokenInfo();
    if (tokenInfo?.authToken && this.isExpirationDateValid(tokenInfo.expirationDate)) {
      return tokenInfo.authToken;
    }

    if (tokenInfo?.authenticationType === AuthorizationType.Interactive) {
      throw new Error("Interactive auth token has expired. Please run 'itp auth login' command to re-authenticate.");
    }

    if (
      tokenInfo?.authenticationType === AuthorizationType.Service &&
      (this._environmentConfiguration.clientId === undefined || this._environmentConfiguration.clientSecret === undefined)
    ) {
      throw new Error(
        "Service auth token has expired and no client credentials are available. Please run 'itp auth login' command with client credentials to re-authenticate. Alternatively, you may save your client credentials to ITP_SERVICE_CLIENT_ID and ITP_SERVICE_CLIENT_SECRET environment variables and re-run this command.",
      );
    }

    const newTokenInfo = await this.login();

    return newTokenInfo.authToken;
  }

  public info(): AuthorizationInformation {
    const existingTokenInfo = this.getExistingAuthTokenInfo();

    return {
      apiUrl: this._environmentConfiguration.apiUrl,
      authorizationType: existingTokenInfo?.authenticationType ?? AuthorizationType.Interactive,
      clientId: existingTokenInfo?.authenticationType === AuthorizationType.Service ? this._environmentConfiguration.clientId : undefined,
      expirationDate: existingTokenInfo?.expirationDate,
      issuerUrl: this._environmentConfiguration.issuerUrl,
    };
  }

  public async login(clientId?: string, clientSecret?: string): Promise<AuthTokenInfo> {
    let authType: AuthorizationType;
    let usedToken: string;

    const usedClientId = clientId ?? this._environmentConfiguration.clientId;
    const usedClientSecret = clientSecret ?? this._environmentConfiguration.clientSecret;

    if (usedClientId && usedClientSecret) {
      usedToken = await this.getAccessTokenFromService(usedClientId, usedClientSecret, this._environmentConfiguration.issuerUrl);
      authType = AuthorizationType.Service;
    } else {
      usedToken = await this.getAccessTokenFromWebsiteLogin(usedClientId, this._environmentConfiguration.issuerUrl);
      authType = AuthorizationType.Interactive;
    }

    return this.saveAccessToken(usedToken, authType);
  }

  public async logout(): Promise<void> {
    const existingTokenInfo = this.getExistingAuthTokenInfo();

    // Login from IMS
    if (existingTokenInfo?.authenticationType === AuthorizationType.Interactive) {
      const { clientId, issuerUrl } = this._environmentConfiguration;

      const client = new NodeCliAuthorizationClient({
        clientId,
        expiryBuffer: 10 * 60,
        issuerUrl,
        redirectUri: "http://localhost:3301/signin-callback",
        scope: "itwin-platform",
        tokenStorePath: this._cliConfiguration.cacheDir,
      });

      await client.signOut();
    }

    if (!fs.existsSync(this._cliConfiguration.cacheDir)) {
      fs.mkdirSync(this._cliConfiguration.cacheDir, { recursive: true });
    }

    // Remove token from cache
    const tokenPath = path.join(this._cliConfiguration.cacheDir, "token.json");
    if (fs.existsSync(tokenPath)) {
      fs.unlinkSync(tokenPath);
    }
  }

  private async getAccessTokenFromService(clientId: string, clientSecret: string, issuerUrl: string): Promise<string> {
    const client = new ServiceAuthorizationClient({
      authority: issuerUrl,
      clientId,
      clientSecret,
      scope: "itwin-platform",
    });

    return client.getAccessToken();
  }

  private async getAccessTokenFromWebsiteLogin(clientId: string, issuerUrl: string): Promise<string> {
    const client = new NodeCliAuthorizationClient({
      clientId,
      expiryBuffer: 10 * 60,
      issuerUrl,
      redirectUri: "http://localhost:3301/signin-callback",
      scope: "itwin-platform",
      tokenStorePath: this._cliConfiguration.cacheDir,
    });

    await client.signIn();
    return client.getAccessToken();
  }

  private getExistingAuthTokenInfo(): AuthTokenInfo | undefined {
    const tokenPath = path.join(this._cliConfiguration.cacheDir, "token.json");

    if (!fs.existsSync(tokenPath)) {
      return;
    }

    return JSON.parse(fs.readFileSync(tokenPath, "utf8")) as AuthTokenInfo;
  }

  private isExpirationDateValid(expirationDate: Date | undefined): boolean {
    if (!expirationDate) {
      return false;
    }

    // This is required because the expirationDate is not instanciated
    // because it is cast from a string in json
    const expirationDateFixed = new Date(expirationDate);

    const currentDate = new Date();
    return expirationDateFixed > currentDate;
  }

  private saveAccessToken(accessToken: string, authenticationType: AuthorizationType): AuthTokenInfo {
    // Ensure the directory exists
    if (!fs.existsSync(this._cliConfiguration.cacheDir)) {
      fs.mkdirSync(this._cliConfiguration.cacheDir, { recursive: true });
    }

    const fixedAccessToken = accessToken.startsWith("Bearer ") ? accessToken : `Bearer ${accessToken}`;

    const parsedToken = jwtDecode(fixedAccessToken);

    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    const expiration = new Date(parsedToken.exp! * 1000);
    const tokenInfo: AuthTokenInfo = {
      authToken: fixedAccessToken,
      authenticationType,
      expirationDate: expiration,
    };

    const tokenPath = path.join(this._cliConfiguration.cacheDir, "token.json");
    fs.writeFileSync(tokenPath, JSON.stringify(tokenInfo));

    return tokenInfo;
  }
}
