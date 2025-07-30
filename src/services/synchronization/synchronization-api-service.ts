/*---------------------------------------------------------------------------------------------
 * Copyright (c) Bentley Systems, Incorporated. All rights reserved.
 * See LICENSE.md in the project root for license terms and full copyright notice.
 *--------------------------------------------------------------------------------------------*/

import http2 from "node:http2";
import open from "open";

import { AuthorizationService } from "../authorization/authorization-service.js";
import { AuthorizationType } from "../authorization/authorization-type.js";
import { LoggingCallbacks } from "../general-models/logging-callbacks.js";
import { ResultResponse } from "../general-models/result-response.js";
import { AuthenticationType } from "./models/authentication-type.js";
import { AuthInfo } from "./models/connection-auth.js";
import { ConnectorType } from "./models/connector-type.js";
import { ExecutionResult } from "./models/execution-result.js";
import { ExecutionState } from "./models/execution-state.js";
import { SourceFile } from "./models/source-file.js";
import { StorageConnectionListResponse } from "./models/storage-connection-response.js";
import { StorageConnection } from "./models/storage-connection.js";
import { StorageFileCreate } from "./models/storage-file-create.js";
import { StorageRunsResponse } from "./models/storage-run-response.js";
import { StorageRun } from "./models/storage-run.js";
import { SynchronizationApiClient } from "./synchronization-api-client.js";

export class SynchronizationApiService {
  private _synchronizationApiClient: SynchronizationApiClient;
  private _authorizationService: AuthorizationService;
  private _loggingCallbacks: LoggingCallbacks;

  constructor(synchronizationApiClient: SynchronizationApiClient, authorizationService: AuthorizationService, loggingCallbacks: LoggingCallbacks) {
    this._synchronizationApiClient = synchronizationApiClient;
    this._authorizationService = authorizationService;
    this._loggingCallbacks = loggingCallbacks;
  }

  public async authorize(): Promise<AuthInfo> {
    let response = await this._synchronizationApiClient.authorizeUserForConnection();

    // User is already logged in, no need to check it again
    if (response.authorizationInformation.isUserAuthorized) {
      return response.authorizationInformation;
    }

    if (!response.authorizationInformation._links.authorizationUrl.href) {
      this._loggingCallbacks.error("Connection authorization for user provided empty url");
    }

    // Create and start a server
    const server = http2.createServer();

    // Provide what kind of response server will return on a callback
    server.on("stream", (stream, headers) => {
      const reqPath = headers[":path"];
      if (reqPath === "/callback") {
        stream.respond({ ":status": 200, "content-type": "text/plain" });
        stream.end("Login successful! You can close this window.");
        this._loggingCallbacks.debug("Login successful!");
        server.close();
      }
    });

    // Provide which port the server is using
    server.listen(3301, () => {
      this._loggingCallbacks.debug("Waiting for login callback on http://localhost:3301/callback");
    });

    // Open page where authentication should happen
    await open(response.authorizationInformation._links.authorizationUrl.href);

    // Query regularly and check if authentication was successful.
    let index = 0;
    while (!response.authorizationInformation.isUserAuthorized && index++ < 10) {
      response = await this._synchronizationApiClient.authorizeUserForConnection();
      this._loggingCallbacks.debug(`Current state of user connection authentication is ${response.authorizationInformation.isUserAuthorized}`);
      await new Promise((r) => {
        setTimeout(r, 3000 * index);
      });
    }

    server.close();

    return response.authorizationInformation;
  }

  public async createConnection(
    iModelId: string,
    fileIds: string[],
    connectorTypes: ConnectorType[],
    name?: string,
    authenticationType?: AuthenticationType,
  ): Promise<StorageConnection | undefined> {
    const sourceFiles: StorageFileCreate[] = [];

    if (connectorTypes.length !== fileIds.length && connectorTypes.length !== 1) {
      this._loggingCallbacks.error(
        "When multiple connector-type options are provided, their amount must match file-id option amount. Alternatively, you can provide a single connector-type option, which will then be applied to all file-id options.",
      );
    }

    const isSingleConnectorTypeProvided = connectorTypes.length === 1;
    for (let i = 0; i < fileIds.length; i++) {
      const connectorType = isSingleConnectorTypeProvided ? connectorTypes[0] : connectorTypes[i];
      sourceFiles.push({
        connectorType,
        storageFileId: fileIds[i],
      });
    }

    const authInfo = await this._authorizationService.info();
    if (authenticationType === undefined) {
      authenticationType = authInfo.authorizationType === AuthorizationType.Service ? AuthenticationType.SERVICE : AuthenticationType.USER;
    }

    const response = await this._synchronizationApiClient.createStorageConnection({
      authenticationType,
      displayName: name,
      iModelId,
      sourceFiles,
    });

    return response.connection;
  }

  public async deleteConnection(connectionId: string): Promise<ResultResponse> {
    await this._synchronizationApiClient.deleteStorageConnection(connectionId);

    return { result: "deleted" };
  }

  public async getConnection(connectionId: string): Promise<StorageConnection | undefined> {
    const response = await this._synchronizationApiClient.getStorageConnection(connectionId);

    return response.connection;
  }

  public async getConnections(iModelId: string, skip?: number, top?: number): Promise<StorageConnectionListResponse> {
    const response = await this._synchronizationApiClient.getStorageConnections(iModelId, top, skip);

    return response;
  }

  public async updateConnection(connectionId: string, authenticationType?: AuthenticationType, name?: string): Promise<StorageConnection | undefined> {
    const response = await this._synchronizationApiClient.updateStorageConnection(connectionId, {
      authenticationType,
      displayName: name,
    });

    return response.connection;
  }

