/*---------------------------------------------------------------------------------------------
* Copyright (c) Bentley Systems, Incorporated. All rights reserved.
* See LICENSE.md in the project root for license terms and full copyright notice.
*--------------------------------------------------------------------------------------------*/

import { Flags } from "@oclif/core";

import { apiReference } from "../../../extensions/api-reference.js";
import BaseCommand from "../../../extensions/base-command.js";
import { CustomFlags } from "../../../extensions/custom-flags.js";
import { authenticationType } from "../../../services/synchronizationClient/models/authentication-type.js";
import { connectorType } from "../../../services/synchronizationClient/models/connector-type.js";
import { storageFileCreate } from "../../../services/synchronizationClient/models/storage-file-create.js";

export default class CreateConnection extends BaseCommand {
  static apiReference: apiReference = {
    link: "https://developer.bentley.com/apis/synchronization/operations/create-storage-connection/",
    name: "Create Storage Connection",
  };

  static description = 'Create a storage connection that describes files from storage to synchronize with an iModel.';

	static examples = [
    {
      command: `<%= config.bin %> <%= command.id %> --imodel-id ad0ba809-9241-48ad-9eb0-c8038c1a1d51 --file-id t5bDFuN4qUa9ojVw1E5FGtldp8BgSbNCiJ2XMdiT-cA --connector-type MSTN`,
      description: 'Example 1: Minimal example with only required options'
    },
    {
      command: `<%= config.bin %> <%= command.id %> --imodel-id ad0ba809-9241-48ad-9eb0-c8038c1a1d51 --name "Engineering Files" --authentication-type Service --file-id t5bDFuN4qUa9ojVw1E5FGtldp8BgSbNCiJ2XMdiT-cA --connector-type MSTN --file-id g4ec1dc8c4f6173004f9f881914a57c5511a336d --connector-type DWG`,
      description: 'Example 2: Creating a connection with Service authentication'
    }
  ];

  static flags = {
    "authentication-type": Flags.string({ 
      description: `The authorization workflow type. Default value is 'User'`, 
      helpValue: '<string>',
      options: ['User', 'Service'], 
      required: false 
    }),
    "connector-type": Flags.string({ 
      description: 'Specify connectors to use for synchronization. This option can be provided multiple times. If a single connector-type option is provided, it will be matched to all file-id options. If multiple connectors are provided, each of them will be matched to a file by position: the first connector will be used for the first file, the second connector for the second file, and so on.', 
      helpValue: '<string>',
      multiple: true,
      options: [
        'AUTOPLANT',
        'AVEVAPID',
        'CIVIL',
        'CIVIL3D',
        'DWG',
        'GEOSPATIAL',
        'IFC',
        'MSTN',
        'NWD',
        'OBD',
        'OPENTOWER',
        'PROSTRUCTURES',
        'REVIT',
        'SPPID',
        'SPXREVIEW' 
      ],
      required: true
    }),
    "file-id": Flags.string({ 
      char: 'f',
      description: 'The ID of the storage file to synchronize', 
      helpValue: '<string>',
      multiple: true,
      required: true
    }),
    "imodel-id": CustomFlags.iModelIDFlag({
      description: 'The ID of the iModel.'
    }),
    name: Flags.string({
      char: 'n',
      description: 'The display name of the storage connection.',
      helpValue: '<string>',
      required: false,
    }),
  };

  async run() {
    const { flags } = await this.parse(CreateConnection);

    const client = await this.getSynchronizationClient();

    const sourceFiles : storageFileCreate[] = [];

    if(flags["connector-type"].length !== flags["file-id"].length && flags["connector-type"].length !== 1) {
      this.error("When multiple connector-type options are provided, their amount must match file-id option amount. Alternatively, you can provide a single connector-type option, which will then be applied to all file-id options.");
    }

    const isSingleConnectorTypeProvided = flags["connector-type"].length === 1;
    for (let i = 0; i < flags["file-id"].length; i++) {
      const connectorType = isSingleConnectorTypeProvided ? flags["connector-type"][0] as connectorType : flags["connector-type"][i] as connectorType
      sourceFiles.push({
        connectorType,
        storageFileId: flags["file-id"][i]
      });
    }

    const response = await client.createStorageConnection({
      authenticationType: flags["authentication-type"] as authenticationType,
      displayName: flags.name,
      iModelId: flags["imodel-id"],
      sourceFiles,
    });

    return this.logAndReturnResult(response.connection);
  }
}
