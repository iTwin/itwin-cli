/*---------------------------------------------------------------------------------------------
* Copyright (c) Bentley Systems, Incorporated. All rights reserved.
* See LICENSE.md in the project root for license terms and full copyright notice.
*--------------------------------------------------------------------------------------------*/

import { Flags } from "@oclif/core";

import BaseCommand from "../../../extensions/base-command.js";

export default class AccessControlMemberInvitations extends BaseCommand {
    static description = "Retrieve the list of pending invitations for an iTwin's members.";
  
    static flags = {
      "itwin-id": Flags.string({
        char: 'i',
        description: "The ID of the iTwin whose member invitations you want to retrieve.",
        required: true,
      }),
    };
  
    async run() {
      const { flags } = await this.parse(AccessControlMemberInvitations);
  
      const client = await this.getAccessControlMemberClient();
  
      const response = await client.getMemberInvitations(flags["itwin-id"]);
  
      return this.logAndReturnResult(response.invitations);
    }
  }
  