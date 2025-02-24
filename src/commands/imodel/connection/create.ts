/*---------------------------------------------------------------------------------------------
* Copyright (c) Bentley Systems, Incorporated. All rights reserved.
* See LICENSE.md in the project root for license terms and full copyright notice.
*--------------------------------------------------------------------------------------------*/

import { Flags } from "@oclif/core";

import BaseCommand from "../../../extensions/base-command.js";
import { connectorType } from "../../../services/synchronizationClient/models/connector-type.js";

export default class CreateConnection extends BaseCommand {
  static description = 'Create a new connector.';

  static flags = {
    "connector-type": Flags.string({ description: 'The connector type of your file.', required: true }),
    "file-id": Flags.string({ description: 'The file id.', required: true }),
    "imodel-id": Flags.string({ description: 'The id of the iModel.', required: true }),
  };

  async run() {
    const { flags } = await this.parse(CreateConnection);

    const client = await this.getSynchronizationClient();

    const response = await client.createStorageConnection({
      iModelId: flags["imodel-id"],
      sourceFiles: [{
        connectorType: flags["connector-type"] as connectorType,
        storageFileId: flags["file-id"]
      }]
    });

    return this.logAndReturnResult(response.connection);
  }
}
