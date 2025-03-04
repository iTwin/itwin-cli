/*---------------------------------------------------------------------------------------------
* Copyright (c) Bentley Systems, Incorporated. All rights reserved.
* See LICENSE.md in the project root for license terms and full copyright notice.
*--------------------------------------------------------------------------------------------*/

import { NodeCliAuthorizationClient } from "@itwin/node-cli-authorization";
import { ServiceAuthorizationClient } from "@itwin/service-authorization";
import { Config } from "@oclif/core";
import { jwtDecode } from "jwt-decode";
import * as fs from 'node:fs';
import path from "node:path";

import { configuration } from "../../extensions/configuration.js";
import { authTokenInfo } from "./auth-token-info.js";
import { authorizationInformation, authorizationType } from "./authorization-type.js";

export class AuthorizationClient {
  private readonly cliConfiguration: Config;
  private readonly environmentConfiguration: configuration;
  
  constructor(envConfig: configuration, cliConfig: Config)
  {
      this.environmentConfiguration = envConfig;
      this.cliConfiguration = cliConfig;
    }
    
    async getTokenAsync() : Promise<string | undefined> {
      const tokenInfo = this.getExistingAuthTokenInfo();
      if(tokenInfo?.authToken && this.isExpirationDateValid(tokenInfo.expirationDate)) {
        return tokenInfo.authToken;
      }
      
      const newTokenInfo = await this.login();
      
      return newTokenInfo.authToken;
    }
    
    info() : authorizationInformation {
      const existingTokenInfo = this.getExistingAuthTokenInfo();

      return {
        apiUrl : this.environmentConfiguration.apiUrl,
        authorizationType: existingTokenInfo?.authenticationType ?? authorizationType.Interactive,
        clientId: this.environmentConfiguration.clientId,
        expirationDate: existingTokenInfo?.expirationDate,
        issuerUrl: this.environmentConfiguration.issuerUrl
      }
    }

    async login(clientId?: string, clientSecret?: string) : Promise<authTokenInfo> {
      let authType: authorizationType;
      let usedToken : string;
      
      const usedClientId = clientId ?? this.environmentConfiguration.clientId;
      const usedClientSecret = clientSecret ?? this.environmentConfiguration.clientSecret;

      if(usedClientId && usedClientSecret) {
        usedToken = await this.getAccessTokenFromService(usedClientId, usedClientSecret, this.environmentConfiguration.issuerUrl);
        authType = authorizationType.Service;
      }
      else {
        usedToken = await this.getAccessTokenFromWebsiteLogin(usedClientId, this.environmentConfiguration.issuerUrl);
        authType = authorizationType.Interactive;
      }

      return this.saveAccessToken(usedToken, authType);
    }

    async logout() {
      const existingTokenInfo = this.getExistingAuthTokenInfo();

      // Login from IMS
      if(existingTokenInfo?.authenticationType === authorizationType.Interactive) {
        const {clientId, issuerUrl} = this.environmentConfiguration
        
        const client = new NodeCliAuthorizationClient({
          clientId,
          expiryBuffer: 10 * 60,
          issuerUrl,
          redirectUri: "http://localhost:3000/signin-callback",
          scope: "itwin-platform"
        });

        await client.signOut();
      }

      if (!fs.existsSync(this.cliConfiguration.cacheDir)) {
        fs.mkdirSync(this.cliConfiguration.cacheDir, { recursive: true });
      }

      // Remove token from cache
      const tokenPath = path.join(this.cliConfiguration.cacheDir, 'token.json');
      if(fs.existsSync(tokenPath))
      {
          fs.unlinkSync(tokenPath);
      }
    }

    private async getAccessTokenFromService(clientId: string, clientSecret: string, issuerUrl: string) {
        const client = new ServiceAuthorizationClient({
          authority: issuerUrl,
          clientId,
          clientSecret,
          scope: 'itwin-platform'
        })
    
        return client.getAccessToken();
      }

    private async getAccessTokenFromWebsiteLogin(clientId: string, issuerUrl: string) {
        const client = new NodeCliAuthorizationClient({
          clientId,
          expiryBuffer: 10 * 60,
          issuerUrl,
          redirectUri: "http://localhost:3000/signin-callback",
          scope: "itwin-platform"
        });
    
        await client.signIn();
        return client.getAccessToken();    
    }

    private getExistingAuthTokenInfo() {
      const tokenPath = path.join(this.cliConfiguration.cacheDir, 'token.json');

      if (!fs.existsSync(tokenPath)) {
        return;
      }
 
      return JSON.parse(fs.readFileSync(tokenPath, 'utf8')) as authTokenInfo;
    }

    private isExpirationDateValid(expirationDate: Date | undefined)  {
      if(!expirationDate) {
        return false;
      }

      // This is required because the expirationDate is not instanciated
      // because it is cast from a string in json
      const expirationDateFixed = new Date(expirationDate);
      
      const currentDate = new Date();
      return expirationDateFixed > currentDate;      
    }

    private saveAccessToken(accessToken: string, authenticationType: authorizationType) {
      // Ensure the directory exists
      if (!fs.existsSync(this.cliConfiguration.cacheDir)) {
        fs.mkdirSync(this.cliConfiguration.cacheDir, { recursive: true });
      }

      const fixedAccessToken = accessToken.startsWith('Bearer ') ? accessToken : `Bearer ${accessToken}`;

      const parsedToken = jwtDecode(fixedAccessToken);

      const expiration = new Date(parsedToken.exp! * 1000);
      const tokenInfo : authTokenInfo = {
        authToken: fixedAccessToken,
        authenticationType,
        expirationDate: expiration
      }

      const tokenPath = path.join(this.cliConfiguration.cacheDir, 'token.json');
      fs.writeFileSync(tokenPath, JSON.stringify(tokenInfo));

      return tokenInfo;
    }
}