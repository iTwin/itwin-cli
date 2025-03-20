/* eslint-disable no-await-in-loop */

/*---------------------------------------------------------------------------------------------
* Copyright (c) Bentley Systems, Incorporated. All rights reserved.
* See LICENSE.md in the project root for license terms and full copyright notice.
*--------------------------------------------------------------------------------------------*/

import { IModel } from "@itwin/imodels-client-management"
import { Flags } from "@oclif/core"
import fs from "node:fs"
import path from "node:path"

import BaseCommand from "../../extensions/base-command.js"
import { authorizationInformation } from "../../services/authorization-client/authorization-type.js"
import { fileUpload } from "../../services/storage-client/models/file-upload.js"
import { itemsWithFolderLink } from "../../services/storage-client/models/items-with-folder-link.js"
import { authInfo } from "../../services/synchronizationClient/models/connection-auth.js"
import { connectorType } from "../../services/synchronizationClient/models/connector-type.js"
import { executionState } from "../../services/synchronizationClient/models/execution-state.js"
import { sourceFile } from "../../services/synchronizationClient/models/source-file.js"
import { StorageConnection } from "../../services/synchronizationClient/models/storage-connection.js"
import { storageConnectionListResponse } from "../../services/synchronizationClient/models/storage-connection-response.js"
import { storageRun } from "../../services/synchronizationClient/models/storage-run.js"

export default class PopulateIModel extends BaseCommand {    
  static description = 'Synchronize design files into an iModel.'

  static examples = [
    `<%= config.bin %> <%= command.id %>`,
  ]

  static flags = {
    "connector-type": Flags.string({ 
        char: 'c',
        description: 'Specify connectors to prioritize for synchronization. This flag can be provided multiple times. If only one connector is specified, it will be used for all files. If multiple connectors are specified, each connector will be used for the corresponding file in the files list (first connector for the first file, second connector for the second file, and so on).', 
        multiple: true,
        options: [
            'AUTOPLANT',
            'AVEVAPID',
            'CIVIL',
            'CIVIL3D',
            'DWG',
            'GEOSPATIAL',
            'IFC',
            'MSTN',
            'NWD',
            'OBD',
            'OPENTOWER',
            'REVIT',
            'SPPID',
            'SPXREVIEW' 
        ],
        required: false,
        type: "option"
      }),
    file: Flags.file({ 
        char: 'f', 
        description: 'Specify a list of source files to synchronize into the iModel.', 
        multiple: true,
        required: true
      }),
    "imodel-id": Flags.string({ 
        description: 'The ID of the iModel to populate.', 
        required: true,
    }),
    "no-wait": Flags.boolean({
        description: 'Do not wait for the synchronization process to complete.',
        required: false,
    }),
  }

