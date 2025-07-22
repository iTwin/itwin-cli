/*---------------------------------------------------------------------------------------------
 * Copyright (c) Bentley Systems, Incorporated. All rights reserved.
 * See LICENSE.md in the project root for license terms and full copyright notice.
 *--------------------------------------------------------------------------------------------*/

import "dotenv/config";

import { Table } from "console-table-printer";
import * as fs from "node:fs";
import * as path from "node:path";

import { Authorization, AuthorizationCallback, IModelsClient } from "@itwin/imodels-client-management";
import { ITwinsAccessClient } from "@itwin/itwins-client";
import { Command, Flags } from "@oclif/core";
import { Input, ParserOutput } from "@oclif/core/interfaces";

import { ArgOutput, FlagOutput } from "../../node_modules/@oclif/core/lib/interfaces/parser.js";
import { AccessControlClient } from "../services/access-control-client/access-control-client.js";
import { AccessControlMemberClient } from "../services/access-control-client/access-control-member-client.js";
import { AuthorizationClient } from "../services/authorization-client/authorization-client.js";
import { AuthorizationService } from "../services/authorization-service.js";
import { ChangedElementsApiService } from "../services/changed-elements-api-service.js";
import { ChangedElementsApiClient } from "../services/changed-elements-client/changed-elements-api-client.js";
import { ContextService } from "../services/context-service.js";
import { LoggingCallbacks } from "../services/general-models/logging-callbacks.js";
import { IModelApiService } from "../services/iModel-api-service.js";
import { ITwinPlatformApiClient } from "../services/iTwin-api-client.js";
import { StorageApiClient } from "../services/storage-client/storage-api-client.js";
import { SynchronizationApiClient } from "../services/synchronizationClient/synchronization-api-client.js";
import { UsersApiService } from "../services/users-api-service.js";
import { UsersApiClient } from "../services/users-client/users-api-client.js";
import { Configuration } from "./configuration.js";

export default abstract class BaseCommand extends Command {
  public static baseFlags = {
    json: Flags.boolean({
      char: "j",
      description: "Pretty format the JSON command response and suppress all logging.",
      helpGroup: "GLOBAL",
      required: false,
    }),
    silent: Flags.boolean({
      char: "s",
      description: "Suppress all logging.",
      hidden: true,
      required: false,
    }),
    table: Flags.boolean({
      char: "t",
      description: "Output the command response in a human-readable table format.",
      helpGroup: "GLOBAL",
      required: false,
    }),
  };

  public static enableJsonFlag = true;

  protected async getAccessToken(): Promise<string> {
    const client = new AuthorizationClient(this.getEnvConfig(), this.config);

    const token = await client.getTokenAsync();
    if (!token) {
      this.error("User token was not found. Make sure you are logged in using `itp auth login`");
    }

    return token;
  }

  protected async getAuthorizationCallback(accessToken?: string): Promise<AuthorizationCallback> {
    const parts = (accessToken ?? (await this.getAccessToken())).split(" ");

    return async () =>
      Promise.resolve<Authorization>({
        scheme: parts[0],
        token: parts[1],
      });
  }

  private getLoggingCallbacks(): LoggingCallbacks {
    return {
      error: (input) => this.error(input),
      log: (message) => this.log(message),
      debug: (...args: any[]) => this.debug(args),
    };
  }

  protected getBaseApiUrl(): string {
    const config = this.getEnvConfig();
    return config?.apiUrl ?? "https://api.bentley.com";
  }

  protected getEnvConfig(): Configuration {
    const configPath = path.join(this.config.configDir, "config.json");

    let config: Configuration = {
      apiUrl: "https://api.bentley.com",
      clientId: "native-QJi5VlgxoujsCRwcGHMUtLGMZ",
      clientSecret: undefined,
      issuerUrl: "https://ims.bentley.com/",
    };

    if (fs.existsSync(configPath)) {
      const file = fs.readFileSync(configPath, "utf8");
      config = JSON.parse(file);
    }

    if (process.env.ITP_SERVICE_CLIENT_ID) {
      config.clientId = process.env.ITP_SERVICE_CLIENT_ID;
    }

    if (process.env.ITP_SERVICE_CLIENT_SECRET) {
      config.clientSecret = process.env.ITP_SERVICE_CLIENT_SECRET;
    }

    if (process.env.ITP_ISSUER_URL) {
      config.issuerUrl = process.env.ITP_ISSUER_URL;
    }

    if (process.env.ITP_API_URL) {
      config.apiUrl = process.env.ITP_API_URL;
    }

    return config;
  }

