/*---------------------------------------------------------------------------------------------
 * Copyright (c) Bentley Systems, Incorporated. All rights reserved.
 * See LICENSE.md in the project root for license terms and full copyright notice.
 *--------------------------------------------------------------------------------------------*/

import { NamedVersion, NamedVersionOrderByProperty, OrderByOperator } from "@itwin/imodels-client-management";
import { Flags } from "@oclif/core";

import { ApiReference } from "../../../extensions/api-reference.js";
import BaseCommand from "../../../extensions/base-command.js";
import { CustomFlags } from "../../../extensions/custom-flags.js";

export default class ListNamedVersions extends BaseCommand {
  public static apiReference: ApiReference = {
    link: "https://developer.bentley.com/apis/imodels-v2/operations/get-imodel-named-versions/",
    name: "Get Named Versions",
  };

  public static description = "List all named versions for a specific iModel.";

  public static examples = [
    {
      command: `<%= config.bin %> <%= command.id %> --imodel-id ad0ba809-9241-48ad-9eb0-c8038c1a1d51 --top 10`,
      description: "Example 1: List the first 10 named versions for a specific iModel",
    },
    {
      command: `<%= config.bin %> <%= command.id %> --imodel-id ad0ba809-9241-48ad-9eb0-c8038c1a1d51 --skip 5 --top 10`,
      description: "Example 2: Skip the first 5 named versions and return the next set",
    },
    {
      command: `<%= config.bin %> <%= command.id %> --imodel-id ad0ba809-9241-48ad-9eb0-c8038c1a1d51 --search "Milestone"`,
      description: `Example 3: Search for named versions containing 'Milestone'`,
    },
    {
      command: `<%= config.bin %> <%= command.id %> --imodel-id ad0ba809-9241-48ad-9eb0-c8038c1a1d51 --name "Version 2.0" --order-by "changesetIndex desc"`,
      description: "Example 4: Filter named versions by exact name and sort in descending order by changesetIndex",
    },
  ];

  public static flags = {
    "imodel-id": CustomFlags.iModelIDFlag({
      description: "The ID of the iModel whose named versions you want to list.",
    }),
    name: Flags.string({
      char: "n",
      description: "Filter named versions by exact name.",
      helpValue: "<string>",
      required: false,
    }),
    "order-by": Flags.string({
      description: "Sort by `changesetIndex` or `createdDateTime`, in `asc` or `desc` order.",
      helpValue: "<string>",
      required: false,
      options: ["changesetIndex desc", "changesetIndex asc", "createdDateTime desc", "createdDateTime asc"],
      type: "option",
    }),
    search: Flags.string({
      description: "Search named versions by name or description.",
      helpValue: "<string>",
      required: false,
    }),
    skip: Flags.integer({
      description: "Skip a number of named versions in the result.",
      helpValue: "<integer>",
      required: false,
    }),
    top: Flags.integer({
      description: "Limit the number of named versions returned.",
      helpValue: "<integer>",
      required: false,
    }),
  };

  public async run(): Promise<NamedVersion[]> {
    const { flags } = await this.parse(ListNamedVersions);

    const service = await this.getIModelService();
    const orderByProperty = flags["order-by"]?.split(" ")[0] as NamedVersionOrderByProperty;
    const orderByOperator = flags["order-by"]?.split(" ")[1] as OrderByOperator;
    const result = await service.getNamedVersions(flags["imodel-id"], flags.name, orderByOperator, orderByProperty, flags.search, flags.skip, flags.top);

    return this.logAndReturnResult(result);
  }
}