  async run() {
    const { flags } = await this.parse(PopulateIModel);

    const filesAndConnectorToImport = this.checkAndGetFilesWithConnectors(flags.file, flags["connector-type"]);
    this.log(`Synchronizing files into iModel with ID: ${flags["imodel-id"]}`);
    const iModel = await this.runCommand<IModel>('imodel:info', ['--imodel-id', flags["imodel-id"]]);

    this.log(`Fetching root folder for iTwin: ${iModel.iTwinId}`);
    const topFolders = await this.runCommand<itemsWithFolderLink>('storage:root-folder', ['--itwin-id', iModel.iTwinId]);
    const rootFolderId = topFolders?._links?.folder?.href?.split('/').pop();
    if (rootFolderId === undefined) {
      this.error(`Unable to get root folder for iTwin: ${iModel.iTwinId}`);
    }

    const summary = [];
    const fileIds = [];

    for (const [, fileInfo] of filesAndConnectorToImport.entries()) {
      this.log(`Processing file: ${fileInfo.fileName}`);
      const fileExists = topFolders.items?.find(entry => entry.type === 'file' && entry.displayName === fileInfo.fileName);
      let fileId: string | undefined;

      if (fileExists?.id) {
        this.log(`Updating existing file: '${fileInfo.fileName}' with ID: ${fileExists.id}`);
        fileId = await this.updateExistingFile(fileExists.id, fileInfo.fullFilePath);
      } else {
        this.log(`Creating new file: ${fileInfo.fileName}`);
        fileId = await this.createNewFile(rootFolderId, fileInfo.fileName, fileInfo.fullFilePath);
      }

      this.log(`Completing file upload for file ID: ${fileId}`);
      await this.runCommand('storage:file:update-complete', ['--file-id', fileId]);

      fileIds.push({ connectorType: fileInfo.connectorType, fileId, fileName: fileInfo.fileName });
    }

    this.log(`Checking existing connections for iModel ID: ${iModel.id}`);
    const existingConnections = await this.runCommand<storageConnectionListResponse>('imodel:connection:list', ['--imodel-id', iModel.id]);
    const connectionAuth = await this.runCommand<authInfo>('imodel:connection:auth', []);
    if (connectionAuth.isUserAuthorized === undefined) {
      this.error('User is not authenticated for connection run');
    }

    const connectionId = await this.findOrCreateDefaultConnection(existingConnections.connections, fileIds, iModel.id);

    this.log(`Running synchronization for connection ID: ${connectionId}`);
    const runId = await this.runSynchronization(connectionId, !flags["no-wait"]);

    summary.push({
      connectionId,
      files: fileIds,
      runId,
    });

    if(flags["no-wait"]) {
      this.log("Synchronization process started. Use the following command to check the status of the synchronization process:");
      this.log(`itp imodel connection run info --connection-id ${connectionId} --connection-run-id ${runId}`);
    }
    else {
      this.log('Synchronization process completed');
    }

    return {
      iModelId: iModel.id,
      iTwinId: iModel.iTwinId,
      rootFolderId,
      summary,
    };
  }

  private checkAndGetFilesWithConnectors(files: string[], connectorTypes: string[] | undefined) : NewFileInfo[] {
    const resultArray = new Array<NewFileInfo>;
  
    for (const [index, file] of files.entries()) {
      if(!fs.existsSync(file))
      {
        this.error(`File at: '${file}' does not exist`);
      }
      
      const splitedFile = file.split('.');

      const extension = splitedFile.at(-1);
      if(!extension)
      {
        this.error(`Unable to get extension from file name: ${file}`);
      }

      let connector = getConnectorTypeFromFileExtension(extension);
      if(connectorTypes && connectorTypes.length === 1) {
        connector = connectorType[connectorTypes[0] as keyof typeof connectorType];
      } else if(connectorTypes && connectorTypes.length > index) {
        connector = connectorType[connectorTypes[index] as keyof typeof connectorType];
      }

      resultArray.push({
        connectorType: connector,
        fileName: path.basename(file),
        fullFilePath: file
      })
    }
    
    return resultArray;
  }

  private async createNewFile(rootFolderId: string, fileName: string, filePath: string): Promise<string> {
    const newFile = await this.runCommand<fileUpload>('storage:file:create', ['--folder-id', rootFolderId, '--display-name', fileName]);
    if (newFile._links?.uploadUrl?.href === undefined || newFile._links?.completeUrl?.href === undefined) {
      this.error('No upload url was provided when creating a file');
    }

    await this.runCommand('storage:file:upload', ['--upload-url', newFile._links.uploadUrl.href, '--file-path', filePath]);
    return newFile._links.completeUrl.href.split('/')[5];
  }

