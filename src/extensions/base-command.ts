/*---------------------------------------------------------------------------------------------
* Copyright (c) Bentley Systems, Incorporated. All rights reserved.
* See LICENSE.md in the project root for license terms and full copyright notice.
*--------------------------------------------------------------------------------------------*/

import { Authorization, AuthorizationCallback, IModelsClient } from '@itwin/imodels-client-management';
import { ITwinsAccessClient } from '@itwin/itwins-client';
import { Command, Flags } from '@oclif/core';
import { Table } from 'console-table-printer';
import 'dotenv/config';
import * as fs from 'node:fs';
import * as path from 'node:path';

import { AccessControlClient } from '../services/access-control-client/access-control-client.js';
import { AccessControlMemberClient } from '../services/access-control-client/access-control-member-client.js';
import { AuthorizationClient } from '../services/authorization-client/authorization-client.js';
import { ChangedElementsApiClient } from '../services/changed-elements-client/changed-elements-api-client.js';
import { ITwinPlatformApiClient } from '../services/iTwin-api-client.js';
import { StorageApiClient } from '../services/storage-client/storage-api-client.js';
import { SynchronizationApiClient } from '../services/synchronizationClient/synchronization-api-client.js';
import { UserApiClient } from '../services/user-client/user-api-client.js';
import { configuration } from './configuration.js';

export default abstract class BaseCommand extends Command {
  static baseFlags = {
    json: Flags.boolean({
      char: 'j',
      description: 'Pretty format the JSON command response and suppress all logging.',
      helpGroup: 'GLOBAL',
      required: false
    }),
    silent: Flags.boolean({
      char: 's',
      description: 'Suppress all logging.',
      hidden: true,
      required: false
    }),
    table: Flags.boolean({
      char: 't',
      description: 'Output the command response in a human-readable table format.',
      helpGroup: 'GLOBAL',
      required: false
    }),
  }

  static enableJsonFlag = true;

  protected async getAccessControlApiClient() {
    const token = await this.getAccessToken();
    const url = this.getBaseApiUrl();
    return new AccessControlClient(url, token);
  }

  protected async getAccessControlMemberClient(){
    const token = this.getAccessToken();
    const url = this.getBaseApiUrl();
    
    return new AccessControlMemberClient(url, await token);
  }

  protected async getAccessToken(): Promise<string> {    
    const client = this.getAuthorizationClient();

    const token = await client.getTokenAsync();
    if(!token) {
      this.error('User token was not found. Make sure you are logged in using `itp auth login`');
    }

    return token;
  }

  protected async getAuthorizationCallback(accessToken?: string) : Promise<AuthorizationCallback> {
    const parts = (accessToken ?? await this.getAccessToken()).split(" ");

    return () => Promise.resolve<Authorization>({
      scheme: parts[0],
      token: parts[1]
    });
  }

  protected getAuthorizationClient() {
    return new AuthorizationClient(this.getConfig(), this.config);
  }

  protected getBaseApiUrl() {
    const config = this.getConfig();
    return config?.apiUrl ?? 'https://api.bentley.com';
  }


  protected async getChangeElementApiClient() {
    return new ChangedElementsApiClient(await this.getITwinApiClient());
  }

  protected getConfig() : configuration {
    const configPath = path.join(this.config.configDir, "config.json");

    let config : configuration = {
      apiUrl: 'https://api.bentley.com',
      clientId: 'native-QJi5VlgxoujsCRwcGHMUtLGMZ',
      clientSecret: undefined,
      issuerUrl: 'https://ims.bentley.com/'
    };
    
    if(fs.existsSync(configPath))
    {
      const file = fs.readFileSync(configPath, 'utf8');
      config = JSON.parse(file);
    }

    if(process.env.ITP_SERVICE_CLIENT_ID) {
      config.clientId = process.env.ITP_SERVICE_CLIENT_ID;
    }

    if(process.env.ITP_SERVICE_CLIENT_SECRET) {
      config.clientSecret = process.env.ITP_SERVICE_CLIENT_SECRET;
    }

    if(process.env.ITP_ISSUER_URL) {
      config.issuerUrl = process.env.ITP_ISSUER_URL;
    }

    if(process.env.ITP_API_URL) {
      config.apiUrl = process.env.ITP_API_URL;
    }
    
    return config;
  }

  protected getIModelClient() : IModelsClient {
    const baseUrl = `${this.getBaseApiUrl()}/imodels`;

    return new IModelsClient({
      api: {
        baseUrl
      }
    });
  }

  protected getITwinAccessClient(): ITwinsAccessClient {
    const baseUrl = `${this.getBaseApiUrl()}/itwins`;
    return new ITwinsAccessClient(baseUrl);
  }

  protected async getITwinApiClient(): Promise<ITwinPlatformApiClient> {
    const token = await this.getAccessToken();
    
    return new ITwinPlatformApiClient(this.getBaseApiUrl(), token);
  }

  protected async getStorageApiClient() {
    return new StorageApiClient(await this.getITwinApiClient());
  }

  protected async getSynchronizationClient() {
    return new SynchronizationApiClient(await this.getITwinApiClient());
  }

  protected async getUserApiClient() {
    return new UserApiClient(await this.getITwinApiClient());
  }

  protected logAndReturnResult<T>(result: T) : T  {
    if(this.argv.includes('--silent') || this.argv.includes('-s')) {
      return result;
    } 
    
    if (this.argv.includes('--table') || this.argv.includes('-t')) {
      this.logTable(result);
    } else {
      this.log(JSON.stringify(result, null, 0));
    }

    return result;
  }

  protected logTable<T>(data: T) {
    if(Array.isArray(data))
      {
        const table = new Table();
        table.addRows(data)

        for (const column of table.table.columns) column.alignment = "left";
        this.log(table.render());
      }
      else
      {
        const table = new Table();
        table.addRows([data])

        for (const column of table.table.columns) column.alignment = "left";
        this.log(table.render());
      }
  }

  protected async runCommand<T>(command: string, args: string[]) : Promise<T> {
    const mergedArgs = [...args, '--silent'];
    return this.config.runCommand<T>(command, mergedArgs);
  }
}