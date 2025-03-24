/*---------------------------------------------------------------------------------------------
* Copyright (c) Bentley Systems, Incorporated. All rights reserved.
* See LICENSE.md in the project root for license terms and full copyright notice.
*--------------------------------------------------------------------------------------------*/

import { Flags } from "@oclif/core";

import BaseCommand from "../../../extensions/base-command.js";
import { authenticationType } from "../../../services/synchronizationClient/models/authentication-type.js";

export default class UpdateStorageConnection extends BaseCommand {
    static description = 'Update an existing storage connection for an iModel.';
  
    static flags = {
      "authentication-type": Flags.string({
        description: 'The authorization workflow type.',
        options: ['User', 'Service'],
        required: false,
      }),
      "connection-id": Flags.string({
        char: 'c',
        description: 'The ID of the storage connection to update.',
        required: true,
      }),
      name: Flags.string({
        char: 'n',
        description: 'The new display name for the storage connection.',
        required: false,
      }),
    };
  
    async run() {
      const { flags } = await this.parse(UpdateStorageConnection);
  
      const client = await this.getSynchronizationClient();
  
      const response = await client.updateStorageConnection(flags["connection-id"], {
        authenticationType: flags["authentication-type"] as authenticationType,
        displayName: flags.name,
      });
  
      return this.logAndReturnResult(response.connection);
    }
  }
  