/*---------------------------------------------------------------------------------------------
* Copyright (c) Bentley Systems, Incorporated. All rights reserved.
* See LICENSE.md in the project root for license terms and full copyright notice.
*--------------------------------------------------------------------------------------------*/

import { ITwin } from "@itwin/itwins-client";
import { Flags } from "@oclif/core";

import { ApiReference } from "../../extensions/api-reference.js";
import BaseCommand from "../../extensions/base-command.js";
import { customFlags } from "../../extensions/custom-flags.js";

export default class UpdateCommand extends BaseCommand {
  public static apiReference: ApiReference = {
    link: "https://developer.bentley.com/apis/itwins/operations/update-itwin/",
    name: "Update iTwin",
  };

  public static description = 'Update the specified iTwin. Only include properties you want to update.';

  public static examples = [
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

  public static flags = {
    "geographic-location": Flags.string({
      description: 'Optional location, typically an address or city.',
      helpValue: '<string>',
      required: false
    }),
    "iana-time-zone": Flags.string({
      description: 'Optional IANA time zone ID.',
      helpValue: '<string>',
      required: false,
    }),
    "itwin-id": customFlags.iTwinIDFlag({
      description: 'The ID of the iTwin to be updated.'
    }),
    name: Flags.string({
      char: 'n',
      description: "The iTwin's display name.",
      helpValue: '<string>',
      required: false,
    }),
    // eslint-disable-next-line id-denylist
    number: Flags.string({
      description: 'Unique identifier for the iTwin.',
      helpValue: '<string>',
      required: false,
    }),
    status: Flags.string({
      description: 'Status of the iTwin. Defaults to Active.',
      helpValue: '<string>',
      options: ['Active', 'Inactive', 'Trial'],
      required: false,
    }),
    type: Flags.string({
      description: "Open ended property to define your iTwin's type. ",
      helpValue: '<string>',
      required: false,
    }),
  };
  
  public async run(): Promise<ITwin | undefined> {
    const { flags } = await this.parse(UpdateCommand);
  
    const iTwinUpdate: ITwin = {
      displayName: flags.name,
      geographicLocation: flags["geographic-location"],
      ianaTimeZone: flags["iana-time-zone"],   
      // eslint-disable-next-line id-denylist
      number: flags.number,
      status: flags.status,
      type: flags.type,
    };
  
    const accessToken = await this.getAccessToken();
    const client = this.getITwinAccessClient();
  
    const response = await client.updateiTwin(accessToken, flags["itwin-id"], iTwinUpdate);

    if (response.error)
    {
      this.error(JSON.stringify(response.error, null, 2));
    }
  
    return this.logAndReturnResult(response.data);
  }
}
