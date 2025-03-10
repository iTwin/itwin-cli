/*---------------------------------------------------------------------------------------------
* Copyright (c) Bentley Systems, Incorporated. All rights reserved.
* See LICENSE.md in the project root for license terms and full copyright notice.
*--------------------------------------------------------------------------------------------*/

import { Flags } from "@oclif/core";

import BaseCommand from "../../../extensions/base-command.js";
import { authenticationType } from "../../../services/synchronizationClient/models/authentication-type.js";
import { connectorType } from "../../../services/synchronizationClient/models/connector-type.js";

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
      options: ["AUTOPLANT", "CIVIL", "CIVIL3D", "DWG", "GEOSPATIAL", "IFC", "MSTN", "NWD", "OBD", "OPENTOWER", "REVIT", "SPPID", "SPXREVIEW"],
      required: true
    }),
    "display-name": Flags.string({
      description: 'The display name of the storage connection.',
      required: false,
    }),
    "file-id": Flags.string({ 
      description: 'This is the id of the file in the storage connection.', 
      multiple: true,
      required: true
    }),
    "imodel-id": Flags.string({ 
      description: 'The id of the iModel.', 
      required: true 
    }),
  };

  async run() {
    const { flags } = await this.parse(CreateConnection);

    const client = await this.getSynchronizationClient();

    const response = await client.createStorageConnection({
      authenticationType: flags["authentication-type"] as authenticationType,
      iModelId: flags["imodel-id"],
      sourceFiles: [{
        connectorType: flags["connector-type"] as connectorType,
        storageFileId: flags["file-id"],
      }]
    });

    return this.logAndReturnResult(response.connection);
  }
}
