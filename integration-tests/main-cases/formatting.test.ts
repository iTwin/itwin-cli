/*---------------------------------------------------------------------------------------------
 * Copyright (c) Bentley Systems, Incorporated. All rights reserved.
 * See LICENSE.md in the project root for license terms and full copyright notice.
 *--------------------------------------------------------------------------------------------*/

import { Command, Config } from "@oclif/core";
import { expect } from "chai";

describe("Command formatting tests", async () => {
  let allCommands: CommandWithFlags[] = [];

  const commandToExcludeFromTests = ["help", "plugins"];

  before(async () => {
    const config = await Config.load({
      devPlugins: false,
      root: process.cwd(),
      userPlugins: false,
    });

    allCommands = config.commands
      .filter((command) => !commandToExcludeFromTests.some((excluded) => command.id.startsWith(excluded)) && !command.hidden)
      .map((command) => ({
        cmd: command,
        flags: Object.entries(command.flags),
      }));
  });

  it("Should ensure all commands have a description", async () => {
    for (const command of allCommands) {
      expect(command.cmd.description, `Command '${command.cmd.id}' is missing a description`).to.be.a("string").and.not.be.empty;
    }
  });

  it("Should ensure all flags have required properties", async () => {
    for (const command of allCommands) {
      for (const [flagName, flag] of command.flags) {
        expect(flag.description, `Flag '${flagName}' in command '${command.cmd.id}' is missing a description`).to.be.a("string").and.not.be
          .empty;

        if (flag.type === "option") {
          expect(flag, `Flag '${flagName}' in command '${command.cmd.id}' is missing a valid 'helpValue'`)
            .to.have.property("helpValue")
            .to.be.a("string").and.not.be.empty;
        }
      }
    }
  });

  it("Should ensure all itwin-id flags have env properties", async () => {
    // Exclude context:set command from this test as it has a special case for itwin-id flag
    for (const command of allCommands.filter((cmd) => cmd.cmd.id !== "context:set")) {
      const iTwinIdFlag = command.flags.find(([name, _]) => name === "itwin-id");
      if (iTwinIdFlag) {
        expect(iTwinIdFlag[1].env, `Flag 'itwin-id' in command '${command.cmd.id}' is missing the 'env' property`)
          .to.be.a("string")
          .and.be.equals("ITP_ITWIN_ID");
      }
    }
  });

  it("Should ensure all imodel-id flags have env properties", async () => {
    // Exclude context:set command from this test as it has a special case for imodel-id flag
    for (const command of allCommands.filter((cmd) => cmd.cmd.id !== "context:set")) {
      const iTwinIdFlag = command.flags.find(([name, _]) => name === "imodel-id");
      if (iTwinIdFlag) {
        expect(iTwinIdFlag[1].env, `Flag 'imodel-id' in command '${command.cmd.id}' is missing the 'env' property`)
          .to.be.a("string")
          .and.be.equals("ITP_IMODEL_ID");
      }
    }
  });
});

interface CommandWithFlags {
  cmd: Command.Loadable;
  flags: [string, Command.Flag.Cached][];
}
