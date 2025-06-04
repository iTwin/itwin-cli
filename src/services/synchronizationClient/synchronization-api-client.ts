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
    iTwinPlatformApiClient: ITwinPlatformApiClient;

    constructor(client: ITwinPlatformApiClient) {
        this.iTwinPlatformApiClient = client;
    }

    addSourceFile(connectionId: string, sourceFile: SourceFileInfo): Promise<SourceFileResponse> {
        return this.iTwinPlatformApiClient.sendRequest({
            apiPath: `synchronization/imodels/storageconnections/${connectionId}/sourcefiles`,
            body: sourceFile,
            method: "POST"
        });
    }

    authorizeUserForConnection(): Promise<ConnectionAuth> {
        return this.iTwinPlatformApiClient.sendRequest({
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

    createStorageConnection(connection: StorageConnectionCreate): Promise<StorageConnectionResponse> {
        return this.iTwinPlatformApiClient.sendRequest({
            apiPath: 'synchronization/imodels/storageconnections',
            body: connection,
            method: 'POST'
        });
    }

    async createStorageConnectionRun(connectionId: string) {
        await this.iTwinPlatformApiClient.sendRequestNoResponse({
            apiPath: `synchronization/imodels/storageconnections/${connectionId}/run`,
            method: "POST"
        });
    }

    async deleteSourceFile(connectionId: string, sourceFileId: string): Promise<void> {
        await this.iTwinPlatformApiClient.sendRequestNoResponse({
            apiPath: `synchronization/imodels/storageconnections/${connectionId}/sourcefiles/${sourceFileId}`,
            method: "DELETE",
        });
    }

    async deleteStorageConnection(connectionId: string): Promise<void> {
        await this.iTwinPlatformApiClient.sendRequestNoResponse({
            apiPath: `synchronization/imodels/storageconnections/${connectionId}`,
            method: "DELETE",
        });
    }

    getSourceFile(connectionId: string, sourceFileId: string): Promise<SourceFileResponse> {
        return this.iTwinPlatformApiClient.sendRequest({
            apiPath: `synchronization/imodels/storageconnections/${connectionId}/sourcefiles/${sourceFileId}`,
            method: "GET"
        });
    }

    getSourceFiles(connectionId: string, top?: number, skip?: number): Promise<SourceFilesResponse> {
        return this.iTwinPlatformApiClient.sendRequest({
            apiPath: `synchronization/imodels/storageconnections/${connectionId}/sourcefiles`,
            headers: {
                "Prefer": "return=representation"
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

    getStorageConnection(connectionId: string): Promise<StorageConnectionResponse> {
        return this.iTwinPlatformApiClient.sendRequest({
            apiPath: `synchronization/imodels/storageconnections/${connectionId}`,
            method: 'GET'
        });
    }

    getStorageConnectionRun(connectionId: string, runId: string) : Promise<StorageRunResponse> {
        return this.iTwinPlatformApiClient.sendRequest({
            apiPath: `synchronization/imodels/storageconnections/${connectionId}/runs/${runId}`,
            method: "GET"
        });
    }

    getStorageConnectionRuns(connectionId: string, top?: number, skip?: number): Promise<StorageRunsResponse> {
        return this.iTwinPlatformApiClient.sendRequest({
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

    getStorageConnections(iModelId: string, top?: number, skip?: number): Promise<StorageConnectionListResponse> {
        return this.iTwinPlatformApiClient.sendRequest({
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

    updateSourceFile(connectionId: string, sourceFileId: string, update: SourceFileInfo): Promise<SourceFileResponse> {
        return this.iTwinPlatformApiClient.sendRequest({
            apiPath: `synchronization/imodels/storageconnections/${connectionId}/sourcefiles/${sourceFileId}`,
            body: update,
            method: "PUT"
        });
    }

    updateStorageConnection(connectionId: string, update: StorageConnectionUpdate): Promise<StorageConnectionResponse> {
        return this.iTwinPlatformApiClient.sendRequest({
            apiPath: `synchronization/imodels/storageconnections/${connectionId}`,
            body: update,
            method: "PUT"
        });
    }
}
