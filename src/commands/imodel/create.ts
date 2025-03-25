/*---------------------------------------------------------------------------------------------
* Copyright (c) Bentley Systems, Incorporated. All rights reserved.
* See LICENSE.md in the project root for license terms and full copyright notice.
*--------------------------------------------------------------------------------------------*/

import { Extent } from "@itwin/imodels-client-management";
import { Flags } from "@oclif/core";

import BaseCommand from "../../extensions/base-command.js";

export default class CreateIModel extends BaseCommand {
    static description = 'Creates an iModel in an iTwin';

    static examples = [
      {
        command: `<%= config.bin %> <%= command.id %> --itwin-id ad0ba809-9241-48ad-9eb0-c8038c1a1d51 --name "Basic iModel"`,
        description: 'Example 1: Creating an iModel with minimal options'
      },
      {
        command: `<%= config.bin %> <%= command.id %> --itwin-id ad0ba809-9241-48ad-9eb0-c8038c1a1d51 --name "Sun City Renewable-energy Plant" --description "Overall model of wind and solar farms in Sun City" --extent '{ "southWest": { "latitude": 46.13267702834806, "longitude": 7.672120009938448 }, "northEast": { "latitude": 46.302763954781234, "longitude": 7.835541640797823 }}'`,
        description: 'Example 2: Creating an iModel with all options, including extent and description'
      }
    ];

    static flags = {
      description: Flags.string({
        char: 'd',
        description: 'A description for the iModel.',
        required: false,
      }),
      extent: Flags.string({
        description: 'The maximum rectangular area on Earth that encloses the iModel, defined by its southwest and northeast corners.',
        required: false,
      }),
      "itwin-id": Flags.string({
        char: 'i',
        description: 'The ID of the iTwin where the iModel should be created.',
        required: true,
      }),
      name: Flags.string({
        char: 'n',
        description: 'The name of the iModel.',
        required: true,
      }),
    };
  
    async run() {
      const { flags } = await this.parse(CreateIModel);
  
      const extent = flags.extent ? JSON.parse(flags.extent) as Extent : undefined;
  
      const client = this.getIModelClient();
      const authorization = await this.getAuthorizationCallback();
  
      const iModel = await client.iModels.createEmpty({
        authorization,
        iModelProperties: {
          description: flags.description,
          extent,
          iTwinId: flags["itwin-id"],
          name: flags.name,
        },
      });
  
      return this.logAndReturnResult(iModel);
    }
  }
  