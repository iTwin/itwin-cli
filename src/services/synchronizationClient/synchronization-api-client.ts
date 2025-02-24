/*---------------------------------------------------------------------------------------------
* Copyright (c) Bentley Systems, Incorporated. All rights reserved.
* See LICENSE.md in the project root for license terms and full copyright notice.
*--------------------------------------------------------------------------------------------*/

import { ITwinPlatformApiClient } from "../iTwin-api-client.js";
import { connectionAuth } from "./models/connection-auth.js";
import { sourceFileInfo, sourceFileResponse, sourceFilesResponse } from "./models/source-file.js";
import { storageConnectionCreate } from "./models/storage-connection-create.js";
import { storageConnectionListResponse, storageConnectionResponse, storageConnectionUpdate } from "./models/storage-connection-response.js";
import { storageRunResponse, storageRunsResponse } from "./models/storage-run-response.js";

export class SynchronizationApiClient {
    iTwinPlatformApiClient: ITwinPlatformApiClient;

    constructor(client: ITwinPlatformApiClient) {
        this.iTwinPlatformApiClient = client;
    }

    addSourceFile(connectionId: string, sourceFile: sourceFileInfo): Promise<sourceFileResponse> {
        return this.iTwinPlatformApiClient.sendRequestWithBody({
            apiPath: `synchronization/imodels/storageconnections/${connectionId}/sourcefiles`,
            body: sourceFile,
            method: "POST"
        });
    }

    authorizeUserForConnection(): Promise<connectionAuth> {
        return this.iTwinPlatformApiClient.sendRequest({
            apiPath: 'synchronization/imodels/connections/authorizationinformation',
            method: 'GET',
            query: [
                {
                    key: 'redirectUrl',
                    value: 'http://localhost:3000/callback'
                }
            ]
        });
    }

    createStorageConnection(connection: storageConnectionCreate): Promise<storageConnectionResponse> {
        return this.iTwinPlatformApiClient.sendRequestWithBody<storageConnectionResponse, storageConnectionCreate>({
            apiPath: 'synchronization/imodels/storageconnections',
            body: connection,
            method: 'POST'
        });
    }

    createStorageConnectionRun(connectionId: string) {
        return this.iTwinPlatformApiClient.sendRequestNoResponse({
            apiPath: `synchronization/imodels/storageconnections/${connectionId}/run`,
            method: "POST"
        });
    }

    deleteSourceFile(connectionId: string, sourceFileId: string): Promise<void> {
        return this.iTwinPlatformApiClient.sendRequestNoResponse({
            apiPath: `synchronization/imodels/storageconnections/${connectionId}/sourcefiles/${sourceFileId}`,
            method: "DELETE",
        });
    }

    deleteStorageConnection(connectionId: string): Promise<void> {
        return this.iTwinPlatformApiClient.sendRequestNoResponse({
            apiPath: `synchronization/imodels/storageconnections/${connectionId}`,
            method: "DELETE",
        });
    }

    getSourceFile(connectionId: string, sourceFileId: string): Promise<sourceFileResponse> {
        return this.iTwinPlatformApiClient.sendRequest({
            apiPath: `synchronization/imodels/storageconnections/${connectionId}/sourcefiles/${sourceFileId}`,
            method: "GET"
        });
    }

    getSourceFiles(connectionId: string): Promise<sourceFilesResponse> {
        return this.iTwinPlatformApiClient.sendRequest({
            apiPath: `synchronization/imodels/storageconnections/${connectionId}/sourcefiles`,
            method: "GET"
        });
    }

    getStorageConnection(connectionId: string): Promise<storageConnectionResponse> {
        return this.iTwinPlatformApiClient.sendRequestWithBody<storageConnectionResponse, undefined>({
            apiPath: `synchronization/imodels/storageconnections/${connectionId}`,
            method: 'GET'
        });
    }

    getStorageConnectionRun(connectionId: string, runId: string) {
        return this.iTwinPlatformApiClient.sendRequestWithBody<storageRunResponse, undefined>({
            apiPath: `synchronization/imodels/storageconnections/${connectionId}/runs/${runId}`,
            method: "GET"
        });
    }

    getStorageConnectionRuns(connectionId: string): Promise<storageRunsResponse> {
        return this.iTwinPlatformApiClient.sendRequest({
            apiPath: `synchronization/imodels/storageconnections/${connectionId}/runs`,
            method: "GET"
        });
    }

    getStorageConnections(iModelId: string): Promise<storageConnectionListResponse> {
        return this.iTwinPlatformApiClient.sendRequest({
            apiPath: `synchronization/imodels/storageconnections`,
            method: 'GET',
            query: [
                {
                    key: 'imodelId',
                    value: iModelId
                }
            ]
        });
    }

    updateSourceFile(connectionId: string, sourceFileId: string, update: sourceFileInfo): Promise<sourceFileResponse> {
        return this.iTwinPlatformApiClient.sendRequestWithBody({
            apiPath: `synchronization/imodels/storageconnections/${connectionId}/sourcefiles/${sourceFileId}`,
            body: update,
            method: "PUT"
        });
    }

    updateStorageConnection(connectionId: string, update: storageConnectionUpdate): Promise<storageConnectionResponse> {
        return this.iTwinPlatformApiClient.sendRequestWithBody({
            apiPath: `synchronization/imodels/storageconnections/${connectionId}`,
            body: update,
            method: "PUT"
        });
    }
}
