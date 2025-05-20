/*---------------------------------------------------------------------------------------------
* Copyright (c) Bentley Systems, Incorporated. All rights reserved.
* See LICENSE.md in the project root for license terms and full copyright notice.
*--------------------------------------------------------------------------------------------*/

import { Extent } from "@itwin/imodels-client-management";
import { Flags } from "@oclif/core";

import { apiReference } from "../../extensions/api-reference.js";
import BaseCommand from "../../extensions/base-command.js";
import { CustomFlags } from "../../extensions/custom-flags.js";
import { validateFloat, validateJson } from "../../extensions/validation.js";

export default class UpdateCommand extends BaseCommand {
    static apiReference: apiReference = {
        link: "https://developer.bentley.com/apis/imodels-v2/operations/update-imodel/",
        name: "Update iModel",
    };

    static customDocs = true;

    static description = `Update metadata of an existing iModel.
    
      iModel extent can be provided to this command in multiple ways:
      1) Utilizing the \`--extent\` flag, where coordinates are provided in form of serialized JSON.
      2) By providing all of the following flags: \`--sw-latitude\`, \`--sw-longitude\`, \`--ne-latitude\`, \`--ne-longitude\`
    `;

    static examples = [
      {
        command: `<%= config.bin %> <%= command.id %> --imodel-id 5e19bee0-3aea-4355-a9f0-c6df9989ee7d --name "Updated Sun City Renewable-energy Plant" --description "Updated overall model of wind and solar farms in Sun City" --extent '{ "southWest": { "latitude": 46.13267702834806, "longitude": 7.672120009938448 }, "northEast": { "latitude": 46.302763954781234, "longitude": 7.835541640797823 }}'`,
        description: 'Example 1: Updating an iModel name, description and extent (JSON format)'
      },
      {
        command: `<%= config.bin %> <%= command.id %> --imodel-id 5e19bee0-3aea-4355-a9f0-c6df9989ee7d --name "Updated Sun City Renewable-energy Plant" --description "Updated overall model of wind and solar farms in Sun City" --sw-latitude 46.13267702834806 --sw-longitude 7.672120009938448 --ne-latitude 46.302763954781234 --ne-longitude 7.835541640797823`,
        description: 'Example 2: Updating an iModel name, description and extent (separate flags format)'
      }
    ];

    static flags = {
      description: Flags.string({
        char: 'd',
        description: 'The new description for the iModel.',
        helpValue: '<string>',
        required: false,
      }),
      extent: Flags.string({
        description: 'The new maximum rectangular area on Earth that encloses the iModel, defined by its southwest and northeast corners and provided in serialized JSON format.',
        helpValue: '<object>',
        parse: input => validateJson(input),
        required: false,
      }),
      "imodel-id": CustomFlags.iModelIDFlag({
        description: 'The ID of the iModel to update.'
      }),
      name: Flags.string({
        char: 'n',
        description: 'The new name of the iModel.',
        helpValue: '<string>',
        required: false,
      }),
      "ne-latitude": Flags.string({
        dependsOn: ['ne-longitude', 'sw-latitude', 'sw-longitude'],
        description: 'Northeast latitude of the extent.',
        exclusive: ['extent'],
        helpValue: "<float>",
        parse: (input) => validateFloat(input),
        required: false,
      }),
      "ne-longitude": Flags.string({
        dependsOn: ['ne-latitude', 'sw-latitude', 'sw-longitude'],
        description: 'Northeast longitude of the extent.',
        exclusive: ['extent'],
        helpValue: "<float>",
        parse: (input) => validateFloat(input),
        required: false,
      }),
      "sw-latitude": Flags.string({
        dependsOn:['ne-latitude', 'ne-longitude', 'sw-longitude'],
        description: 'Southwest latitude of the extent.',
        exclusive: ['extent'],
        helpValue: "<float>",
        parse: (input) => validateFloat(input),
        required: false,
      }),
      "sw-longitude": Flags.string({
        dependsOn: ['ne-latitude', 'ne-longitude', 'sw-latitude'], 
        description: 'Southwest longitude of the extent.',
        exclusive: ['extent'],
        helpValue: "<float>",
        parse: (input) => validateFloat(input),
        required: false,
      }),
    };
  
    async run() {
      const { flags } = await this.parse(UpdateCommand);
  
      let extent = flags.extent ? JSON.parse(flags.extent) as Extent : undefined;
      if(flags["ne-latitude"] !== undefined) {
        extent ??= {
          northEast: {
            latitude: Number.parseFloat(flags["ne-latitude"]!),
            longitude: Number.parseFloat(flags["ne-longitude"]!),
          },
          southWest: {
            latitude: Number.parseFloat(flags["sw-latitude"]!),
            longitude: Number.parseFloat(flags["sw-longitude"]!)
          }
        }
      }
  
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
