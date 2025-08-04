/*---------------------------------------------------------------------------------------------
 * Copyright (c) Bentley Systems, Incorporated. All rights reserved.
 * See LICENSE.md in the project root for license terms and full copyright notice.
 *--------------------------------------------------------------------------------------------*/

import { IModel } from "@itwin/imodels-client-management";
import { Flags } from "@oclif/core";

import { ApiReference } from "../../extensions/api-reference.js";
import BaseCommand from "../../extensions/base-command.js";
import { CustomFlags } from "../../extensions/custom-flags.js";

export default class CreateIModel extends BaseCommand {
  public static apiReference: ApiReference = {
    link: "https://developer.bentley.com/apis/imodels-v2/operations/create-imodel/",
    name: "Create iModel",
  };

  public static customDocs = true; // Set to true to use custom documentation

  public static description = `Create an empty iModel within a specified iTwin.

    iModel extent can be provided to this command in multiple ways:
    1) Utilizing the \`--extent\` flag, where coordinates are provided in form of serialized JSON.
    2) By providing all of the following flags: \`--sw-latitude\`, \`--sw-longitude\`, \`--ne-latitude\`, \`--ne-longitude\`
  `;

  public static examples = [
    {
      command: `<%= config.bin %> <%= command.id %> --itwin-id ad0ba809-9241-48ad-9eb0-c8038c1a1d51 --name "Basic iModel"`,
      description: "Example 1: Creating an iModel with minimal options",
    },
    {
      command: `<%= config.bin %> <%= command.id %> --itwin-id ad0ba809-9241-48ad-9eb0-c8038c1a1d51 --name "Sun City Renewable-energy Plant" --description "Overall model of wind and solar farms in Sun City" --extent '{ "southWest": { "latitude": 46.13267702834806, "longitude": 7.672120009938448 }, "northEast": { "latitude": 46.302763954781234, "longitude": 7.835541640797823 }}'`,
      description: "Example 2: Creating an iModel with all options, including extent (JSON form) and description",
    },
    {
      command: `<%= config.bin %> <%= command.id %> --itwin-id ad0ba809-9241-48ad-9eb0-c8038c1a1d51 --name "Sun City Renewable-energy Plant" --description "Overall model of wind and solar farms in Sun City" --sw-latitude 46.13267702834806 --sw-longitude 7.672120009938448 --ne-latitude 46.302763954781234 --ne-longitude 7.835541640797823`,
      description: "Example 3: Creating an iModel with all options, including extent (seperate flags) and description",
    },
  ];

  public static flags = {
    description: Flags.string({
      char: "d",
      description: "A description for the iModel.",
      helpValue: "<string>",
      required: false,
    }),
    extent: CustomFlags.extent({
      description:
        "The maximum rectangular area on Earth that encloses the iModel, defined by its southwest and northeast corners and provided in serialized JSON format.",
      helpValue: "<string>",
      required: false,
    }),
    "itwin-id": CustomFlags.iTwinIDFlag({
      description: "The ID of the iTwin where the iModel should be created.",
    }),
    name: Flags.string({
      char: "n",
      description: "The name of the iModel.",
      helpValue: "<string>",
      required: true,
    }),
    "ne-latitude": CustomFlags.float({
      dependsOn: ["ne-longitude", "sw-latitude", "sw-longitude"],
      description: "Northeast latitude of the extent.",
      exclusive: ["extent"],
      helpValue: "<float>",
      required: false,
    }),
    "ne-longitude": CustomFlags.float({
      dependsOn: ["ne-latitude", "sw-latitude", "sw-longitude"],
      description: "Northeast longitude of the extent.",
      exclusive: ["extent"],
      helpValue: "<float>",
      required: false,
    }),
    save: Flags.boolean({
      description: "Save the iModel id to the context.",
      required: false,
    }),
    "sw-latitude": CustomFlags.float({
      dependsOn: ["ne-latitude", "ne-longitude", "sw-longitude"],
      description: "Southwest latitude of the extent.",
      exclusive: ["extent"],
      helpValue: "<float>",
      required: false,
    }),
    "sw-longitude": CustomFlags.float({
      dependsOn: ["ne-latitude", "ne-longitude", "sw-latitude"],
      description: "Southwest longitude of the extent.",
      exclusive: ["extent"],
      helpValue: "<float>",
      required: false,
    }),
  };

  public async run(): Promise<IModel> {
    const { flags } = await this.parse(CreateIModel);

    if (
      flags["ne-latitude"] !== undefined &&
      flags["ne-longitude"] !== undefined &&
      flags["sw-latitude"] !== undefined &&
      flags["sw-longitude"] !== undefined
    ) {
      flags.extent ??= {
        northEast: {
          latitude: flags["ne-latitude"],
          longitude: flags["ne-longitude"],
        },
        southWest: {
          latitude: flags["sw-latitude"],
          longitude: flags["sw-longitude"],
        },
      };
    }

    const iModelService = await this.getIModelService();

    const result = await iModelService.createIModel(flags["itwin-id"], flags.name, flags.save, flags.description, flags.extent);

    if (flags.save) {
      await this.contextService.setContext(result.iTwinId, result.id);
    }

    return this.logAndReturnResult(result);
  }
}
