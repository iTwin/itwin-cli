/*---------------------------------------------------------------------------------------------
 * Copyright (c) Bentley Systems, Incorporated. All rights reserved.
 * See LICENSE.md in the project root for license terms and full copyright notice.
 *--------------------------------------------------------------------------------------------*/

import { Flags } from "@oclif/core";

import { ApiReference } from "../../../extensions/api-reference.js";
import BaseCommand from "../../../extensions/base-command.js";
import { customFlags } from "../../../extensions/custom-flags.js";
import { StorageConnectionListResponse } from "../../../services/synchronizationClient/models/storage-connection-response.js";

export default class ListConnections extends BaseCommand {
  public static apiReference: ApiReference = {
    link: "https://developer.bentley.com/apis/synchronization/operations/get-storage-connections/",
    name: "Get Storage Connections",
  };

  public static description = "List all storage connections of a specific iModel.";

  public static examples = [
    {
      command: `<%= config.bin %> <%= command.id %> --imodel-id ad0ba809-9241-48ad-9eb0-c8038c1a1d51`,
      description: "Example 1: Listing all connections for an iModel",
    },
    {
      command: `<%= config.bin %> <%= command.id %> --imodel-id ad0ba809-9241-48ad-9eb0-c8038c1a1d51 --top 5`,
      description: "Example 2: Listing the first 5 connections for an iModel",
    },
    {
      command: `<%= config.bin %> <%= command.id %> --imodel-id ad0ba809-9241-48ad-9eb0-c8038c1a1d51 --top 5 --skip 15`,
      description: "Example 3: Listing the 5 connections after the first 15 connections are skipped for an iModel",
    },
  ];

  public static flags = {
    "imodel-id": customFlags.iModelIDFlag({
      description: "The ID of the iModel whose storage connections you want to list.",
    }),
    skip: Flags.integer({
      description: "The number of changesets to skip.",
      helpValue: "<integer>",
      required: false,
    }),
    top: Flags.integer({
      description: "The maximum number of changesets to return.",
      helpValue: "<integer>",
      required: false,
    }),
  };

  public async run(): Promise<StorageConnectionListResponse> {
    const { flags } = await this.parse(ListConnections);

    const client = await this.getSynchronizationClient();

    const response = await client.getStorageConnections(flags["imodel-id"], flags.top, flags.skip);

    return this.logAndReturnResult(response);
  }
}
