/*---------------------------------------------------------------------------------------------
* Copyright (c) Bentley Systems, Incorporated. All rights reserved.
* See LICENSE.md in the project root for license terms and full copyright notice.
*--------------------------------------------------------------------------------------------*/

import { ITwin } from "@itwin/itwins-client";
import { ApiReference } from "../../extensions/api-reference.js";
import BaseCommand from "../../extensions/base-command.js";
import { customFlags } from "../../extensions/custom-flags.js";

export default class ITwinInfo extends BaseCommand {
  public static apiReference: ApiReference = {
    link: "https://developer.bentley.com/apis/iTwins/operations/get-itwin/",
    name: "Get iTwin Details",
  };

  public static description = 'Retrieve metadata for the specified iTwin.';

  public static examples = [
    {
      command: `<%= config.bin %> <%= command.id %> --itwin-id b1a2c3d4-5678-90ab-cdef-1234567890ab`,
      description: 'Example 1:'
    }
  ];

  public static flags = {
    "itwin-id": customFlags.iTwinIDFlag({
      description: 'The ID of the iTwin to retrieve information about.'
    }),
  };
  
  public async run(): Promise<ITwin | undefined> {
    const { flags } = await this.parse(ITwinInfo);
    
    const accessToken = await this.getAccessToken();
    const client = this.getITwinAccessClient();
  
    const response = await client.getAsync(accessToken, flags["itwin-id"], 'representation');

    if (response.error)
    {
      this.error(JSON.stringify(response.error, null, 2));
    }
  
    return this.logAndReturnResult(response.data);
  }
}
