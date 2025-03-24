/*---------------------------------------------------------------------------------------------
* Copyright (c) Bentley Systems, Incorporated. All rights reserved.
* See LICENSE.md in the project root for license terms and full copyright notice.
*--------------------------------------------------------------------------------------------*/

import { RepositoryClass, RepositorySubClass } from "@itwin/itwins-client";
import { Flags } from "@oclif/core";

import BaseCommand from "../../../extensions/base-command.js";

export default class CreateRepository extends BaseCommand {
    static description = 'Create a new repository URI for iTwin data.';
  
    static flags = {
      class: Flags.string({
        description: 'The class of your iTwin repository.',
        options: ['GeographicInformationSystem', 'Construction', 'Subsurface'],
        required: true,
      }),
      "itwin-id": Flags.string({
        char: 'i',
        description: 'The ID of the iTwin to which the repository belongs.',
        required: true,
      }),
      "sub-class": Flags.string({
        description: 'The subClass of your repository.',
        options: ['WebMapService', 'WebMapTileService', 'MapServer', 'Performance', 'EvoWorkspace'],
        required: false,
      }),
      uri: Flags.string({
        description: 'The URI to the custom repository.',
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
  