/*---------------------------------------------------------------------------------------------
* Copyright (c) Bentley Systems, Incorporated. All rights reserved.
* See LICENSE.md in the project root for license terms and full copyright notice.
*--------------------------------------------------------------------------------------------*/

import { Flags } from "@oclif/core";

import { ApiReference } from "../../../../extensions/api-reference.js";
import BaseCommand from "../../../../extensions/base-command.js";
import { customFlags } from "../../../../extensions/custom-flags.js";

export default class DeleteGroupMember extends BaseCommand {
  public static apiReference: ApiReference = {
    link: "https://developer.bentley.com/apis/access-control-v2/operations/remove-itwin-group-member/",
    name: "Remove iTwin Group Member",
  };

  public static description = 'Remove a group from an iTwin.';

  public static examples = [
    {
      command: `<%= config.bin %> <%= command.id %> --itwin-id ad0ba809-9241-48ad-9eb0-c8038c1a1d51 --group-id group1-id`,
      description: 'Example 1:'
    }
  ];

  public static flags = {
    "group-id": Flags.string({
      char: 'g',
      description: 'The ID of the group to remove from the iTwin.',
      helpValue: '<string>',
      required: true,
    }),
    "itwin-id": customFlags.iTwinIDFlag({
      description: 'The ID of the iTwin where the group is a member.'
    }),
  };
  
  public async run() {
    const { flags } = await this.parse(DeleteGroupMember);
  
    const client = await this.getAccessControlMemberClient();
  
    await client.deleteGroupMember(flags["itwin-id"], flags["group-id"]);
  
    return this.logAndReturnResult({ result: 'deleted' });
  }
}
