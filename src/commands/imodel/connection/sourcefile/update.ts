/*---------------------------------------------------------------------------------------------
* Copyright (c) Bentley Systems, Incorporated. All rights reserved.
* See LICENSE.md in the project root for license terms and full copyright notice.
*--------------------------------------------------------------------------------------------*/

import { Flags } from "@oclif/core";

import { ApiReference } from "../../../../extensions/api-reference.js";
import BaseCommand from "../../../../extensions/base-command.js";
import { ConnectorType } from "../../../../services/synchronizationClient/models/connector-type.js";

export default class ConnectionSourceFileUpdate extends BaseCommand {
  public static apiReference: ApiReference = {
    link: "https://developer.bentley.com/apis/synchronization/operations/update-storage-connection-sourcefile/",
    name: "Update Storage Connection SourceFile",
  };

  public static description = 'Update an existing source file in a storage connection of an iModel.';

  public static examples = [
    {
      command: `<%= config.bin %> <%= command.id %> --connection-id bf4d8b36-25d7-4b72-b38b-12c1f0325f42 --source-file-id 297c8ab9-53a3-4fe5-adf8-79b4c1a95cbb --connector-type DWG --storage-file-id b67d9839-2663-4465-a425-d1541d32e4c7`,
      description: 'Example 1:'
    }
  ];

  public static flags = {
    "connection-id": Flags.string({
      char: 'c',
      description: 'The ID of the storage connection.',
      helpValue: '<string>',
      required: true,
    }),
    "connector-type": Flags.string({
      description: 'The connector type for synchronization.',
      helpValue: '<string>',
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
      required: true,
    }),
    "source-file-id": Flags.string({
      description: 'The source file ID to update.',
      helpValue: '<string>',
      required: true,
    }),
    "storage-file-id": Flags.string({
      description: 'The storage file ID to update to.',
      helpValue: '<string>',
      required: true
    })
  };
  
  public async run() {
    const { flags } = await this.parse(ConnectionSourceFileUpdate);
  
    const client = await this.getSynchronizationClient();
  
    const response = await client.updateSourceFile(flags["connection-id"], flags["source-file-id"], {
      connectorType: flags["connector-type"] as ConnectorType,
      storageFileId: flags["storage-file-id"],
    });
  
    return this.logAndReturnResult(response.sourceFile);
  }
}
