/*---------------------------------------------------------------------------------------------
* Copyright (c) Bentley Systems, Incorporated. All rights reserved.
* See LICENSE.md in the project root for license terms and full copyright notice.
*--------------------------------------------------------------------------------------------*/

import { RepositoryClass, RepositorySubClass } from "@itwin/itwins-client";
import { Flags } from "@oclif/core";

import { apiReference } from "../../../extensions/api-reference.js";
import BaseCommand from "../../../extensions/base-command.js";
import { CustomFlags } from "../../../extensions/custom-flags.js";

export default class CreateRepository extends BaseCommand {
    static apiReference: apiReference = {
        link: "https://developer.bentley.com/apis/iTwins/operations/create-repository/",
        name: "Create Repository",
    };

    static description = 'Create a new repository URI for iTwin data.';

    static examples = [
      {
        command: `<%= config.bin %> <%= command.id %> --itwin-id ad0ba809-9241-48ad-9eb0-c8038c1a1d51 --class GeographicInformationSystem --sub-class WebMapTileService --uri https://example.com/repository1`,
        description: 'Example 1: Creating a repository with Geographic Information System class'
      },
      {
        command: `<%= config.bin %> <%= command.id %> --itwin-id ad0ba809-9241-48ad-9eb0-c8038c1a1d51 --class Construction --sub-class Performance --uri https://example.com/repository2`,
        description: 'Example 2: Creating a repository for Construction class with MapServer subclass'
      },
      {
        command: `<%= config.bin %> <%= command.id %> --itwin-id ad0ba809-9241-48ad-9eb0-c8038c1a1d51 --class Subsurface --sub-class EvoWorkspace --uri https://example.com/repository3`,
        description: 'Example 3: Creating a repository for Subsurface class without specifying a subclass'
      }
    ];

    static flags = {
      class: Flags.string({
        description: 'The class of your iTwin repository.',
        helpValue: '<string>',
        options: ['GeographicInformationSystem', 'Construction', 'Subsurface'],
        required: true,
      }),
      "itwin-id": CustomFlags.iTwinIDFlag({
        description: 'The ID of the iTwin to which the repository belongs.'
      }),
      "sub-class": Flags.string({
        description: 'The subClass of your repository.',
        helpValue: '<string>',
        options: ['WebMapService', 'WebMapTileService', 'MapServer', 'Performance', 'EvoWorkspace'],
        required: false,
      }),
      uri: Flags.string({
        description: 'The URI to the custom repository.',
        helpValue: '<string>',
        required: true,
      }),
    };
  
    async run() {
      const { flags } = await this.parse(CreateRepository);
  
      const accessToken = await this.getAccessToken();
      const client = this.getITwinAccessClient();

      const response = await client.createRepository(accessToken, flags["itwin-id"], {
        class: flags.class as RepositoryClass,
        subClass: flags["sub-class"] as RepositorySubClass,
        uri: flags.uri
      });

      if(response.error)
      {
        this.error(JSON.stringify(response.error, null, 2));
      }
  
      return this.logAndReturnResult(response.data);
    }
  }