  private async findOrCreateDefaultConnection(existingConnections: StorageConnection[], fileIds: { connectorType: connectorType, fileId: string, fileName: string }[], iModelId: string): Promise<string> {
    let defaultConnection = existingConnections.find(connection => connection.displayName === 'Default iTwinCLI Connection');
    if (!defaultConnection) {
      const authInfo = await this.runCommand<authorizationInformation>('auth:info', []);
      const authType = authInfo.authorizationType === 'Service' ? 'Service' : 'User';

      this.log(`Creating new default connection`);
      defaultConnection = await this.runCommand<StorageConnection>('imodel:connection:create', ['--imodel-id', iModelId, '--connector-type', fileIds[0].connectorType, '--file-id', fileIds[0].fileId, '--authentication-type', authType, '--display-name', 'Default iTwinCLI Connection']);
      if (defaultConnection?.id === undefined) {
        this.error("Storage connection id was not present");
      }
    }

    for (const file of fileIds) {
      const connectionSourceFiles = await this.runCommand<sourceFile[]>('imodel:connection:sourcefile:list', ['--connection-id', defaultConnection.id]);
      const fileExist = connectionSourceFiles.find(f => f.storageFileId === file.fileId);
      if (!fileExist) {
        this.log(`Adding file: ${file.fileId} to default connection: ${defaultConnection.id}`);
        await this.runCommand('imodel:connection:sourcefile:add', ['--connection-id', defaultConnection.id, '--connector-type', file.connectorType, '--storage-file-id', file.fileId]);
      }
    }

    this.log(`Running connection for connection ID: ${defaultConnection.id}`);
    await this.runCommand('imodel:connection:run:create', ['--connection-id', defaultConnection.id]);
    return defaultConnection.id;
  }

  private async runSynchronization(connectionId: string, waitForCompletion: boolean): Promise<string> {
    const storageConnection = await this.runCommand<StorageConnection>('imodel:connection:info', ['--connection-id', connectionId]);
    if (!storageConnection?._links?.lastRun?.href) {
      this.error(`No last run link available for storage connection: ${connectionId}`);
    }

    const runId = storageConnection?._links?.lastRun?.href.split("/")[8];
    let storageConnectionRun;
    do {
      storageConnectionRun = await this.runCommand<storageRun>('imodel:connection:run:info', ['--connection-id', connectionId, '--connection-run-id', runId]);
      await new Promise(resolve => { setTimeout(resolve, 10_000) });
      this.log(`Waiting for synchronization to complete for run ID: ${runId} with state: ${storageConnectionRun?.state}`);
    // eslint-disable-next-line no-unmodified-loop-condition
    } while (waitForCompletion && storageConnectionRun?.state !== executionState.COMPLETED);

    return runId;
  }

  private async updateExistingFile(fileId: string, filePath: string): Promise<string> {
    const updateFile = await this.runCommand<fileUpload>('storage:file:update-content', ['--file-id', fileId]);
    if (updateFile._links?.uploadUrl?.href === undefined || updateFile._links.completeUrl?.href === undefined) {
      this.error('No upload url was provided when creating content update for a file');
    }

    await this.runCommand('storage:file:upload', ['--upload-url', updateFile._links.uploadUrl.href, '--file-path', filePath]);
    return fileId;
  }
}

interface NewFileInfo {
  connectorType: connectorType;
  fileName: string;
  fullFilePath: string;
}

const fileExtensionToConnectorType: { [key: string]: connectorType[] } = {
  csv: [connectorType.SHELLEDWCSV],
  dgn: [connectorType.CIVIL, connectorType.MSTN, connectorType.OBD, connectorType.PROSTRUCTURES],
  dwg: [connectorType.AUTOPLANT, connectorType.AVEVAPID, connectorType.CIVIL3D, connectorType.DWG],
  ifc: [connectorType.IFC],
  json: [connectorType.INTELLIPID],
  nwc: [connectorType.NWD],
  nwd: [connectorType.NWD],
  pid: [connectorType.SPPID],
  rvt: [connectorType.REVIT],
  shp: [connectorType.GEOSPATIAL],
  vsd: [connectorType.AVEVADIAGRAMS],
  vue: [connectorType.SPXREVIEW],
  xls: [connectorType.PSEXCEL],
  xlsx: [connectorType.PSEXCEL],
  xml: [connectorType.OPENTOWER],
  zip: [connectorType.SPPID],
};

function  getConnectorTypeFromFileExtension(extension: string): connectorType {
  const found = fileExtensionToConnectorType[extension.toLowerCase()];
  return found[0];
}
