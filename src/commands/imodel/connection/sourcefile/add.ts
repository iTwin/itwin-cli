/*---------------------------------------------------------------------------------------------
* Copyright (c) Bentley Systems, Incorporated. All rights reserved.
* See LICENSE.md in the project root for license terms and full copyright notice.
*--------------------------------------------------------------------------------------------*/

import { Flags } from "@oclif/core";

import { ApiReference } from "../../../../extensions/api-reference.js";
import BaseCommand from "../../../../extensions/base-command.js";
import { ConnectorType } from "../../../../services/synchronizationClient/models/connector-type.js";

export default class CreateConnectionSourceFile extends BaseCommand {
  public static apiReference: ApiReference = {
    link: "https://developer.bentley.com/apis/synchronization/operations/add-storage-connection-sourcefile/",
    name: "Add Storage Connection SourceFile",
  };

  public static description = 'Add a source file to an existing storage connection of an iModel.';

  public static examples = [
    {
      command: `<%= config.bin %> <%= command.id %> --connection-id bf4d8b36-25d7-4b72-b38b-12c1f0325f42 --storage-file-id t5bDFuN4qUa9ojVw1E5FGtldp8BgSbNCiJ2XMdiT-cA --connector-type MSTN`,
      description: 'Example 1: Add a source file to a storage connection'
    }
  ];

  public static flags = {
    "connection-id": Flags.string({
      char: 'c',
      description: 'The ID of the storage connection to which the source file will be added.',
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
    "storage-file-id": Flags.string({
      description: 'The storage file ID.',
      helpValue: '<string>',
      required: true,
    }),
  };
  
  public async run() {
    const { flags } = await this.parse(CreateConnectionSourceFile);
  
    const client = await this.getSynchronizationClient();
  
    const response = await client.addSourceFile(flags["connection-id"], {
      connectorType: flags["connector-type"] as ConnectorType,
      storageFileId: flags["storage-file-id"],
    });
  
    return this.logAndReturnResult(response.sourceFile);
  }
}
