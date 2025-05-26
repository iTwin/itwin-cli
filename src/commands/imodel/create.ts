/*---------------------------------------------------------------------------------------------
* Copyright (c) Bentley Systems, Incorporated. All rights reserved.
* See LICENSE.md in the project root for license terms and full copyright notice.
*--------------------------------------------------------------------------------------------*/

import { Extent } from "@itwin/imodels-client-management";
import { Flags } from "@oclif/core";

import { apiReference } from "../../extensions/api-reference.js";
import BaseCommand from "../../extensions/base-command.js";
import { CustomFlags } from "../../extensions/custom-flags.js";
import { validateFloat } from "../../extensions/validation.js";

export default class CreateIModel extends BaseCommand {
    static apiReference: apiReference = {
        link: "https://developer.bentley.com/apis/imodels-v2/operations/create-imodel/",
        name: "Create iModel",
    };

    static customDocs = true; // Set to true to use custom documentation

    static description = `Create an empty iModel within a specified iTwin.

      iModel extent can be provided to this command in multiple ways:
      1) Utilizing the \`--extent\` flag, where coordinates are provided in form of serialized JSON.
      2) By providing all of the following flags: \`--sw-latitude\`, \`--sw-longitude\`, \`--ne-latitude\`, \`--ne-longitude\`
    `; 

    static examples = [
      {
        command: `<%= config.bin %> <%= command.id %> --itwin-id ad0ba809-9241-48ad-9eb0-c8038c1a1d51 --name "Basic iModel"`,
        description: 'Example 1: Creating an iModel with minimal options'
      },
      {
        command: `<%= config.bin %> <%= command.id %> --itwin-id ad0ba809-9241-48ad-9eb0-c8038c1a1d51 --name "Sun City Renewable-energy Plant" --description "Overall model of wind and solar farms in Sun City" --extent '{ "southWest": { "latitude": 46.13267702834806, "longitude": 7.672120009938448 }, "northEast": { "latitude": 46.302763954781234, "longitude": 7.835541640797823 }}'`,
        description: 'Example 2: Creating an iModel with all options, including extent (JSON form) and description'
      },
      {
        command: `<%= config.bin %> <%= command.id %> --itwin-id ad0ba809-9241-48ad-9eb0-c8038c1a1d51 --name "Sun City Renewable-energy Plant" --description "Overall model of wind and solar farms in Sun City" --sw-latitude 46.13267702834806 --sw-longitude 7.672120009938448 --ne-latitude 46.302763954781234 --ne-longitude 7.835541640797823`,
        description: 'Example 3: Creating an iModel with all options, including extent (seperate flags) and description'
      },
    ];

    static flags = {
      description: Flags.string({
        char: 'd',
        description: 'A description for the iModel.',
        helpValue: '<string>',
        required: false,
      }),
      extent: Flags.string({
        description: 'The maximum rectangular area on Earth that encloses the iModel, defined by its southwest and northeast corners and provided in serialized JSON format.',
        helpValue: '<string>',
        required: false,
      }),
      "itwin-id": CustomFlags.iTwinIDFlag({
        description: 'The ID of the iTwin where the iModel should be created.'
      }),
      name: Flags.string({
        char: 'n',
        description: 'The name of the iModel.',
        helpValue: '<string>',
        required: true,
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
      save: Flags.boolean({
        description: 'Save the iModel id to the context.',
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
      const { flags } = await this.parse(CreateIModel);
  
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

      this.setContext(iModel.iTwinId, iModel.id);
        
      return this.logAndReturnResult(iModel);
    }
  }
