import { Command, Config, Flags } from "@oclif/core";
import fs from "node:fs";
import path from "node:path";

import BaseCommand from "../extensions/base-command.js";

export default class ReadmeGenerator extends BaseCommand {
    static description = "Generate a README.md file for the project.";

    static flags = {
        "output-dir": Flags.string({
            char: "o",
            description: "The output directory for the documentation files.",

        }),
    }

    static hidden = true;

    generateCommandMarkdown(command: Command.Loadable, flags: [string, Command.Flag.Cached][]): string {            
        const options = flags.length > 0
            ? 
                  flags.filter(([_, flag]) => !flag.hidden && flag.helpGroup !== "GLOBAL")
                  .sort(([_, flag]) => (flag.required ? -1 : 1))
                  .map(([name, flag]) => {
                      const required = flag.required ? "**Required:** Yes" : "**Required:** No";
                      const typeValue = flag.type === "option" ? flag.helpValue ?? "" : "<flag>";
                      const type = `**Type:** \`${typeValue}\``;
                      const description = flag.description ?? "";
                      const flagName = flag.char ? `-${flag.char}, --${name}` : `--${name}`;
                      return `- **\`${flagName}\`**  \n  ${description}  \n  ${type} ${required}`;
                  })
                  .join("\n\n")
            : "";



        let examplesText = "";

        if (command.examples){
            for (const example of command.examples) {
                if (typeof example === "string") {
                    examplesText += `\n${example}`;
                }
                
                if(typeof example === "object") {
                    examplesText += `\n# ${example.description}\n${example.command}\n`;
                }
            }
        }

        const commandName = command.id.split(":").join(" ");
        
        examplesText = examplesText.replaceAll("<%= config.bin %>", "itp").replaceAll("<%= command.id %>", commandName).trimEnd();

        const apiReference = command.apiReference as string;
        const apiReferenceName = command.apiReferenceName as string;

        return `# itp ${commandName}\n\n${command.description || ""}\n\n## Options\n\n${options}\n\n## Examples\n\n\`\`\`bash${examplesText}\n\`\`\`\n\n## API Reference\n\n[${apiReferenceName}](${apiReference})`;
    }
    
    async generateReadme(config: Config, basePath: string) {
        const filteredCommands = config.commands.filter(c => !c.id.includes("help") && !c.id.includes("plugins") && !c.hidden);
        if(!filteredCommands) {
            return;
        }

        for (const command of filteredCommands) {
            const markdown: string = this.generateCommandMarkdown(command, Object.entries(command.flags));
            
            const commandDepth = command.id.split(":");
            let filePath = basePath;
            for (const depth of commandDepth) {
                filePath = `${filePath}/${depth}`;
            }
            
            this.writeToFile(filePath, markdown);            
        }        
    }

    async run() {
        const {flags} = await this.parse(ReadmeGenerator);

        const config = await Config.load(
            {
                devPlugins: false,
                root: process.cwd(),
                userPlugins: false,
            }
        );

        this.generateReadme(config, flags["output-dir"] ?? `${config.root}/docs`);
    }
    
    writeToFile(filePath: string, markdown: string) {
        const finalPath = `${filePath}.md`;
        console.log(`Writing to file: ${finalPath}`);
        console.log(markdown);

        const dirName = path.dirname(finalPath);
        if (!fs.existsSync(dirName)) {
            fs.mkdirSync(dirName, {
                recursive: true,
            });
        }
        
        fs.writeFileSync(finalPath, markdown);
    }
}



