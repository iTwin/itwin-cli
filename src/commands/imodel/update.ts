/*---------------------------------------------------------------------------------------------
 * Copyright (c) Bentley Systems, Incorporated. All rights reserved.
 * See LICENSE.md in the project root for license terms and full copyright notice.
 *--------------------------------------------------------------------------------------------*/

import { IModel } from "@itwin/imodels-client-management";
import { Flags } from "@oclif/core";

import { ApiReference } from "../../extensions/api-reference.js";
import BaseCommand from "../../extensions/base-command.js";
import { customFlags } from "../../extensions/custom-flags.js";
import { validateFloat } from "../../extensions/validation/validate-float.js";

export default class UpdateCommand extends BaseCommand {
  public static apiReference: ApiReference = {
    link: "https://developer.bentley.com/apis/imodels-v2/operations/update-imodel/",
    name: "Update iModel",
  };

  public static customDocs = true;

  public static description = `Update metadata of an existing iModel.
    
      iModel extent can be provided to this command in multiple ways:
      1) Utilizing the \`--extent\` flag, where coordinates are provided in form of serialized JSON.
      2) By providing all of the following flags: \`--sw-latitude\`, \`--sw-longitude\`, \`--ne-latitude\`, \`--ne-longitude\`
    `;

  public static examples = [
    {
      command: `<%= config.bin %> <%= command.id %> --imodel-id 5e19bee0-3aea-4355-a9f0-c6df9989ee7d --name "Updated Sun City Renewable-energy Plant" --description "Updated overall model of wind and solar farms in Sun City" --extent '{ "southWest": { "latitude": 46.13267702834806, "longitude": 7.672120009938448 }, "northEast": { "latitude": 46.302763954781234, "longitude": 7.835541640797823 }}'`,
      description: "Example 1: Updating an iModel name, description and extent (JSON format)",
    },
    {
      command: `<%= config.bin %> <%= command.id %> --imodel-id 5e19bee0-3aea-4355-a9f0-c6df9989ee7d --name "Updated Sun City Renewable-energy Plant" --description "Updated overall model of wind and solar farms in Sun City" --sw-latitude 46.13267702834806 --sw-longitude 7.672120009938448 --ne-latitude 46.302763954781234 --ne-longitude 7.835541640797823`,
      description: "Example 2: Updating an iModel name, description and extent (separate flags format)",
    },
  ];

  public static flags = {
    description: Flags.string({
      char: "d",
      description: "The new description for the iModel.",
      helpValue: "<string>",
      required: false,
    }),
    extent: customFlags.extent({
      description:
        "The new maximum rectangular area on Earth that encloses the iModel, defined by its southwest and northeast corners and provided in serialized JSON format.",
      helpValue: "<string>",
      required: false,
    }),
    "imodel-id": customFlags.iModelIDFlag({
      description: "The ID of the iModel to update.",
    }),
    name: Flags.string({
      char: "n",
      description: "The new name of the iModel.",
      helpValue: "<string>",
      required: false,
    }),
    "ne-latitude": Flags.string({
      dependsOn: ["ne-longitude", "sw-latitude", "sw-longitude"],
      description: "Northeast latitude of the extent.",
      exclusive: ["extent"],
      helpValue: "<float>",
      // eslint-disable-next-line @typescript-eslint/promise-function-async
      parse: (input) => validateFloat(input),
      required: false,
    }),
    "ne-longitude": Flags.string({
      dependsOn: ["ne-latitude", "sw-latitude", "sw-longitude"],
      description: "Northeast longitude of the extent.",
      exclusive: ["extent"],
      helpValue: "<float>",
      // eslint-disable-next-line @typescript-eslint/promise-function-async
      parse: (input) => validateFloat(input),
      required: false,
    }),
    "sw-latitude": Flags.string({
      dependsOn: ["ne-latitude", "ne-longitude", "sw-longitude"],
      description: "Southwest latitude of the extent.",
      exclusive: ["extent"],
      helpValue: "<float>",
      // eslint-disable-next-line @typescript-eslint/promise-function-async
      parse: (input) => validateFloat(input),
      required: false,
    }),
    "sw-longitude": Flags.string({
      dependsOn: ["ne-latitude", "ne-longitude", "sw-latitude"],
      description: "Southwest longitude of the extent.",
      exclusive: ["extent"],
      helpValue: "<float>",
      // eslint-disable-next-line @typescript-eslint/promise-function-async
      parse: (input) => validateFloat(input),
      required: false,
    }),
  };

  public async run(): Promise<IModel> {
    const { flags } = await this.parse(UpdateCommand);

    if (
      flags["ne-latitude"] !== undefined &&
      flags["ne-longitude"] !== undefined &&
      flags["sw-latitude"] !== undefined &&
      flags["sw-longitude"] !== undefined
    ) {
      flags.extent ??= {
        northEast: {
          latitude: Number.parseFloat(flags["ne-latitude"]),
          longitude: Number.parseFloat(flags["ne-longitude"]),
        },
        southWest: {
          latitude: Number.parseFloat(flags["sw-latitude"]),
          longitude: Number.parseFloat(flags["sw-longitude"]),
        },
      };
    }

    if (flags.description === undefined && flags.name === undefined && flags.extent === undefined) {
      this.error("At least one of the update parameters must be provided");
    }

    const client = this.getIModelClient();
    const authorization = await this.getAuthorizationCallback();

    const iModelInfo = await client.iModels.getSingle({
      authorization,
      iModelId: flags["imodel-id"],
    });

    const iModel = await client.iModels.update({
      authorization,
      iModelId: flags["imodel-id"],
      iModelProperties: {
        description: flags.description,
        extent: flags.extent,
        name: flags.name ?? iModelInfo.name,
      },
    });

    return this.logAndReturnResult(iModel);
  }
}
