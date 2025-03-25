/*---------------------------------------------------------------------------------------------
* Copyright (c) Bentley Systems, Incorporated. All rights reserved.
* See LICENSE.md in the project root for license terms and full copyright notice.
*--------------------------------------------------------------------------------------------*/

import { Flags } from "@oclif/core";

import BaseCommand from "../../../../extensions/base-command.js";
import { connectorType } from "../../../../services/synchronizationClient/models/connector-type.js";

export default class ConnectionSourceFileUpdate extends BaseCommand {
    static description = 'Update an existing source file in a storage connection of an iModel.';

    static examples = [
      `<%= config.bin %> <%= command.id %> --connection-id bf4d8b36-25d7-4b72-b38b-12c1f0325f42 --source-file-id 297c8ab9-53a3-4fe5-adf8-79b4c1a95cbb --connector-type DWG`
    ];

    static flags = {
      "connection-id": Flags.string({
        char: 'c',
        description: 'The ID of the storage connection.',
        required: true,
      }),
      "connector-type": Flags.string({
        description: 'The connector type for synchronization.',
        options: [
          'AUTOPLANT', 'CIVIL', 'CIVIL3D', 'DWG', 'IFC', 'MSTN', 'REVIT'
        ],
        required: true,
      }),
      "source-file-id": Flags.string({
        description: 'The source file ID to update.',
        required: true,
      }),
    };
  
    async run() {
      const { flags } = await this.parse(ConnectionSourceFileUpdate);
  
      const client = await this.getSynchronizationClient();
  
      const response = await client.updateSourceFile(flags["connection-id"], flags["source-file-id"], {
        connectorType: flags["connector-type"] as connectorType,
        storageFileId: flags["source-file-id"],
      });
  
      return this.logAndReturnResult(response.sourceFile);
    }
  }
  