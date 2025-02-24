/*---------------------------------------------------------------------------------------------
* Copyright (c) Bentley Systems, Incorporated. All rights reserved.
* See LICENSE.md in the project root for license terms and full copyright notice.
*--------------------------------------------------------------------------------------------*/

import { NamedVersion } from "@itwin/imodels-client-management";

import { Flags } from "@oclif/core";

import BaseCommand from "../../../extensions/base-command.js";

export default class ListNamedVersions extends BaseCommand {
    static description = 'List all named versions for a specific iModel.';
  
    static flags = {
      "imodel-id": Flags.string({
        description: 'The ID of the iModel whose named versions you want to list.',
        required: true,
      }),
    };
  
    async run() {
      const { flags } = await this.parse(ListNamedVersions);
  
      const client = this.getIModelClient();
      const authorization = await this.getAuthorizationCallback();
  
      const namedVersionsList = client.namedVersions.getRepresentationList({
        authorization,
        iModelId: flags["imodel-id"],
      });
      
      const result: NamedVersion[] = [];
      for await (const namedVersion of namedVersionsList) {
        result.push(namedVersion);
      }
  
      return this.logAndReturnResult(result);
    }
  }
  