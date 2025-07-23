/*---------------------------------------------------------------------------------------------
 * Copyright (c) Bentley Systems, Incorporated. All rights reserved.
 * See LICENSE.md in the project root for license terms and full copyright notice.
 *--------------------------------------------------------------------------------------------*/

import { IModel } from "@itwin/imodels-client-management";
import { ITwin } from "@itwin/itwins-client";

import BaseCommand from "../../extensions/base-command.js";
import { CustomFlags } from "../../extensions/custom-flags.js";
import { UserContext } from "../../services/general-models/user-context.js";

export default class SetContext extends BaseCommand {
  public static description =
    "Set a new cached context. This works by saving iModel and/or iTwin IDs to a file in CLI cache directory.\nNOTE: CLI cache directory can usually be found at: `%LOCALAPPDATA%/itp` on windows, `~/.cache/itp` on UNIX and `~/Library/Caches/itp` on macOS.\nNOTE2: CLI cache directory can be overriden by setting `XDG_CACHE_HOME` environment variable, which is useful in case there is a need to use context in multiple concurrent workflows.";

  public static examples = [
    {
      command: `<%= config.bin %> <%= command.id %> --itwin-id 12345`,
      description: "Example 1: Set a new cached context using an iTwin ID",
    },
    {
      command: `<%= config.bin %> <%= command.id %> --imodel-id 67890`,
      description: "Example 2: Set a new cached context using an iModel ID",
    },
    {
      command: `<%= config.bin %> <%= command.id %>`,
      description: "Example 3: Error when neither --itwin-id nor --imodel-id is provided",
    },
  ];

  public static flags = {
    "imodel-id": CustomFlags.uuid({
      atLeastOne: ["imodel-id", "itwin-id"],
      char: "m",
      description: "The ID of the iModel to create a context for.",
      helpValue: "<string>",
      required: false,
    }),
    "itwin-id": CustomFlags.uuid({
      char: "i",
      description: "The ID of the iTwin to create a context for.",
      helpValue: "<string>",
      required: false,
    }),
  };

  public async run(): Promise<UserContext> {
    const { flags } = await this.parseWithoutContext(SetContext);

    const iModelId = flags["imodel-id"];
    let iTwinId = flags["itwin-id"];

    // If iModelId is provided, check if it exists
    // and verify that it belongs to the specified iTwinId
    if (iModelId) {
      const iModelApiService = await this.getIModelService();
      const iModel = await iModelApiService.getIModel(iModelId);
      if (iTwinId && iModel.iTwinId !== flags["itwin-id"]) {
        this.error(`The iModel ID ${iModelId} does not belong to the specified iTwin ID ${iTwinId}.`);
      }

      iTwinId = iModel.iTwinId;
    }
    // If iTwinId is provided, check if it exists
    else if (iTwinId) {
      await this.runCommand<ITwin>("itwin:info", ["--itwin-id", iTwinId]);
    }

    const contextService = this.getContextService();
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    const context = await contextService.setContext(iTwinId!, iModelId);

    return this.logAndReturnResult(context);
  }
}