  public async createConnectionRun(connectionId: string): Promise<ResultResponse> {
    await this._synchronizationApiClient.createStorageConnectionRun(connectionId);

    return { result: "started" };
  }

  public async getConnectionRun(connectionId: string, connectionRunId: string): Promise<StorageRun | undefined> {
    const response = await this._synchronizationApiClient.getStorageConnectionRun(connectionId, connectionRunId);

    return response.run;
  }

  public async getConnectionRuns(connectionId: string, skip?: number, top?: number): Promise<StorageRunsResponse> {
    const response = await this._synchronizationApiClient.getStorageConnectionRuns(connectionId, top, skip);

    return response;
  }

  public async createConnectionSourceFile(connectionId: string, connectorType: ConnectorType, storageFileId: string): Promise<SourceFile> {
    const response = await this._synchronizationApiClient.addSourceFile(connectionId, {
      connectorType,
      storageFileId,
    });

    return response.sourceFile;
  }

  public async deleteConnectionSourceFile(connectionId: string, sourceFileId: string): Promise<ResultResponse> {
    await this._synchronizationApiClient.deleteSourceFile(connectionId, sourceFileId);

    return { result: "deleted" };
  }

  public async getConnectionSourceFile(connectionId: string, sourceFileId: string): Promise<SourceFile> {
    const response = await this._synchronizationApiClient.getSourceFile(connectionId, sourceFileId);

    return response.sourceFile;
  }

  public async getConnectionSourceFiles(connectionId: string, skip?: number, top?: number): Promise<SourceFile[]> {
    const response = await this._synchronizationApiClient.getSourceFiles(connectionId, top, skip);

    return response.sourceFiles;
  }

  public async updateConnectionSourceFile(
    connectionId: string,
    connectorType: ConnectorType,
    sourceFileId: string,
    storageFileId: string,
  ): Promise<SourceFile> {
    const response = await this._synchronizationApiClient.updateSourceFile(connectionId, sourceFileId, {
      connectorType,
      storageFileId,
    });

    return response.sourceFile;
  }

  public async findOrCreateConnection(
    iModelId: string,
    files: { connectorType: ConnectorType; fileId: string; fileName: string }[],
    name: string,
  ): Promise<string> {
    const existingConnections = (await this.getConnections(iModelId)).connections;

    this._loggingCallbacks.log(`Checking existing connections for iModel ID: ${iModelId}`);
    let connection = existingConnections.find((conn) => conn.displayName === name);
    if (!connection) {
      const authInfo = await this._authorizationService.info();
      const authType = authInfo.authorizationType === AuthorizationType.Service ? AuthenticationType.SERVICE : AuthenticationType.USER;

      this._loggingCallbacks.log(`Creating new default connection`);
      connection = await this.createConnection(iModelId, [files[0].fileId], [files[0].connectorType], name, authType);
      if (connection?.id === undefined) {
        this._loggingCallbacks.error("Storage connection id was not present");
      }
    }

    await Promise.all(files.map(async (file) => this.addFileToConnectionIfItIsNotPresent(connection.id, file)));

    this._loggingCallbacks.log(`Running connection for connection ID: ${connection.id}`);
    await this.createConnectionRun(connection.id);
    return connection.id;
  }

  private async addFileToConnectionIfItIsNotPresent(
    connectionId: string,
    file: { connectorType: ConnectorType; fileId: string; fileName: string },
  ): Promise<void> {
    const sourceFiles = await this.getConnectionSourceFiles(connectionId);
    const fileExist = sourceFiles.find((f) => f.storageFileId === file.fileId);
    if (!fileExist) {
      this._loggingCallbacks.log(`Adding file: ${file.fileId} to default connection: ${connectionId}`);
      await this.createConnectionSourceFile(connectionId, file.connectorType, file.fileId);
    }
  }

  public async runSynchronization(connectionId: string, waitForCompletion: boolean): Promise<string> {
    this._loggingCallbacks.log(`Running synchronization for connection ID: ${connectionId}`);
    const storageConnection = await this.getConnection(connectionId);
    if (!storageConnection?._links?.lastRun?.href) {
      this._loggingCallbacks.error(`No last run link available for storage connection: ${connectionId}`);
    }

    const runId = storageConnection?._links?.lastRun?.href.split("/")[8];
    let storageConnectionRun;
    do {
      storageConnectionRun = await this.getConnectionRun(connectionId, runId);

      await new Promise((resolve) => {
        setTimeout(resolve, 10_000);
      });
      this._loggingCallbacks.log(`Waiting for synchronization to complete for run ID: ${runId} with state: ${storageConnectionRun?.state}`);
    } while (waitForCompletion && storageConnectionRun?.state !== ExecutionState.COMPLETED);

    if (!waitForCompletion) {
      this._loggingCallbacks.log("Synchronization process started. Use the following command to check the status of the synchronization process:");
      this._loggingCallbacks.log(`itp imodel connection run info --connection-id ${connectionId} --connection-run-id ${runId}`);
      return runId;
    }

    if (storageConnectionRun?.result === ExecutionResult.SUCCESS) {
      this._loggingCallbacks.log("Synchronization process completed successfully.");
    } else {
      this._loggingCallbacks.error(
        `Synchronization run ${runId} resulted in an error. Run 'itp imodel connection run info --connection-id ${connectionId} --connection-run-id ${runId}' for more info.`,
      );
    }

    return runId;
  }
}
