/*---------------------------------------------------------------------------------------------
* Copyright (c) Bentley Systems, Incorporated. All rights reserved.
* See LICENSE.md in the project root for license terms and full copyright notice.
*--------------------------------------------------------------------------------------------*/

import { Flags } from "@oclif/core";

import BaseCommand from "../../../extensions/base-command.js";

export default class ListRepositories extends BaseCommand {
    static description = 'Retrieve a list of repositories for a specified iTwin.';

    static examples = [
      {
        command: `<%= config.bin %> <%= command.id %> --itwin-id ad0ba809-9241-48ad-9eb0-c8038c1a1d51`,
        description: 'Example 1: Listing all repositories for an iTwin'
      },
      {
        command: `<%= config.bin %> <%= command.id %> --itwin-id ad0ba809-9241-48ad-9eb0-c8038c1a1d51 --class iModels`,
        description: 'Example 2: Filtering repositories by class'
      },
      {
        command: `<%= config.bin %> <%= command.id %> --itwin-id ad0ba809-9241-48ad-9eb0-c8038c1a1d51 --class GeographicInformationSystem --sub-class WebMapTileService`,
        description: 'Example 3: Filtering repositories by class and subClass'
      }
    ];

    static flags = {
      class: Flags.string({
        description: 'Specify a particular class of repositories to retrieve.',
        helpValue: '<string>',
        options: ["iModels", "RealityData", "Storage", "Forms", "Issues", "SensorData", "GeographicInformationSystem", "Construction", "Subsurface"],
        required: false
      }),
      "itwin-id": Flags.string({
        char: 'i',
        description: 'The ID of the iTwin whose repositories should be retrieved.',
        helpValue: '<string>',
        required: true,
      }),
      "sub-class": Flags.string({
        description: 'Specify a subClass of repositories. Only applicable for GeographicInformationSystem class.',
        helpValue: '<string>',
        options: ["WebMapService", "WebMapTileService", "MapServer"],
        required: false
      }),
    };
  
    async run() {
      const { flags } = await this.parse(ListRepositories);
  
      const client = this.getITwinAccessClient();
      const accessToken = await this.getAccessToken();
      
      const response = await client.queryRepositoriesAsync(accessToken, flags["itwin-id"], {
        class: flags.class,
        subClass: flags["sub-class"]
      });

      if(response.error)
      {
        this.error(JSON.stringify(response.error, null, 2));
      }
  
      return this.logAndReturnResult(response.data);
    }
  }
  