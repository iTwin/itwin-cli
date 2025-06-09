/*---------------------------------------------------------------------------------------------
* Copyright (c) Bentley Systems, Incorporated. All rights reserved.
* See LICENSE.md in the project root for license terms and full copyright notice.
*--------------------------------------------------------------------------------------------*/

import { ITwinPlatformApiClient } from "../iTwin-api-client.js";
import { FileResponse, FilesResponse, ItemsResponse } from "./models/file-response.js";
import { FileUpload } from "./models/file-upload.js";
import { FolderInfo, FolderResponse, FoldersResponse } from "./models/folder-typed.js";
import { ItemsWithFolderLink } from "./models/items-with-folder-link.js";

export class StorageApiClient {
    private _iTwinPlatformApiClient: ITwinPlatformApiClient;

    constructor(client: ITwinPlatformApiClient) {
        this._iTwinPlatformApiClient = client;
    }

    public async completeFileUpload(fileId: string) : Promise<FileResponse> {
        return this._iTwinPlatformApiClient.sendRequest({
            apiPath: `storage/files/${fileId}/complete`,
            method: "POST"
        });
    }

    public async createFile(folderId: string, displayName: string, description?: string) : Promise<FileUpload> {
        return this._iTwinPlatformApiClient.sendRequest({
            apiPath: `storage/folders/${folderId}/files`,
            body: {
                description,
                displayName
            },
            method: "POST",
        });
    }

    public async createFolder(folderId: string, folder: FolderInfo): Promise<FolderResponse> {
        return this._iTwinPlatformApiClient.sendRequest({
            apiPath: `storage/folders/${folderId}/folders`,
            body: folder,
            method: 'POST'
        });
    }

    public async deleteFile(fileId: string): Promise<void> {
        await this._iTwinPlatformApiClient.sendRequestNoResponse({
            apiPath: `storage/files/${fileId}`,
            method: "DELETE",
        });
    }

    public async deleteFolder(folderId: string): Promise<void> {
        await this._iTwinPlatformApiClient.sendRequestNoResponse({
            apiPath: `storage/folders/${folderId}`,
            method: 'DELETE'
        });
    }

    public async getFile(fileId: string): Promise<FileResponse> {
        return this._iTwinPlatformApiClient.sendRequest({
            apiPath: `storage/files/${fileId}`,
            method: "GET",
        });
    }

    public async getFiles(folderId: string): Promise<FilesResponse> {
        return this._iTwinPlatformApiClient.sendRequest({
            apiPath: `storage/folders/${folderId}/files`,
            method: "GET",
        });
    }

    public async getFilesAndFolders(folderId: string): Promise<ItemsResponse> {
        return this._iTwinPlatformApiClient.sendRequest({
            apiPath: `storage/folders/${folderId}/list`,
            method: "GET",
        });
    }

    public async getFolder(folderId: string): Promise<FolderResponse> {
        return this._iTwinPlatformApiClient.sendRequest({
            apiPath: `storage/folders/${folderId}`,
            method: 'GET'
        });
    }

    public async getFolders(folderId: string): Promise<FoldersResponse> {
        return this._iTwinPlatformApiClient.sendRequest({
            apiPath: `storage/folders/${folderId}/folders`,
            method: 'GET'
        });
    }

    public async getTopLevelFoldersAndFiles(iTwinId: string, top?: number, skip?: number) : Promise<ItemsWithFolderLink> {
        return this._iTwinPlatformApiClient.sendRequest({
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

    public async updateFile(fileId: string, displayName?: string, description?: string) : Promise<FileResponse> {
        return this._iTwinPlatformApiClient.sendRequest({
            apiPath: `storage/files/${fileId}`,
            body: {
                description,
                displayName
            },
            method: "PATCH",
        });
    }

    public async updateFileContent(fileId: string) : Promise<FileUpload> {
        return this._iTwinPlatformApiClient.sendRequest({
            apiPath: `storage/files/${fileId}/updatecontent`,
            method: "POST"
        });
    }

    public async updateFolder(folderId: string, folderInfo: FolderInfo): Promise<FolderResponse> {
        return this._iTwinPlatformApiClient.sendRequest({
            apiPath: `storage/folders/${folderId}`,
            body: folderInfo,
            method: 'PATCH'
        });
    }

    public async uploadFile(url: string, file: ArrayBuffer) {
        return fetch(url, {
            body: file,
            headers: { 'x-ms-blob-type': 'BlockBlob' },
            method: 'PUT',
        });
    }
}
