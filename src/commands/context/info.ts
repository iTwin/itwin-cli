/*---------------------------------------------------------------------------------------------
* Copyright (c) Bentley Systems, Incorporated. All rights reserved.
* See LICENSE.md in the project root for license terms and full copyright notice.
*--------------------------------------------------------------------------------------------*/

import BaseCommand from "../../extensions/base-command.js";

export default class InfoContext extends BaseCommand {
  public static description = "Display the cached context.";

  public static examples = [
    {
      command: `<%= config.bin %> <%= command.id %>`,
      description: 'Example 1: Display the cached context'
    }
  ];

  public async run() {
    const context = this.getContext();
    return this.logAndReturnResult(context);
  }
}