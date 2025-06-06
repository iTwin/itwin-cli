/*---------------------------------------------------------------------------------------------
* Copyright (c) Bentley Systems, Incorporated. All rights reserved.
* See LICENSE.md in the project root for license terms and full copyright notice.
*--------------------------------------------------------------------------------------------*/

import { Flags } from "@oclif/core";

import { ApiReference } from "../../../extensions/api-reference.js";
import BaseCommand from "../../../extensions/base-command.js";
import { AuthenticationType } from "../../../services/synchronizationClient/models/authentication-type.js";

export default class UpdateStorageConnection extends BaseCommand {
    static apiReference: ApiReference = {
        link: "https://developer.bentley.com/apis/synchronization/operations/update-storage-connection/",
        name: "Update Storage Connection",
    };

    static description = 'Update an existing storage connection of an iModel.';

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
        helpValue: '<string>',
        options: ['User', 'Service'],
        required: false,
      }),
      "connection-id": Flags.string({
        char: 'c',
        description: 'The ID of the storage connection to update.',
        helpValue: '<string>',
        required: true,
      }),
      name: Flags.string({
        char: 'n',
        description: 'The new display name for the storage connection.',
        helpValue: '<string>',
        required: false,
      }),
    };
  
    async run() {
      const { flags } = await this.parse(UpdateStorageConnection);
  
      const client = await this.getSynchronizationClient();
  
      const response = await client.updateStorageConnection(flags["connection-id"], {
        authenticationType: flags["authentication-type"] as AuthenticationType,
        displayName: flags.name,
      });
  
      return this.logAndReturnResult(response.connection);
    }
  }
