/*---------------------------------------------------------------------------------------------
* Copyright (c) Bentley Systems, Incorporated. All rights reserved.
* See LICENSE.md in the project root for license terms and full copyright notice.
*--------------------------------------------------------------------------------------------*/

import { Flags } from "@oclif/core";

import { apiReference } from "../../../extensions/api-reference.js";
import BaseCommand from "../../../extensions/base-command.js";
import { CustomFlags } from "../../../extensions/custom-flags.js";
import { authorizationInformation, authorizationType } from "../../../services/authorization-client/authorization-type.js";
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
      description: `The authorization workflow type. Default value depends on currently used authentication type as follows: Interactive login -> 'User', Service Client login -> 'Service'`, 
      helpValue: '<string>',
      options: ['User', 'Service'], 
      required: false 
    }),
    "connector-type": Flags.string({ 
      description: 'The connector type of your file. Each connector will be used for the corresponding file in the files list (first connector for the first file, second connector for the second file, and so on).', 
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

    if(flags["connector-type"].length !== flags["file-id"].length) {
      this.error("The number of connector types must match the number of file ids.");
    }

    for (let i = 0; i < flags["file-id"].length; i++) {
      sourceFiles.push({
        connectorType: flags["connector-type"][i] as connectorType,
        storageFileId: flags["file-id"][i]
      });
    }

    const authInfo = await this.runCommand<authorizationInformation>('auth:info',[]);
    let authType = flags["authentication-type"] as authenticationType;
    if(authType === undefined) {
      authType = authInfo.authorizationType === authorizationType.Service ? authenticationType.SERVICE: authenticationType.USER;
    }

    const response = await client.createStorageConnection({
      authenticationType: authType,
      displayName: flags.name,
      iModelId: flags["imodel-id"],
      sourceFiles,
    });

    return this.logAndReturnResult(response.connection);
  }
}