  // #region Clients & Services

  protected async getAccessControlApiClient(): Promise<AccessControlClient> {
    const token = await this.getAccessToken();
    const url = this.getBaseApiUrl();
    return new AccessControlClient(url, token);
  }

  protected async getAccessControlMemberClient(): Promise<AccessControlMemberClient> {
    const token = this.getAccessToken();
    const url = this.getBaseApiUrl();

    return new AccessControlMemberClient(url, await token);
  }

  protected getContextService(): ContextService {
    return new ContextService(this.config.cacheDir, this.getLoggingCallbacks());
  }

  protected getAuthorizationService(): AuthorizationService {
    const authorizationClient = new AuthorizationClient(this.getEnvConfig(), this.config);

    return new AuthorizationService(authorizationClient, this.getLoggingCallbacks());
  }

  protected async getIModelService(): Promise<IModelApiService> {
    const iModelsClient = this.getIModelClient();
    const contextService = this.getContextService();
    const callback = await this.getAuthorizationCallback();

    return new IModelApiService(iModelsClient, contextService, callback, this.getLoggingCallbacks());
  }

  protected getIModelClient(): IModelsClient {
    const baseUrl = `${this.getBaseApiUrl()}/imodels`;

    return new IModelsClient({
      api: {
        baseUrl,
      },
    });
  }

  protected async getChangedElementsApiService(): Promise<ChangedElementsApiService> {
    const changedElementsApiClient = new ChangedElementsApiClient(await this.getITwinApiClient());

    return new ChangedElementsApiService(changedElementsApiClient);
  }

  protected getITwinAccessClient(): ITwinsAccessClient {
    const baseUrl = `${this.getBaseApiUrl()}/itwins`;
    return new ITwinsAccessClient(baseUrl);
  }

  protected async getITwinApiClient(): Promise<ITwinPlatformApiClient> {
    const token = await this.getAccessToken();

    return new ITwinPlatformApiClient(this.getBaseApiUrl(), token);
  }

  protected async getStorageApiClient(): Promise<StorageApiClient> {
    return new StorageApiClient(await this.getITwinApiClient());
  }

  protected async getSynchronizationClient(): Promise<SynchronizationApiClient> {
    return new SynchronizationApiClient(await this.getITwinApiClient());
  }

  protected async getUserApiService(): Promise<UsersApiService> {
    const userApiClient = new UsersApiClient(await this.getITwinApiClient());

    return new UsersApiService(userApiClient, this.getLoggingCallbacks());
  }

  // #endregion

  protected logAndReturnResult<T>(result: T): T {
    if (this.argv.includes("--silent") || this.argv.includes("-s")) {
      return result;
    }

    if (this.argv.includes("--table") || this.argv.includes("-t")) {
      this.logTable(result);
    } else {
      this.log(JSON.stringify(result, null, 0));
    }

    return result;
  }

  protected logTable<T>(data: T): void {
    if (Array.isArray(data)) {
      const table = new Table();
      table.addRows(data);

      for (const column of table.table.columns) column.alignment = "left";
      this.log(table.render());
    } else {
      const table = new Table();
      table.addRows([data]);

      for (const column of table.table.columns) column.alignment = "left";
      this.log(table.render());
    }
  }

  protected override async parse<F extends FlagOutput, B extends FlagOutput, A extends ArgOutput>(
    options?: Input<F, B, A>,
    argv?: string[],
  ): Promise<ParserOutput<F, B, A>> {
    if (options?.flags) {
      const contextService = this.getContextService();
      const context = contextService.getContext();

      if (options.flags["itwin-id"] && !this.argv.includes("--itwin-id") && !this.argv.includes("-i") && context?.iTwinId) {
        this.argv.push("--itwin-id", context.iTwinId);
      }

      if (options.flags["imodel-id"] && !this.argv.includes("--imodel-id") && !this.argv.includes("-m") && context?.iModelId) {
        this.argv.push("--imodel-id", context.iModelId);
      }
    }

    const parsed = await super.parse(options, argv);

    return parsed;
  }

  protected async parseWithoutContext<F extends FlagOutput, B extends FlagOutput, A extends ArgOutput>(
    options?: Input<F, B, A>,
    argv?: string[],
  ): Promise<ParserOutput<F, B, A>> {
    return super.parse(options, argv);
  }

  protected async runCommand<T>(command: string, args: string[]): Promise<T> {
    const mergedArgs = [...args, "--silent"];
    return this.config.runCommand<T>(command, mergedArgs);
  }
}
