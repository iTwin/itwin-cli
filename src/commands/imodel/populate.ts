/* eslint-disable no-await-in-loop */

/*---------------------------------------------------------------------------------------------
* Copyright (c) Bentley Systems, Incorporated. All rights reserved.
* See LICENSE.md in the project root for license terms and full copyright notice.
*--------------------------------------------------------------------------------------------*/

import { Flags } from "@oclif/core"
import fs from "node:fs"
import path from "node:path"

import BaseCommand from "../../extensions/base-command.js"
import { fileUpload } from "../../services/storage-client/models/file-upload.js"
import { connectorType } from "../../services/synchronizationClient/models/connector-type.js"
import { executionState } from "../../services/synchronizationClient/models/execution-state.js"
import FileCreate from "../storage/file/create.js"
import FileUpdateComplete from "../storage/file/update-complete.js"
import UpdateContent from "../storage/file/update-content.js"
import FileUpload from "../storage/file/upload.js"
import GetRootFolder from "../storage/root-folder.js"
import ConnectionAuth from "./connection/auth.js"
import CreateConnection from "./connection/create.js"
import ConnectionInfo from "./connection/info.js"
import ListConnections from "./connection/list.js"
import CreateConnectionRun from "./connection/run/create.js"
import ConnectionRunInfo from "./connection/run/info.js"
import ListSourceFiles from "./connection/sourcefile/list.js"
import { IModelInfo } from "./info.js"

export default class PopulateIModel extends BaseCommand {    
  static description = 'Synchronize design files into an iModel.'

  static examples = [
    `<%= config.bin %> <%= command.id %>`,
  ]

  static flags = {
    "connector-types": Flags.string({ 
        char: 'c',
        description: 'A list of connectors to prioritize for synchronization. Separate multiple connectors with a space.', 
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
    files: Flags.file({ 
        char: 'f', 
        description: 'A list of source files to synchronize into the iModel. Separate multiple files with a space.', 
        multiple: true,
        required: true
      }),
    id: Flags.string({ 
        description: 'The ID of the iModel to populate.', 
        required: true,

    }),
  }

  async run() {
    const {flags} = await this.parse(PopulateIModel);
    const accessToken = await this.getAccessToken();

    const filesAndConnectorToImport = this.checkAndGetFilesWithConnectors(flags.files, flags["connector-types"])

    const iModel = await IModelInfo.run(['--access-token', accessToken, '--id', flags.id], this.config);

    const topFolders = await GetRootFolder.run(['--access-token', accessToken, '--itwin-id', iModel.iTwinId], this.config);
    const rootFolderId = topFolders?._links?.folder?.href?.split('/').pop();
    if(rootFolderId === undefined)
    {
      this.error(`Unable to get root folder for iTwin: ${iModel.iTwinId}`);
    }

    for(const [, fileInfo] of filesAndConnectorToImport.entries()) {
      const fileExists = topFolders.items?.find(entry => entry.type === 'file' && entry.displayName === fileInfo.fileName);
      let fileId : string | undefined;
      let connectionId: string | undefined;
      if(fileExists?.id)
      {
        fileId = fileExists.id;
        const updateFile = await UpdateContent.run(['--access-token', accessToken, '--file-id', fileId], this.config);
        if(updateFile._links?.uploadUrl?.href === undefined || updateFile._links.completeUrl?.href === undefined)
        {
            this.error('No upload url was provided when creating content update for a file');
        }
      
        await FileUpload.run(['--access-token', accessToken, '--upload-url', updateFile._links.uploadUrl.href, '--file-path', fileInfo.fullFilePath], this.config);
      }
      else
      {
        const newFile : fileUpload = await FileCreate.run(['--access-token', accessToken, '--folder-id', rootFolderId, '--display-name', fileInfo.fileName], this.config);
        if(newFile._links?.uploadUrl?.href === undefined || newFile._links?.completeUrl?.href === undefined)
        {
          this.error('No upload url was provided when creating a file');
        }

        await FileUpload.run(['--access-token', accessToken, '--upload-url', newFile._links.uploadUrl.href, '--file-path', fileInfo.fullFilePath], this.config);

        fileId = newFile._links.completeUrl.href.split('/')[5];
      }

      await FileUpdateComplete.run(['--access-token', accessToken, '--file-id', fileId], this.config);

      const existingConnections = await ListConnections.run(['--access-token', accessToken, '--imodel-id', iModel.id], this.config);
      
      const connectionAuth = await ConnectionAuth.run(['--access-token', accessToken], this.config);
      if(connectionAuth.isUserAuthorized === undefined)
      {
        this.error('User is not authenticated for connection run');
      }

      for( let i = 0; i < existingConnections.connections.length; i++) {
        const connection = existingConnections.connections[i];
        const connectionSourceFiles = await ListSourceFiles.run(['--access-token', accessToken, '--connection-id', connection.id], this.config);
        const fileExist = connectionSourceFiles.find(file => file.storageFileId === fileId);
        if(fileExist)
        {
          connectionId = connection.id;
          await CreateConnectionRun.run(['--access-token', accessToken, '--connection-id', connection.id], this.config);
          break;
        }
      }

      if(!connectionId)
      {
        const createdStorageConnection = await CreateConnection.run(['--access-token', accessToken, '--imodel-id' ,iModel.id, '--connector-type', fileInfo.connectorType, '--file-id' ,fileId], this.config);
    
        if(createdStorageConnection?.id === undefined)
        {
          this.error("Storage connection id was not present");
        }
        
        await CreateConnectionRun.run(['--access-token', accessToken, '--connection-id', createdStorageConnection.id], this.config);

        connectionId = createdStorageConnection.id;
      }

      const storageConnection = await ConnectionInfo.run(['--access-token', accessToken, '--connection-id', connectionId], this.config);
      if(!storageConnection?._links?.lastRun?.href)
      {
        this.error(`No last run link available for storage connection: ${connectionId}`);
      }

      const runId = storageConnection?._links?.lastRun?.href.split("/")[8];
      
      let storageConnectionRun = await ConnectionRunInfo.run(['--access-token', accessToken, '--connection-id', connectionId, '--connection-run-id', runId], this.config);
      while(storageConnectionRun?.state !== executionState.COMPLETED)
      {
        await new Promise(resolve => {setTimeout(resolve, 10_000)});
        storageConnectionRun = await ConnectionRunInfo.run(['--access-token', accessToken, '--connection-id', connectionId, '--connection-run-id', runId], this.config);
      }
    }
    

    return this.logAndReturnResult(iModel);
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
      if(connectorTypes && connectorTypes?.length < index)
      {
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
