import BaseCommand from "../../extensions/base-command.js";

export default class ClearContext extends BaseCommand {
    static description = "Clear the context of the current session.";
  
    static examples = [
        {            
            command: `<%= config.bin %> <%= command.id %>`,
            description: 'Example 1: Clear the context of the current session'
        }
    ];
  
    async run() {
        this.clearContext();      
        return this.logAndReturnResult({ result: "Context cleared." });
    }
  }