import BaseCommand from "../../extensions/base-command.js";

export default class ClearContext extends BaseCommand {
    static description = "Clear the cached context.";

    static examples = [
        {            
            command: `<%= config.bin %> <%= command.id %>`,
            description: 'Example 1: Clear the cached context'
        }
    ];
  
    async run() {
        this.clearContext();      
        return this.logAndReturnResult({ result: "Context cleared." });
    }
}