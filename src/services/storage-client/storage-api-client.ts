/*---------------------------------------------------------------------------------------------
* Copyright (c) Bentley Systems, Incorporated. All rights reserved.
* See LICENSE.md in the project root for license terms and full copyright notice.
*--------------------------------------------------------------------------------------------*/

import { ITwinPlatformApiClient } from "../iTwin-api-client.js";
import { fileResponse, filesResponse, itemsResponse } from "./models/file-response.js";
import { fileUpload } from "./models/file-upload.js";
import { folderInfo, folderResponse, foldersResponse } from "./models/folder-typed.js";
import { itemsWithFolderLink } from "./models/items-with-folder-link.js";

export class StorageApiClient {
    iTwinPlatformApiClient: ITwinPlatformApiClient;

    constructor(client: ITwinPlatformApiClient) {
        this.iTwinPlatformApiClient = client;
    }

    completeFileUpload(fileId: string) : Promise<fileResponse> {
        return this.iTwinPlatformApiClient.sendRequest({
            apiPath: `storage/files/${fileId}/complete`,
            method: "POST"
        });
    }

    createFile(folderId: string, displayName: string, description?: string) : Promise<fileUpload> {
        return this.iTwinPlatformApiClient.sendRequest({
            apiPath: `storage/folders/${folderId}/files`,
            body: {
                description,
                displayName
            },
            method: "POST",
        });
    }

    createFolder(folderId: string, folder: folderInfo): Promise<folderResponse> {
        return this.iTwinPlatformApiClient.sendRequest({
            apiPath: `storage/folders/${folderId}/folders`,
            body: folder,
            method: 'POST'
        });
    }

    async deleteFile(fileId: string): Promise<void> {
        await this.iTwinPlatformApiClient.sendRequestNoResponse({
            apiPath: `storage/files/${fileId}`,
            method: "DELETE",
        });
    }

    async deleteFolder(folderId: string): Promise<void> {
        await this.iTwinPlatformApiClient.sendRequestNoResponse({
            apiPath: `storage/folders/${folderId}`,
            method: 'DELETE'
        });
    }

    getFile(fileId: string): Promise<fileResponse> {
        return this.iTwinPlatformApiClient.sendRequest({
            apiPath: `storage/files/${fileId}`,
            method: "GET",
        });
    }

    getFiles(folderId: string): Promise<filesResponse> {
        return this.iTwinPlatformApiClient.sendRequest({
            apiPath: `storage/folders/${folderId}/files`,
            method: "GET",
        });
    }

    getFilesAndFolders(folderId: string): Promise<itemsResponse> {
        return this.iTwinPlatformApiClient.sendRequest({
            apiPath: `storage/folders/${folderId}/list`,
            method: "GET",
        });
    }

    getFolder(folderId: string): Promise<folderResponse> {
        return this.iTwinPlatformApiClient.sendRequest({
            apiPath: `storage/folders/${folderId}`,
            method: 'GET'
        });
    }

    getFolders(folderId: string): Promise<foldersResponse> {
        return this.iTwinPlatformApiClient.sendRequest({
            apiPath: `storage/folders/${folderId}/folders`,
            method: 'GET'
        });
    }

    getTopLevelFoldersAndFiles(iTwinId: string, top?: number, skip?: number) : Promise<itemsWithFolderLink> {
        return this.iTwinPlatformApiClient.sendRequest({
            apiPath: `storage/`,
            headers: { accept: "application/vnd.bentley.itwin-platform.v1+json" },
            method: 'GET',
            query: [
                {
                    key: 'iTwinId',
                    value: iTwinId
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

    updateFile(fileId: string, displayName?: string, description?: string) : Promise<fileResponse> {
        return this.iTwinPlatformApiClient.sendRequest({
            apiPath: `storage/files/${fileId}`,
            body: {
                description,
                displayName
            },
            method: "PATCH",
        });
    }

    updateFileContent(fileId: string) : Promise<fileUpload> {
        return this.iTwinPlatformApiClient.sendRequest({
            apiPath: `storage/files/${fileId}/updatecontent`,
            method: "POST"
        });
    }

    updateFolder(folderId: string, folderInfo: folderInfo): Promise<folderResponse> {
        return this.iTwinPlatformApiClient.sendRequest({
            apiPath: `storage/folders/${folderId}`,
            body: folderInfo,
            method: 'PATCH'
        });
    }

    uploadFile(url: string, file: ArrayBuffer) {
        return fetch(url, {
            body: file,
            headers: { 'x-ms-blob-type': 'BlockBlob' },
            method: 'PUT',
        });
    }
}
