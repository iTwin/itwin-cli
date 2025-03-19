/*---------------------------------------------------------------------------------------------
* Copyright (c) Bentley Systems, Incorporated. All rights reserved.
* See LICENSE.md in the project root for license terms and full copyright notice.
*--------------------------------------------------------------------------------------------*/

import { Extent } from "@itwin/imodels-client-management";
import { Flags } from "@oclif/core";

import BaseCommand from "../../extensions/base-command.js";

export default class UpdateCommand extends BaseCommand {
    static description = 'Update an iModel in an iTwin';
  
    static flags = {
      description: Flags.string({
        description: 'The new description for the iModel.',
        required: false,
      }),
      extent: Flags.string({
        description: 'The new maximum rectangular area on Earth that encloses the iModel, defined by its southwest and northeast corners.',
        required: false,
      }),
      "imodel-id": Flags.string({
        description: 'The ID of the iModel to update.',
        required: true,
      }),
      name: Flags.string({
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
  