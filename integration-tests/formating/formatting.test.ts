import { Command, Config } from "@oclif/core";
import { expect } from "chai";

describe('Command formatting tests', async () => {
    let allCommands : CommandWithFlags[] = [];

    before(async () => {
        const config = await Config.load({
            devPlugins: false,
            root: process.cwd(),
            userPlugins: false,
        });

        allCommands = config.commands.filter(command => !command.id.startsWith("plugins") && !command.id.startsWith("help") && !command.hidden)
                                     .map((command) => 
                                     ({
                                         cmd: command,
                                         flags: Object.entries(command.flags),
                                     }));
    });

    it('Should ensure all commands have a description', async () => {
        for (const command of allCommands) {
            expect(command.cmd.description, `Command '${command.cmd.id}' is missing a description`).to.be.a('string').and.not.be.empty;
        }
    });

    it('Should ensure all flags have required properties', async () => {
        for (const command of allCommands) {
            for (const [flagName, flag] of command.flags) {
                expect(flag.description, `Flag '${flagName}' in command '${command.cmd.id}' is missing a description`).to.be.a('string').and.not.be.empty;
                expect(flag, `Flag '${flagName}' in command '${command.cmd.id}' is missing the 'required' property`).to.have.property('required');
                
                if(flag.type === 'option') {
                    console.log(flag);
                    expect(flag, `Flag '${flagName}' in command '${command.cmd.id}' is missing a valid 'helpValue'`).to.have.property('helpValue').to.be.a('string').and.not.be.empty;
                }
            }
        }
    });
});

type CommandWithFlags = {
    cmd: Command.Loadable;
    flags: [string, Command.Flag.Cached][];
}


