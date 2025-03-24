/*---------------------------------------------------------------------------------------------
* Copyright (c) Bentley Systems, Incorporated. All rights reserved.
* See LICENSE.md in the project root for license terms and full copyright notice.
*--------------------------------------------------------------------------------------------*/

import { Flags } from "@oclif/core";

import BaseCommand from "../../extensions/base-command.js";

export class IModelInfo extends BaseCommand {
  static description = 'Retrieve metadata for the specified Model';

  static flags = {
    "imodel-id": Flags.string({
      char: 'm', 
      description: 'The ID of the iModel to retrieve information for.', 
      required: true 
    }),
  };

  async run() {
    const { flags } = await this.parse(IModelInfo);
    
    const iModelClient = this.getIModelClient();

    const iModel = await iModelClient.iModels.getSingle({
        authorization: await this.getAuthorizationCallback(),
        iModelId: flags["imodel-id"]
    })

    return this.logAndReturnResult(iModel);
  }
}
