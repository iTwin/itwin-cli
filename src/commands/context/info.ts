/*---------------------------------------------------------------------------------------------
 * Copyright (c) Bentley Systems, Incorporated. All rights reserved.
 * See LICENSE.md in the project root for license terms and full copyright notice.
 *--------------------------------------------------------------------------------------------*/

import BaseCommand from "../../extensions/base-command.js";
import { UserContext } from "../../services/general-models/user-context.js";

export default class InfoContext extends BaseCommand {
  public static description = "Display the cached context.";

  public static examples = [
    {
      command: `<%= config.bin %> <%= command.id %>`,
      description: "Example 1: Display the cached context",
    },
  ];

  public async run(): Promise<UserContext | undefined> {
    const contextService = this.getContextService();
    const context = contextService.getContext();
    return this.logAndReturnResult(context);
  }
}
