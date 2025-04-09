import { Flags } from "@oclif/core";

import BaseCommand from "../../extensions/base-command.js";

export default class SetContext extends BaseCommand {
    static description = "Create a new context for the current session.";

    static examples = [
        {
            command: `<%= config.bin %> <%= command.id %>`,
            description: 'Example 1: Create a new context for the current session'
        }
    ];

    static flags = {
        "imodel-id": Flags.string({
            char: 'm',
            description: "The ID of the iModel to create a context for.",
            helpValue: '<string>',
            required: false
        }),
        "itwin-id": Flags.string({
            char: 'i',
            description: "The ID of the iTwin to create a context for.",
            helpValue: '<string>',
            required: false,
        }),
    };

    async run() {
        const { flags } = await this.parse(SetContext);
        if (!flags["itwin-id"] && !flags["imodel-id"]) {
            this.error("Either --itwin-id or --imodel-id must be provided.");
        }

        const context = await this.setContext(flags["itwin-id"], flags["imodel-id"]);
        return this.logAndReturnResult(context);
    }
}