import BaseCommand from "../../extensions/base-command.js";

export default class InfoContext extends BaseCommand {
    static description = "Display the current context of the session.";

    static examples = [
        {
            command: `<%= config.bin %> <%= command.id %>`,
            description: 'Example 1: Display the current context of the session'
        }
    ];

    async run() {
        const context = this.getContext();
        return this.logAndReturnResult(context);
    }
}