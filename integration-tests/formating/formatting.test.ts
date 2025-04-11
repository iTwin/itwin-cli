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
                    expect(flag, `Flag '${flagName}' in command '${command.cmd.id}' is missing a valid 'helpValue'`).to.have.property('helpValue').to.be.a('string').and.not.be.empty;
                }
            }
        }
    });

    it('Should ensure all itwin-id flags have env properties', async () => {
        for (const command of allCommands) {
            const iTwinIdFlag = command.flags.find(([name, _]) => name === "itwin-id");
            if (iTwinIdFlag) {
                expect(iTwinIdFlag[1].env, `Flag 'itwin-id' in command '${command.cmd.id}' is missing the 'env' property`).to.be.a('string').and.be.equals("ITP_ITWIN_ID");
            }
        }
    });

    it('Should ensure all imodel-id flags have env properties', async () => {
        for (const command of allCommands) {
            const iTwinIdFlag = command.flags.find(([name, _]) => name === "imodel-id");
            if (iTwinIdFlag) {
                expect(iTwinIdFlag[1].env, `Flag 'imodel-id' in command '${command.cmd.id}' is missing the 'env' property`).to.be.a('string').and.be.equals("ITP_IMODEL_ID");
            }
        }
    });
});

type CommandWithFlags = {
    cmd: Command.Loadable;
    flags: [string, Command.Flag.Cached][];
}


