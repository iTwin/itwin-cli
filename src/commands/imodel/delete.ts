/*---------------------------------------------------------------------------------------------
* Copyright (c) Bentley Systems, Incorporated. All rights reserved.
* See LICENSE.md in the project root for license terms and full copyright notice.
*--------------------------------------------------------------------------------------------*/

import { Flags } from "@oclif/core";

import BaseCommand from "../../extensions/base-command.js";

export default class DeleteIModel extends BaseCommand {
    static description = 'Delete an existing iModel.';
  
    static flags = {
      id: Flags.string({
        description: 'The ID of the iModel to delete.',
        required: true,
      }),
    };
  
    async run() {
      const { flags } = await this.parse(DeleteIModel);
  
      const {id} = flags;
  
      const client = this.getIModelClient();
      const authorization = await this.getAuthorizationCallback();
  
      await client.iModels.delete({
        authorization,
        iModelId: id,
      });
  
      return this.logAndReturnResult({ result: 'deleted' });
    }
  }
  