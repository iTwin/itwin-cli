/*---------------------------------------------------------------------------------------------
* Copyright (c) Bentley Systems, Incorporated. All rights reserved.
* See LICENSE.md in the project root for license terms and full copyright notice.
*--------------------------------------------------------------------------------------------*/

import { IModel } from "@itwin/imodels-client-management"
import { Flags } from "@oclif/core"
import fs from "node:fs"
import path from "node:path"

import { apiReference } from "../../extensions/api-reference.js";
import BaseCommand from "../../extensions/base-command.js"
import { CustomFlags } from "../../extensions/custom-flags.js"
import { authorizationInformation } from "../../services/authorization-client/authorization-type.js"
import { fileUpload } from "../../services/storage-client/models/file-upload.js"
import { itemsWithFolderLink } from "../../services/storage-client/models/items-with-folder-link.js"
import { authInfo } from "../../services/synchronizationClient/models/connection-auth.js"
import { connectorType } from "../../services/synchronizationClient/models/connector-type.js"
import { executionState } from "../../services/synchronizationClient/models/execution-state.js"
import { sourceFile } from "../../services/synchronizationClient/models/source-file.js"
import { storageConnection } from "../../services/synchronizationClient/models/storage-connection.js"
import { storageConnectionListResponse } from "../../services/synchronizationClient/models/storage-connection-response.js"
import { storageRun } from "../../services/synchronizationClient/models/storage-run.js"
import { executionResult } from "../../services/synchronizationClient/models/execution-result.js";

export default class PopulateIModel extends BaseCommand {    
  static apiReference: apiReference = {
    link: "/docs/command-workflows/imodel-populate",
    name: "iModel Populate",
    sectionName: "Workflow Reference"
  };

  static description = 'Synchronize design files into an iModel.'

	static examples = [
    {
      command: `<%= config.bin %> <%= command.id %> --imodel-id b1a2c3d4-5678-90ab-cdef-1234567890ab --file file1.dwg --connector-type DWG --file file2.dwg --connector-type DWG`,
      description: 'Example 1: Synchronizing DWG Files'
    },
    {
      command: `<%= config.bin %> <%= command.id %> --imodel-id c2d3e4f5-6789-01ab-cdef-2345678901bc --file site1.dgn --connector-type CIVIL --file structure2.dgn --connector-type CIVIL`,
      description: 'Example 2: Synchronizing DGN Files'
    },
    {
      command: `<%= config.bin %> <%= command.id %> --imodel-id d3e4f5g6-7890-12ab-cdef-3456789012cd --file data1.csv --file data2.csv --file model.ifc`,
      description: 'Example 3: Synchronizing CSV and IFC Files'
    },
    {
      command: `<%= config.bin %> <%= command.id %> --imodel-id i9j0k1l2-3456-78ab-cdef-9012345678ij --file model.rvt --file design.dgn`,
      description: 'Example 4: Synchronizing Revit and DGN Files'
    }
  ];

