/*---------------------------------------------------------------------------------------------
 * Copyright (c) Bentley Systems, Incorporated. All rights reserved.
 * See LICENSE.md in the project root for license terms and full copyright notice.
 *--------------------------------------------------------------------------------------------*/

import fs from "node:fs";

import { LoggingCallbacks } from "../general-models/logging-callbacks.js";
import { ResultResponse } from "../general-models/result-response.js";
import { ConnectorType } from "../synchronization/models/connector-type.js";
import { ConnectorFileInfo } from "./models/connector-file-info.js";
import { FileTypedType } from "./models/file-typed-type.js";
import { FileTyped } from "./models/file-typed.js";
import { FileUpload } from "./models/file-upload.js";
import { FolderTyped } from "./models/folder-typed.js";
import { ItemsWithFolderLink } from "./models/items-with-folder-link.js";
import { StorageApiClient } from "./storage-api-client.js";

export class StorageApiService {
  private _storageApiClient: StorageApiClient;
  private _loggingCallbacks: LoggingCallbacks;

  constructor(storageApiClient: StorageApiClient, loggingCallbacks: LoggingCallbacks) {
    this._storageApiClient = storageApiClient;
    this._loggingCallbacks = loggingCallbacks;
  }

  public async initiateFileCreation(folderId: string, name: string, description?: string): Promise<FileUpload> {
    const result = await this._storageApiClient.createFile(folderId, name, description);
    return result;
  }

  public async deleteFile(fileId: string): Promise<ResultResponse> {
    await this._storageApiClient.deleteFile(fileId);
    return { result: "deleted" };
  }

  public async getFile(fileId: string): Promise<FileTyped | undefined> {
    const result = await this._storageApiClient.getFile(fileId);
    return result.file;
  }

  public async getFiles(folderId: string, includeFolders: boolean): Promise<FileTyped[]> {
    if (includeFolders) {
      const filesAndFoldersResult = await this._storageApiClient.getFilesAndFolders(folderId);
      return filesAndFoldersResult.items;
    }

    const filesResult = await this._storageApiClient.getFiles(folderId);
    return filesResult.files;
  }

  public async completeFileUpload(fileId: string): Promise<FileTyped | undefined> {
    const result = await this._storageApiClient.completeFileUpload(fileId);
    return result.file;
  }

  public async initiateFileContentUpdate(fileId: string): Promise<FileUpload> {
    const result = await this._storageApiClient.updateFileContent(fileId);
    return result;
  }

  public async updateFileMetadata(fileId: string, name?: string, description?: string): Promise<FileTyped | undefined> {
    const result = await this._storageApiClient.updateFile(fileId, name, description);
    return result.file;
  }

  public async uploadFile(filePath: string, uploadUrl: string): Promise<ResultResponse> {
    const fileBuffer = fs.readFileSync(filePath);
    const fileArrayBuffer = this.toArrayBuffer(fileBuffer);

    const response = await this._storageApiClient.uploadFile(uploadUrl, fileArrayBuffer);
    if (response.status < 200 || response.status >= 300) {
      this._loggingCallbacks.error(`Encountered a problem when placing information to blob storage: ${response.statusText}`);
    }

    return { result: "uploaded" };
  }

  private toArrayBuffer(buffer: Buffer): ArrayBuffer {
    const arrayBuffer = new ArrayBuffer(buffer.length);
    const view = new Uint8Array(arrayBuffer);
    for (const [i, element] of buffer.entries()) {
      view[i] = element;
    }

    return arrayBuffer;
  }

  public async createFolder(parentFolderId: string, name: string, description?: string): Promise<FolderTyped> {
    const result = await this._storageApiClient.createFolder(parentFolderId, {
      description,
      displayName: name,
    });
    return result.folder;
  }

  public async deleteFolder(folderId: string): Promise<ResultResponse> {
    await this._storageApiClient.deleteFolder(folderId);
    return { result: "deleted" };
  }

  public async getFolder(folderId: string): Promise<FolderTyped> {
    const result = await this._storageApiClient.getFolder(folderId);
    return result.folder;
  }

  public async getFolders(folderId: string, includeFiles: boolean): Promise<FileTyped[] | FolderTyped[]> {
    if (includeFiles) {
      const filesAndFoldersResult = await this._storageApiClient.getFilesAndFolders(folderId);
      return filesAndFoldersResult.items;
    }

    const filesResult = await this._storageApiClient.getFolders(folderId);
    return filesResult.folders;
  }

  public async updateFolderMetadata(folderId: string, name?: string, description?: string): Promise<FolderTyped> {
    const result = await this._storageApiClient.updateFolder(folderId, {
      description,
      displayName: name,
    });
    return result.folder;
  }

  public async getTopLevelFoldersAndFiles(iTwinId: string, skip?: number, top?: number): Promise<ItemsWithFolderLink> {
    const result = await this._storageApiClient.getTopLevelFoldersAndFiles(iTwinId, top, skip);
    return result;
  }

  public async createOrUpdateFileInFolder(
    folder: ItemsWithFolderLink,
    folderId: string,
    fileInfo: ConnectorFileInfo,
  ): Promise<{ connectorType: ConnectorType; fileId: string; fileName: string }> {
    this._loggingCallbacks.log(`Processing file: ${fileInfo.fileName}`);
    const foundFile = folder.items?.find((entry) => entry.type === FileTypedType.FILE && entry.displayName === fileInfo.fileName);

    let fileId: string;
    if (foundFile?.id) {
      fileId = await this.updateFileContent(foundFile.id, fileInfo);
    } else {
      fileId = await this.createFile(folderId, fileInfo);
    }

    return { connectorType: fileInfo.connectorType, fileId, fileName: fileInfo.fileName };
  }

  private async createFile(folderId: string, fileInfo: ConnectorFileInfo): Promise<string> {
    this._loggingCallbacks.log(`Initializing creation of a new file: ${fileInfo.fileName}`);
    const newFile = await this.initiateFileCreation(folderId, fileInfo.fileName);

    const uploadUrl = newFile._links?.uploadUrl?.href;
    const completeUrl = newFile._links?.completeUrl?.href;
    if (uploadUrl === undefined || completeUrl === undefined) {
      this._loggingCallbacks.error("No upload url was provided when creating a file");
    }
    const fileId = completeUrl.split("/")[5];

    this._loggingCallbacks.log(`Uploading file content for file: ${fileInfo.fileName}`);
    await this.uploadFile(fileInfo.fullFilePath, uploadUrl);

    this._loggingCallbacks.log(`Completing file upload for file: '${fileInfo.fileName}' with ID: ${fileId}`);
    await this.completeFileUpload(fileId);

    return fileId;
  }

  private async updateFileContent(fileId: string, fileInfo: ConnectorFileInfo): Promise<string> {
    this._loggingCallbacks.log(`Initializing update for existing file: '${fileInfo.fileName}' with ID: ${fileId}`);
    const updateFile = await this.initiateFileContentUpdate(fileId);

    const uploadUrl = updateFile._links?.uploadUrl?.href;
    const completeUrl = updateFile._links?.completeUrl?.href;
    if (uploadUrl === undefined || completeUrl === undefined) {
      this._loggingCallbacks.error("No upload url was provided when creating content update for a file");
    }

    this._loggingCallbacks.log(`Updating file content for file: ${fileInfo.fileName}`);
    await this.uploadFile(fileInfo.fullFilePath, uploadUrl);

    this._loggingCallbacks.log(`Completing file upload for file: '${fileInfo.fileName}' with ID: ${fileId}`);
    await this.completeFileUpload(fileId);

    return fileId;
  }
}
