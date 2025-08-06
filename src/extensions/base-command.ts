/*---------------------------------------------------------------------------------------------
 * Copyright (c) Bentley Systems, Incorporated. All rights reserved.
 * See LICENSE.md in the project root for license terms and full copyright notice.
 *--------------------------------------------------------------------------------------------*/

import "dotenv/config";

import { Table } from "console-table-printer";

import { Authorization, AuthorizationCallback, IModelsClient } from "@itwin/imodels-client-management";
import { ITwinsAccessClient } from "@itwin/itwins-client";
import { Command, Config, Flags } from "@oclif/core";
import { Input, ParserOutput } from "@oclif/core/interfaces";

import { ArgOutput, FlagOutput } from "../../node_modules/@oclif/core/lib/interfaces/parser.js";
import { AccessControlClient } from "../services/access-control/access-control-client.js";
import { AccessControlMemberClient } from "../services/access-control/access-control-member-client.js";
import { AccessControlMemberService } from "../services/access-control/access-control-member-service.js";
import { AuthorizationClient } from "../services/authorization/authorization-client.js";
import { AuthorizationService } from "../services/authorization/authorization-service.js";
import { ChangedElementsApiClient } from "../services/changed-elements/changed-elements-api-client.js";
import { ChangedElementsApiService } from "../services/changed-elements/changed-elements-api-service.js";
import { ContextService } from "../services/context-service.js";
import { LoggingCallbacks } from "../services/general-models/logging-callbacks.js";
import { IModelChangesetService } from "../services/imodels/iModels-changeset-service.js";
import { IModelNamedVersionService } from "../services/imodels/iModels-named-version-service.js";
import { IModelService } from "../services/imodels/iModels-service.js";
import { ITwinPlatformApiClient } from "../services/iTwin-platform-api-client.js";
import { MeshExportApiClient } from "../services/mesh-export/mesh-export-api-client.js";
import { MeshExportApiService } from "../services/mesh-export/mesh-export-api-service.js";
import { StorageApiClient } from "../services/storage/storage-api-client.js";
import { StorageApiService } from "../services/storage/storage-api-service.js";
import { SynchronizationApiClient } from "../services/synchronization/synchronization-api-client.js";
import { SynchronizationApiService } from "../services/synchronization/synchronization-api-service.js";
import { UsersApiClient } from "../services/users/users-api-client.js";
import { UsersApiService } from "../services/users/users-api-service.js";
import { Configuration } from "./configuration.js";

export default abstract class BaseCommand extends Command {
  // Is necessary for --json flag to function even though it's not referenced anywhere
  public static enableJsonFlag = true;

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

  private readonly _envConfig: Configuration;
  private readonly _baseApiUrl: string;
  private readonly _logger: LoggingCallbacks;

  private readonly _authorizationClient: AuthorizationClient;

  protected readonly iTwinAccessClient: ITwinsAccessClient;
  protected readonly iModelClient: IModelsClient;
  protected readonly contextService: ContextService;
  protected readonly authorizationService: AuthorizationService;

  constructor(argv: string[], config: Config) {
    super(argv, config);

    this._envConfig = new Configuration(config.configDir);
    this._baseApiUrl = this._envConfig?.apiUrl ?? "https://api.bentley.com";
    this._logger = {
      error: (input) => this.error(input),
      log: (message) => this.log(message),
      debug: (...args: any[]) => this.debug(args),
    } as LoggingCallbacks;

    this._authorizationClient = new AuthorizationClient(this._envConfig, config.cacheDir);

    this.iTwinAccessClient = new ITwinsAccessClient(`${this._baseApiUrl}/itwins`);
    this.iModelClient = new IModelsClient({
      api: {
        baseUrl: `${this._baseApiUrl}/imodels`,
      },
    });
    this.contextService = new ContextService(config.cacheDir, this._logger);
    this.authorizationService = new AuthorizationService(this._authorizationClient, this._logger);
  }

  protected async getAccessToken(): Promise<string> {
    try {
      const token = await this._authorizationClient.getTokenAsync();
      if (!token) {
        this.error("User token was not found. Make sure you are logged in using `itp auth login`");
      }

      return token;
    } catch (error) {
      this.error(error as Error);
    }
  }

  private async getAuthorizationCallback(accessToken?: string): Promise<AuthorizationCallback> {
    const parts = (accessToken ?? (await this.getAccessToken())).split(" ");

    return async () =>
      Promise.resolve<Authorization>({
        scheme: parts[0],
        token: parts[1],
      });
  }

  protected async getAccessControlApiClient(): Promise<AccessControlClient> {
    const token = await this.getAccessToken();
    return new AccessControlClient(this._baseApiUrl, token);
  }

  protected async getAccessControlMemberService(): Promise<AccessControlMemberService> {
    const token = await this.getAccessToken();
    const accessControlMemberClient = new AccessControlMemberClient(this._baseApiUrl, token);

    return new AccessControlMemberService(accessControlMemberClient, this._logger);
  }

  protected async getIModelService(): Promise<IModelService> {
    const callback = await this.getAuthorizationCallback();

    return new IModelService(this.iModelClient, this.contextService, callback, this._logger);
  }

  protected async getIModelChangesetService(): Promise<IModelChangesetService> {
    const callback = await this.getAuthorizationCallback();

    return new IModelChangesetService(this.iModelClient, callback);
  }

  protected async getIModelNamedVersionService(): Promise<IModelNamedVersionService> {
    const callback = await this.getAuthorizationCallback();

    return new IModelNamedVersionService(this.iModelClient, callback);
  }

  protected async getChangedElementsApiService(): Promise<ChangedElementsApiService> {
    const iTwinApiClient = await this.getITwinApiClient();
    const changedElementsApiClient = new ChangedElementsApiClient(iTwinApiClient);

    return new ChangedElementsApiService(changedElementsApiClient);
  }

  protected async getITwinApiClient(apiVersionHeader?: string): Promise<ITwinPlatformApiClient> {
    const token = await this.getAccessToken();

    return new ITwinPlatformApiClient(this._baseApiUrl, token, apiVersionHeader);
  }

  protected async getStorageApiService(): Promise<StorageApiService> {
    const iTwinApiClient = await this.getITwinApiClient();
    const storageApiClient = new StorageApiClient(iTwinApiClient);

    return new StorageApiService(storageApiClient, this._logger);
  }

  protected async getSynchronizationApiService(): Promise<SynchronizationApiService> {
    const iTwinApiClient = await this.getITwinApiClient();
    const synchronizationApiClient = new SynchronizationApiClient(iTwinApiClient);

    return new SynchronizationApiService(synchronizationApiClient, this.authorizationService, this._logger);
  }

  protected async getUserApiService(): Promise<UsersApiService> {
    const iTwinApiClient = await this.getITwinApiClient();
    const userApiClient = new UsersApiClient(iTwinApiClient);

    return new UsersApiService(userApiClient, this._logger);
  }

  protected async getMeshExportApiService(): Promise<MeshExportApiService> {
    const iTwinApiClient = await this.getITwinApiClient("application/vnd.bentley.itwin-platform.v1+json");
    const meshExportApiClient = new MeshExportApiClient(iTwinApiClient);

    return new MeshExportApiService(meshExportApiClient, this._logger);
  }

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
      const context = this.contextService.getContext();

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