  static flags = {
    "connector-type": Flags.string({ 
        char: 'c',
        description: `Specify connectors to prioritize for synchronization. This flag can be provided multiple times. If no connector-type options are provided, they are selected automatically depending on file extensions of provided files. If only one connector is specified, it will be used for all files. If multiple connectors are specified, each connector will be used for the corresponding file in the files list (first connector for the first file, second connector for the second file, and so on).\n NOTE: while .dgn and .dwg file types can be associated to multiple connector types, MSTN and DWG connectors are prioritized respectively when no 'connector-type' options are provided.`, 
        helpValue: '<string>',
        multiple: true,
        options: [
          'AUTOPLANT',
          'CIVIL',
          'CIVIL3D',
          'DWG',
          'GEOSPATIAL',
          'IFC',
          'MSTN',
          'NWD',
          'OBD',
          'OPENTOWER',
          'PROSTRUCTURES',
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
        helpValue: '<string>',
        multiple: true,
        required: true
      }),
    "imodel-id": CustomFlags.iModelIDFlag({
        description: 'The ID of the iModel to populate.'
    }),
    "no-wait": Flags.boolean({
        description: 'Do not wait for the synchronization process to complete.',
        required: false,
    }),
  }

  async run() {
    const { flags } = await this.parse(PopulateIModel);

    if(flags["connector-type"]!.length !== 1 && flags.file!.length !== flags["connector-type"]!.length) {
      this.error("Number of `--connector-type` flags must match the amount of `--file` flags or be equal to 1.")
    }

    const filesAndConnectorToImport = this.checkAndGetFilesWithConnectors(flags.file, flags["connector-type"]);
    this.log(`Synchronizing files into iModel with ID: ${flags["imodel-id"]}`);
    const iModel = await this.runCommand<IModel>('imodel:info', ['--imodel-id', flags["imodel-id"]]);

    this.log(`Fetching root folder for iTwin: ${iModel.iTwinId}`);
    const topFolders = await this.runCommand<itemsWithFolderLink>('storage:root-folder', ['--itwin-id', iModel.iTwinId]);
    const rootFolderId = topFolders?._links?.folder?.href?.split('/').pop();
    if (rootFolderId === undefined) {
      this.error(`Unable to get root folder for iTwin: ${iModel.iTwinId}`);
    }

    const files = await Promise.all(
      filesAndConnectorToImport.map((newFileInfo) => this.processFile(topFolders, rootFolderId, newFileInfo))
    );

    this.log(`Checking existing connections for iModel ID: ${iModel.id}`);
    const existingConnections = await this.runCommand<storageConnectionListResponse>('imodel:connection:list', ['--imodel-id', iModel.id]);

    const authInfo = await this.runCommand<authorizationInformation>('auth:info', []);
    const authType = authInfo.authorizationType === 'Service' ? 'Service' : 'User';

    if(authType === 'User') {
      this.log("Authorizing...");
      const connectionAuth = await this.runCommand<authInfo>('imodel:connection:auth', []);
      if (connectionAuth.isUserAuthorized === undefined) {
        this.error('User is not authenticated for connection run');
      }
    }

    const connectionId = await this.findOrCreateDefaultConnection(existingConnections.connections, files, iModel.id);

    this.log(`Running synchronization for connection ID: ${connectionId}`);
    const runId = await this.runSynchronization(connectionId, !flags["no-wait"]);

    const summary = [{
      connectionId,
      files,
      runId,
    }];

    if(flags["no-wait"]) {
      this.log("Synchronization process started. Use the following command to check the status of the synchronization process:");
      this.log(`itp imodel connection run info --connection-id ${connectionId} --connection-run-id ${runId}`);
    }
    else {
      this.log('Synchronization process completed');
    }

    const populateResponse: populateResponse = {
      iModelId: iModel.id,
      iTwinId: iModel.iTwinId,
      rootFolderId,
      summary,
    }

    return populateResponse;
  }

  private async addFileToConnectionIfItIsNotPresent(connectionId: string, sourceFiles: sourceFile[], file: { connectorType: connectorType, fileId: string, fileName: string }) {
    const fileExist = sourceFiles.find(f => f.storageFileId === file.fileId);
      if (!fileExist) {
        this.log(`Adding file: ${file.fileId} to default connection: ${connectionId}`);
        await this.runCommand('imodel:connection:sourcefile:add', ['--connection-id', connectionId, '--connector-type', file.connectorType, '--storage-file-id', file.fileId]);
      }
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
    const newFile = await this.runCommand<fileUpload>('storage:file:create', ['--folder-id', rootFolderId, '--name', fileName]);
    if (newFile._links?.uploadUrl?.href === undefined || newFile._links?.completeUrl?.href === undefined) {
      this.error('No upload url was provided when creating a file');
    }

    await this.runCommand('storage:file:upload', ['--upload-url', newFile._links.uploadUrl.href, '--file-path', filePath]);
    return newFile._links.completeUrl.href.split('/')[5];
  }

  private async findOrCreateDefaultConnection(existingConnections: storageConnection[], files: { connectorType: connectorType, fileId: string, fileName: string }[], iModelId: string): Promise<string> {
    let defaultConnection = existingConnections.find(connection => connection.displayName === 'Default iTwinCLI Connection');
    if (!defaultConnection) {
      const authInfo = await this.runCommand<authorizationInformation>('auth:info', []);
      const authType = authInfo.authorizationType === 'Service' ? 'Service' : 'User';

      this.log(`Creating new default connection`);
      defaultConnection = await this.runCommand<storageConnection>('imodel:connection:create', 
        ['--imodel-id', iModelId, '--connector-type', files[0].connectorType, '--file-id', files[0].fileId, '--authentication-type', authType, '--name', 'Default iTwinCLI Connection']);
      if (defaultConnection?.id === undefined) {
        this.error("Storage connection id was not present");
      }
    }

    const connectionSourceFiles = await this.runCommand<sourceFile[]>('imodel:connection:sourcefile:list', ['--connection-id', defaultConnection.id]);
    await Promise.all(
      files.map((file) => this.addFileToConnectionIfItIsNotPresent(defaultConnection.id, connectionSourceFiles, file))
    );

    this.log(`Running connection for connection ID: ${defaultConnection.id}`);
    await this.runCommand('imodel:connection:run:create', ['--connection-id', defaultConnection.id]);
    return defaultConnection.id;
  }

  private async processFile(topFolders: itemsWithFolderLink, rootFolderId: string, fileInfo: NewFileInfo): Promise<{connectorType: connectorType, fileId: string, fileName: string}> {
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

    this.log(`Completing file upload for file: '${fileInfo.fileName}' with ID: ${fileId}`);
    await this.runCommand('storage:file:update-complete', ['--file-id', fileId]);

    return { connectorType: fileInfo.connectorType, fileId, fileName: fileInfo.fileName };
  }

  private async runSynchronization(connectionId: string, waitForCompletion: boolean): Promise<string> {
    const storageConnection = await this.runCommand<storageConnection>('imodel:connection:info', ['--connection-id', connectionId]);
    if (!storageConnection?._links?.lastRun?.href) {
      this.error(`No last run link available for storage connection: ${connectionId}`);
    }

    const runId = storageConnection?._links?.lastRun?.href.split("/")[8];
    let storageConnectionRun;
    do {
      // eslint-disable-next-line no-await-in-loop
      storageConnectionRun = await this.runCommand<storageRun>('imodel:connection:run:info', ['--connection-id', connectionId, '--connection-run-id', runId]);
      // eslint-disable-next-line no-await-in-loop
      await new Promise(resolve => { setTimeout(resolve, 10_000) });
      this.log(`Waiting for synchronization to complete for run ID: ${runId} with state: ${storageConnectionRun?.state}`);
    // eslint-disable-next-line no-unmodified-loop-condition
    } while (waitForCompletion && storageConnectionRun?.state !== executionState.COMPLETED);

    if(waitForCompletion && storageConnectionRun.result !== executionResult.SUCCESS) {
      this.error(`Synchronization run ${runId} resulted in an error. Run 'itp imodel connection run info --connection-id ${connectionId} --connection-run-id ${runId}' for more info.`);
    }

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

export interface populateResponse {
  iModelId: string;
  iTwinId: string;
  rootFolderId: string;
  summary: {
    connectionId: string;
    files: {
        connectorType: connectorType;
        fileId: string;
        fileName: string;
    }[];
    runId: string;
  }[]
}

interface NewFileInfo {
  connectorType: connectorType;
  fileName: string;
  fullFilePath: string;
}

const fileExtensionToConnectorType: { [key: string]: connectorType[] } = {
  dgn: [connectorType.MSTN, connectorType.CIVIL, connectorType.OBD, connectorType.PROSTRUCTURES],
  dwg: [connectorType.DWG, connectorType.AUTOPLANT, connectorType.CIVIL3D],
  ifc: [connectorType.IFC],
  nwc: [connectorType.NWD],
  nwd: [connectorType.NWD],
  pid: [connectorType.SPPID],
  rvt: [connectorType.REVIT],
  shp: [connectorType.GEOSPATIAL],
  vue: [connectorType.SPXREVIEW],
  xml: [connectorType.OPENTOWER],
  zip: [connectorType.SPPID],
};

function  getConnectorTypeFromFileExtension(extension: string): connectorType {
  const found = fileExtensionToConnectorType[extension.toLowerCase()];
  return found[0];
}
