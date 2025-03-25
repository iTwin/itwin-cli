/*---------------------------------------------------------------------------------------------
* Copyright (c) Bentley Systems, Incorporated. All rights reserved.
* See LICENSE.md in the project root for license terms and full copyright notice.
*--------------------------------------------------------------------------------------------*/

import { ITwin } from "@itwin/itwins-client";
import { Flags } from "@oclif/core";

import BaseCommand from "../../extensions/base-command.js";

export default class UpdateCommand extends BaseCommand {
    static description = 'Update an iTwin';

    static examples = [
      {
        command: `<%= config.bin %> <%= command.id %> --itwin-id b1a2c3d4-5678-90ab-cdef-1234567890ab --name "Updated Portfolio"`,
        description: `Example 1: Updating iTwin's display name`
      },
      {
        command: `<%= config.bin %> <%= command.id %> --itwin-id b1a2c3d4-5678-90ab-cdef-1234567890ab --geographic-location "New York, NY" --iana-time-zone America/New_York`,
        description: 'Example 2: Changing geographic location and time zone'
      },
      {
        command: `<%= config.bin %> <%= command.id %> --itwin-id b1a2c3d4-5678-90ab-cdef-1234567890ab --status Inactive`,
        description: `Example 3: Setting the iTwin's status to 'Inactive'`
      }
    ];

    static flags = {
      "geographic-location": Flags.string({
        description: 'Optional location, typically an address or city.',
        required: false
      }),
      "iana-time-zone": Flags.string({
        description: 'Optional IANA time zone ID.',
        required: false,
      }),
      "itwin-id": Flags.string({
        char: 'i',
        description: 'The ID of the iTwin to be updated.',
        required: true,
      }),
      name: Flags.string({
        char: 'n',
        description: "The iTwin's display name.",
        required: false,
      }),
      number: Flags.string({
        description: 'Unique identifier for the iTwin.',
        required: false,
      }),
      status: Flags.string({
        description: 'Status of the iTwin. Defaults to Active.',
        options: ['Active', 'Inactive', 'Trial'],
        required: false,
      }),
      type: Flags.string({
        description: "Defines the iTwin's Type.",
        required: false,
      }),
    };
  
    async run() {
      const { flags } = await this.parse(UpdateCommand);
  
      const iTwinUpdate : ITwin = {
        displayName: flags.name,
        geographicLocation: flags["geographic-location"],
        ianaTimeZone: flags["iana-time-zone"],
        number: flags.number,
        status: flags.status,
        type: flags.type,
      };
  
      const accessToken = await this.getAccessToken();
      const client = this.getITwinAccessClient();
  
      const response = await client.updateiTwin(accessToken, flags["itwin-id"], iTwinUpdate);

      if(response.error)
      {
        this.error(JSON.stringify(response.error, null, 2));
      }
  
      return this.logAndReturnResult(response.data);
    }
  }
  