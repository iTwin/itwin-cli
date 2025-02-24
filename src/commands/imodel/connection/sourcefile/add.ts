/*---------------------------------------------------------------------------------------------
* Copyright (c) Bentley Systems, Incorporated. All rights reserved.
* See LICENSE.md in the project root for license terms and full copyright notice.
*--------------------------------------------------------------------------------------------*/

import { Flags } from "@oclif/core";

import BaseCommand from "../../../../extensions/base-command.js";
import { connectorType } from "../../../../services/synchronizationClient/models/connector-type.js";

export default class CreateConnectionSourceFile extends BaseCommand {
    static description = 'Add a source file to an existing storage connection of an iModel.';
  
    static flags = {
      "connection-id": Flags.string({
        description: 'The ID of the storage connection to which the source file will be added.',
        required: true,
      }),
      "connector-type": Flags.string({
        description: 'The connector type for synchronization.',
        options: [
          'AUTOPLANT', 'CIVIL', 'CIVIL3D', 'DWG', 'IFC', 'MSTN', 'REVIT', 
          'OPENROADS', 'SPX', 'XER', 'PRIMAVERA', 'SYNCHRO', 'MICROSTATION'
        ],
        required: true,
      }),
      "storage-file-id": Flags.string({
        description: 'The storage file ID.',
        required: true,
      }),
    };
  
    async run() {
      const { flags } = await this.parse(CreateConnectionSourceFile);
  
      const client = await this.getSynchronizationClient();
  
      const response = await client.addSourceFile(flags["connection-id"], {
        connectorType: flags["connector-type"] as connectorType,
        storageFileId: flags["storage-file-id"],
      });
  
      return this.logAndReturnResult(response.sourceFile);
    }
  }
  