/*---------------------------------------------------------------------------------------------
 * Copyright (c) Bentley Systems, Incorporated. All rights reserved.
 * See LICENSE.md in the project root for license terms and full copyright notice.
 *--------------------------------------------------------------------------------------------*/

import BaseCommand from "../../extensions/base-command.js";
import { ResultResponse } from "../../services/general-models/result-response.js";

export default class ClearContext extends BaseCommand {
  public static description = "Clear the cached context.";

  public static examples = [
    {
      command: `<%= config.bin %> <%= command.id %>`,
      description: "Example 1: Clear the cached context",
    },
  ];

  public async run(): Promise<ResultResponse> {
    const contextService = this.getContextService();
    await contextService.clearContext();
    return this.logAndReturnResult({ result: "Context cleared." });
  }
}
