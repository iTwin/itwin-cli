/*---------------------------------------------------------------------------------------------
* Copyright (c) Bentley Systems, Incorporated. All rights reserved.
* See LICENSE.md in the project root for license terms and full copyright notice.
*--------------------------------------------------------------------------------------------*/

import { Flags } from "@oclif/core";

import BaseCommand from "../../../extensions/base-command.js";
import { authenticationType } from "../../../services/synchronizationClient/models/authentication-type.js";

export default class UpdateStorageConnection extends BaseCommand {
    static description = 'Update an existing storage connection for an iModel.';

    static examples = [
      {
        command: `<%= config.bin %> <%= command.id %> --connection-id bf4d8b36-25d7-4b72-b38b-12c1f0325f42 --name "Updated Project Files"`,
        description: 'Example 1: Updating a connection with a new display name'
      },
      {
        command: `<%= config.bin %> <%= command.id %> --connection-id bf4d8b36-25d7-4b72-b38b-12c1f0325f42 --authentication-type Service`,
        description: 'Example 2: Changing authentication type for a connection'
      }
    ];

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
  