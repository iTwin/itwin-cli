/*---------------------------------------------------------------------------------------------
 * Copyright (c) Bentley Systems, Incorporated. All rights reserved.
 * See LICENSE.md in the project root for license terms and full copyright notice.
 *--------------------------------------------------------------------------------------------*/

import { Flags } from "@oclif/core";

import { ApiReference } from "../../../extensions/api-reference.js";
import BaseCommand from "../../../extensions/base-command.js";
import { CustomFlags } from "../../../extensions/custom-flags.js";
import { AuthenticationType } from "../../../services/synchronization/models/authentication-type.js";
import { ConnectorType } from "../../../services/synchronization/models/connector-type.js";
import { StorageConnection } from "../../../services/synchronization/models/storage-connection.js";

export default class CreateConnection extends BaseCommand {
  public static apiReference: ApiReference = {
    link: "https://developer.bentley.com/apis/synchronization/operations/create-storage-connection/",
    name: "Create Storage Connection",
  };

  public static description = "Create a storage connection that describes files from storage to synchronize with an iModel.";

  public static examples = [
    {
      command: `<%= config.bin %> <%= command.id %> --imodel-id ad0ba809-9241-48ad-9eb0-c8038c1a1d51 --file-id t5bDFuN4qUa9ojVw1E5FGtldp8BgSbNCiJ2XMdiT-cA --connector-type MSTN`,
      description: "Example 1: Minimal example with only required options",
    },
    {
      command: `<%= config.bin %> <%= command.id %> --imodel-id ad0ba809-9241-48ad-9eb0-c8038c1a1d51 --name "Engineering Files" --authentication-type Service --file-id t5bDFuN4qUa9ojVw1E5FGtldp8BgSbNCiJ2XMdiT-cA --connector-type MSTN --file-id g4ec1dc8c4f6173004f9f881914a57c5511a336d --connector-type DWG`,
      description: "Example 2: Creating a connection with Service authentication",
    },
  ];

  public static flags = {
    "authentication-type": Flags.string({
      description: `The authorization workflow type. Default value depends on currently used authentication type as follows: Interactive login -> 'User', Service Client login -> 'Service'`,
      helpValue: "<string>",
      options: ["User", "Service"],
      required: false,
    }),
    "connector-type": Flags.string({
      description:
        "Specify connectors to use for synchronization. This option can be provided multiple times. If a single connector-type option is provided, it will be matched to all file-id options. If multiple connectors are provided, each of them will be matched to a file by position: the first connector will be used for the first file, the second connector for the second file, and so on.",
      helpValue: "<string>",
      multiple: true,
      options: ["AUTOPLANT", "CIVIL", "CIVIL3D", "DWG", "GEOSPATIAL", "IFC", "MSTN", "NWD", "OBD", "OPENTOWER", "PROSTRUCTURES", "REVIT", "SPPID", "SPXREVIEW"],
      required: true,
    }),
    "file-id": Flags.string({
      char: "f",
      description: "The ID of the storage file to synchronize",
      helpValue: "<string>",
      multiple: true,
      required: true,
    }),
    "imodel-id": CustomFlags.iModelIDFlag({
      description: "The ID of the iModel.",
    }),
    name: Flags.string({
      char: "n",
      description: "The display name of the storage connection.",
      helpValue: "<string>",
      required: false,
    }),
  };

  public async run(): Promise<StorageConnection | undefined> {
    const { flags } = await this.parse(CreateConnection);

    const synchronizationApiService = await this.getSynchronizationApiService();

    const result = await synchronizationApiService.createConnection(
      flags["imodel-id"],
      flags["file-id"],
      flags["connector-type"] as ConnectorType[],
      flags.name,
      flags["authentication-type"] as AuthenticationType,
    );

    return this.logAndReturnResult(result);
  }
}
