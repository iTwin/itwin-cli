/*---------------------------------------------------------------------------------------------
* Copyright (c) Bentley Systems, Incorporated. All rights reserved.
* See LICENSE.md in the project root for license terms and full copyright notice.
*--------------------------------------------------------------------------------------------*/

import { Flags } from "@oclif/core";

import BaseCommand from "../../../extensions/base-command.js";
import { authenticationType } from "../../../services/synchronizationClient/models/authentication-type.js";
import { connectorType } from "../../../services/synchronizationClient/models/connector-type.js";
import { storageFileCreate } from "../../../services/synchronizationClient/models/storage-file-create.js";

export default class CreateConnection extends BaseCommand {
  static description = 'Create a new connector.';

  static flags = {
    "authentication-type": Flags.string({ 
      description: 'The authorization workflow type.', 
      options: ['User', 'Service'], 
      required: false 
    }),
    "connector-type": Flags.string({ 
      description: 'The connector type of your file. Each connector will be used for the corresponding file in the files list (first connector for the first file, second connector for the second file, and so on).', 
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
      required: true
    }),
    "file-id": Flags.string({ 
      char: 'f',
      description: 'The ID of the storage file to synchronize', 
      multiple: true,
      required: true
    }),
    "imodel-id": Flags.string({
      char: 'm', 
      description: 'The ID of the iModel.', 
      required: true 
    }),
    name: Flags.string({
      char: 'n',
      description: 'The display name of the storage connection.',
      required: false,
    }),
  };

  async run() {
    const { flags } = await this.parse(CreateConnection);

    const client = await this.getSynchronizationClient();

    const sourceFiles : storageFileCreate[] = [];

    if(flags["connector-type"].length !== flags["file-id"].length) {
      this.error("The number of connector types must match the number of file ids.");
    }

    for (let i = 0; i < flags["file-id"].length; i++) {
      sourceFiles.push({
        connectorType: flags["connector-type"][i] as connectorType,
        storageFileId: flags["file-id"][i]
      });
    }

    const response = await client.createStorageConnection({
      authenticationType: flags["authentication-type"] as authenticationType,
      displayName: flags.name,
      iModelId: flags["imodel-id"],
      sourceFiles,
    });

    return this.logAndReturnResult(response.connection);
  }
}
