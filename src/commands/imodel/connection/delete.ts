/*---------------------------------------------------------------------------------------------
* Copyright (c) Bentley Systems, Incorporated. All rights reserved.
* See LICENSE.md in the project root for license terms and full copyright notice.
*--------------------------------------------------------------------------------------------*/

import { Flags } from "@oclif/core";

import BaseCommand from "../../../extensions/base-command.js";

export default class DeleteConnection extends BaseCommand {
    static description = 'Delete a storage connection from an iModel.';
  
    static flags = {
      "connection-id": Flags.string({
        description: 'The ID of the storage connection to delete.',
        required: true,
      }),
    };
  
    async run() {
      const { flags } = await this.parse(DeleteConnection);
  
      const client = await this.getSynchronizationClient();
  
      await client.deleteStorageConnection(flags["connection-id"]);
  
      return this.logAndReturnResult({ result: 'deleted' });
    }
  }
  