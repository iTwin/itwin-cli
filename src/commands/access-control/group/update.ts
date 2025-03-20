/*---------------------------------------------------------------------------------------------
* Copyright (c) Bentley Systems, Incorporated. All rights reserved.
* See LICENSE.md in the project root for license terms and full copyright notice.
*--------------------------------------------------------------------------------------------*/

import { Flags } from "@oclif/core";

import BaseCommand from "../../../extensions/base-command.js";

export default class UpdateAccessControlGroup extends BaseCommand {
    static description = 'Update the details of an existing group in an iTwin.';
  
    static flags = {
      description: Flags.string({
        char: 'd',
        description: 'The updated description of the group.',
        required: false,
      }),
      "group-id": Flags.string({
        char: 'g',
        description: 'The ID of the group to be updated.',
        required: true,
      }),
      "ims-groups": Flags.string({
        description: 'A list of IMS Groups to be linked to the group.',
        multiple: true,
        required: false,
      }),
      "itwin-id": Flags.string({
        char: 'i',
        description: 'The ID of the iTwin where the group exists.',
        required: true,
      }),
      members: Flags.string({
        description: 'A list of members (emails) to be assigned to the group.',
        multiple: true,
        required: false,
      }),
      name: Flags.string({
        char: 'n',
        description: 'The updated name of the group.',
        required: false,
      }),
    };
  
    async run() {
      const { flags } = await this.parse(UpdateAccessControlGroup);
  
      const client = await this.getAccessControlApiClient();
  
      const response = await client.updateGroup(flags["itwin-id"], flags["group-id"], {
        description: flags.description,
        imsGroups: flags["ims-groups"],
        members: flags.members,
        name: flags.name,
      });
  
      return this.logAndReturnResult(response.group);
    }
  }
  