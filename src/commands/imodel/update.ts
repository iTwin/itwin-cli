/*---------------------------------------------------------------------------------------------
* Copyright (c) Bentley Systems, Incorporated. All rights reserved.
* See LICENSE.md in the project root for license terms and full copyright notice.
*--------------------------------------------------------------------------------------------*/

import { Extent } from "@itwin/imodels-client-management";
import { Flags } from "@oclif/core";

import BaseCommand from "../../extensions/base-command.js";

export default class UpdateCommand extends BaseCommand {
    static description = 'Update an iModel in an iTwin';

    static examples = [
      `<%= config.bin %> <%= command.id %> --imodel-id 5e19bee0-3aea-4355-a9f0-c6df9989ee7d --name "Updated Sun City Renewable-energy Plant" --description "Updated overall model of wind and solar farms in Sun City" --extent '{ "southWest": { "latitude": 46.13267702834806, "longitude": 7.672120009938448 }, "northEast": { "latitude": 46.302763954781234, "longitude": 7.835541640797823 }}'`
    ];

    static flags = {
      description: Flags.string({
        char: 'd',
        description: 'The new description for the iModel.',
        required: false,
      }),
      extent: Flags.string({
        description: 'The new maximum rectangular area on Earth that encloses the iModel, defined by its southwest and northeast corners.',
        required: false,
      }),
      "imodel-id": Flags.string({
        char: 'm',
        description: 'The ID of the iModel to update.',
        required: true,
      }),
      name: Flags.string({
        char: 'n',
        description: 'The new name of the iModel.',
        required: false,
      }),
    };
  
    async run() {
      const { flags } = await this.parse(UpdateCommand);
  
      const extent = flags.extent ? JSON.parse(flags.extent) as Extent : undefined;
  
      if (flags.description === undefined && flags.name === undefined && extent === undefined) {
        this.error("At least one of the update parameters must be provided");
      }
  
      const client = this.getIModelClient();
      const authorization = await this.getAuthorizationCallback();
  
      const iModelInfo = await client.iModels.getSingle({
        authorization,
        iModelId: flags["imodel-id"]
      });

      const iModel = await client.iModels.update({
        authorization,
        iModelId: flags["imodel-id"],
        iModelProperties: {
            description: flags.description,
            extent,
            name: flags.name ?? iModelInfo.name
        },
      });
  
      return this.logAndReturnResult(iModel);
    }
  }
  