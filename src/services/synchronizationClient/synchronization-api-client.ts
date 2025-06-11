/*---------------------------------------------------------------------------------------------
* Copyright (c) Bentley Systems, Incorporated. All rights reserved.
* See LICENSE.md in the project root for license terms and full copyright notice.
*--------------------------------------------------------------------------------------------*/

import { ITwinPlatformApiClient } from "../iTwin-api-client.js";
import { ConnectionAuth } from "./models/connection-auth.js";
import { SourceFileInfo, SourceFileResponse, SourceFilesResponse } from "./models/source-file.js";
import { StorageConnectionCreate } from "./models/storage-connection-create.js";
import { StorageConnectionListResponse, StorageConnectionResponse, StorageConnectionUpdate } from "./models/storage-connection-response.js";
import { StorageRunResponse, StorageRunsResponse } from "./models/storage-run-response.js";

export class SynchronizationApiClient {
  private _iTwinPlatformApiClient: ITwinPlatformApiClient;

  constructor(client: ITwinPlatformApiClient) {
    this._iTwinPlatformApiClient = client;
  }

  public async addSourceFile(connectionId: string, sourceFile: SourceFileInfo): Promise<SourceFileResponse> {
    return this._iTwinPlatformApiClient.sendRequest({
      apiPath: `synchronization/imodels/storageconnections/${connectionId}/sourcefiles`,
      body: sourceFile,
      method: "POST"
    });
  }

  public async authorizeUserForConnection(): Promise<ConnectionAuth> {
    return this._iTwinPlatformApiClient.sendRequest({
      apiPath: 'synchronization/imodels/connections/authorizationinformation',
      method: 'GET',
      query: [
        {
          key: 'redirectUrl',
          value: 'http://localhost:3301/callback'
        }
      ]
    });
  }

  public async createStorageConnection(connection: StorageConnectionCreate): Promise<StorageConnectionResponse> {
    return this._iTwinPlatformApiClient.sendRequest({
      apiPath: 'synchronization/imodels/storageconnections',
      body: connection,
      method: 'POST'
    });
  }

  public async createStorageConnectionRun(connectionId: string): Promise<void> {
    await this._iTwinPlatformApiClient.sendRequestNoResponse({
      apiPath: `synchronization/imodels/storageconnections/${connectionId}/run`,
      method: "POST"
    });
  }

  public async deleteSourceFile(connectionId: string, sourceFileId: string): Promise<void> {
    await this._iTwinPlatformApiClient.sendRequestNoResponse({
      apiPath: `synchronization/imodels/storageconnections/${connectionId}/sourcefiles/${sourceFileId}`,
      method: "DELETE",
    });
  }

  public async deleteStorageConnection(connectionId: string): Promise<void> {
    await this._iTwinPlatformApiClient.sendRequestNoResponse({
      apiPath: `synchronization/imodels/storageconnections/${connectionId}`,
      method: "DELETE",
    });
  }

  public async getSourceFile(connectionId: string, sourceFileId: string): Promise<SourceFileResponse> {
    return this._iTwinPlatformApiClient.sendRequest({
      apiPath: `synchronization/imodels/storageconnections/${connectionId}/sourcefiles/${sourceFileId}`,
      method: "GET"
    });
  }

  public async getSourceFiles(connectionId: string, top?: number, skip?: number): Promise<SourceFilesResponse> {
    return this._iTwinPlatformApiClient.sendRequest({
      apiPath: `synchronization/imodels/storageconnections/${connectionId}/sourcefiles`,
      headers: {
        // eslint-disable-next-line @typescript-eslint/naming-convention
        Prefer: "return=representation"
      },
      method: "GET",
      query: [
        {
          key: '$top',
          value: top
        },
        {
          key: '$skip',
          value: skip
        }
      ]
    });
  }

  public async getStorageConnection(connectionId: string): Promise<StorageConnectionResponse> {
    return this._iTwinPlatformApiClient.sendRequest({
      apiPath: `synchronization/imodels/storageconnections/${connectionId}`,
      method: 'GET'
    });
  }

  public async getStorageConnectionRun(connectionId: string, runId: string): Promise<StorageRunResponse> {
    return this._iTwinPlatformApiClient.sendRequest({
      apiPath: `synchronization/imodels/storageconnections/${connectionId}/runs/${runId}`,
      method: "GET"
    });
  }

  public async getStorageConnectionRuns(connectionId: string, top?: number, skip?: number): Promise<StorageRunsResponse> {
    return this._iTwinPlatformApiClient.sendRequest({
      apiPath: `synchronization/imodels/storageconnections/${connectionId}/runs`,
      method: "GET",
      query: [
        {
          key: '$top',
          value: top
        },
        {
          key: '$skip',
          value: skip
        }
      ]
    });
  }

  public async getStorageConnections(iModelId: string, top?: number, skip?: number): Promise<StorageConnectionListResponse> {
    return this._iTwinPlatformApiClient.sendRequest({
      apiPath: `synchronization/imodels/storageconnections`,
      method: 'GET',
      query: [
        {
          key: 'imodelId',
          value: iModelId
        },
        {
          key: '$top',
          value: top
        },
        {
          key: '$skip',
          value: skip
        }

      ]
    });
  }

  public async updateSourceFile(connectionId: string, sourceFileId: string, update: SourceFileInfo): Promise<SourceFileResponse> {
    return this._iTwinPlatformApiClient.sendRequest({
      apiPath: `synchronization/imodels/storageconnections/${connectionId}/sourcefiles/${sourceFileId}`,
      body: update,
      method: "PUT"
    });
  }

  public async updateStorageConnection(connectionId: string, update: StorageConnectionUpdate): Promise<StorageConnectionResponse> {
    return this._iTwinPlatformApiClient.sendRequest({
      apiPath: `synchronization/imodels/storageconnections/${connectionId}`,
      body: update,
      method: "PUT"
    });
  }
}
