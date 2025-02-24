/*---------------------------------------------------------------------------------------------
* Copyright (c) Bentley Systems, Incorporated. All rights reserved.
* See LICENSE.md in the project root for license terms and full copyright notice.
*--------------------------------------------------------------------------------------------*/

import { ITwinPlatformApiClient } from "../iTwin-api-client.js";
import { fileBase } from "./models/file-base.js";
import { fileResponse, filesRepsonse, itemsRepsonse } from "./models/file-response.js";
import { fileUpload } from "./models/file-upload.js";
import { folderInfo, folderResponse, foldersResponse } from "./models/folder-typed.js";
import { itemsWithFolderLink } from "./models/items-with-folder-link.js";

export class StorageApiClient {
    iTwinPlatformApiClient: ITwinPlatformApiClient;

    constructor(client: ITwinPlatformApiClient) {
        this.iTwinPlatformApiClient = client;
    }

    async completeFileUpload(fileId: string) {
        return this.iTwinPlatformApiClient.sendRequestWithBody<fileResponse, undefined>({
            apiPath: `storage/files/${fileId}/complete`,
            method: "POST"
        });
    }

    async createFile(folderId: string, displayName: string, description?: string) {
        return this.iTwinPlatformApiClient.sendRequestWithBody<fileUpload, fileBase>({
            apiPath: `storage/folders/${folderId}/files`,
            body: {
                description,
                displayName
            },
            method: "POST",
        });
    }

    async createFolder(folderId: string, folder: folderInfo): Promise<folderResponse> {
        return this.iTwinPlatformApiClient.sendRequestWithBody({
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

    async getFile(fileId: string): Promise<fileResponse> {
        return this.iTwinPlatformApiClient.sendRequest({
            apiPath: `storage/files/${fileId}`,
            method: "GET",
        });
    }

    async getFiles(folderId: string): Promise<filesRepsonse> {
        return this.iTwinPlatformApiClient.sendRequest({
            apiPath: `storage/folders/${folderId}/files`,
            method: "GET",
        });
    }

    async getFilesAndFolders(folderId: string): Promise<itemsRepsonse> {
        return this.iTwinPlatformApiClient.sendRequest({
            apiPath: `storage/folders/${folderId}/list`,
            method: "GET",
        });
    }

    async getFolder(folderId: string): Promise<folderResponse> {
        return this.iTwinPlatformApiClient.sendRequest({
            apiPath: `storage/folders/${folderId}`,
            method: 'GET'
        });
    }

    async getFolders(folderId: string): Promise<foldersResponse> {
        return this.iTwinPlatformApiClient.sendRequest({
            apiPath: `storage/folders/${folderId}/folders`,
            method: 'GET'
        });
    }

    async getTopLevelFoldersAndFiles(iTwinId: string, top?: number, skip?: number) {
        return this.iTwinPlatformApiClient.sendRequestWithBody<itemsWithFolderLink, undefined>({
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

    async updateFile(fileId: string, displayName?: string, description?: string) {
        return this.iTwinPlatformApiClient.sendRequestWithBody<fileResponse, fileBase>({
            apiPath: `storage/files/${fileId}`,
            body: {
                description,
                displayName
            },
            method: "PATCH",
        });
    }

    async updateFileContent(fileId: string) {
        return this.iTwinPlatformApiClient.sendRequest<fileUpload>({
            apiPath: `storage/files/${fileId}/updatecontent`,
            method: "POST"
        });
    }

    async updateFolder(folderId: string, folderInfo: folderInfo): Promise<folderResponse> {
        return this.iTwinPlatformApiClient.sendRequestWithBody({
            apiPath: `storage/folders/${folderId}`,
            body: folderInfo,
            method: 'PATCH'
        });
    }

    async uploadFile(url: string, file: ArrayBuffer) {
        return fetch(url, {
            body: file,
            headers: { 'x-ms-blob-type': 'BlockBlob' },
            method: 'PUT',
        });
    }
}
