import { Command, Config, Flags } from "@oclif/core";
import fs from "node:fs";
import path from "node:path";

import { apiReference } from "../extensions/api-reference.js";
import BaseCommand from "../extensions/base-command.js";

export default class DocsGenerator extends BaseCommand {
    static description = "Generate command and overview markdown files for the CLI.";

    static flags = {
        "output-dir": Flags.string({
            char: "o",
            description: "The output directory for the documentation files.",
            required: false,
        }),
    }

    static hidden = true;

    generateCommandMarkdown(command: Command.Loadable, flags: [string, Command.Flag.Cached][]): string {            
        const options = flags.length > 0
            ? 
                  flags.filter(([_, flag]) => !flag.hidden && flag.helpGroup !== "GLOBAL")
                  .sort(([nameA, flagA], [nameB, flagB]) => {
                      if (flagA.required !== flagB.required) {
                          return flagA.required ? -1 : 1;
                      }

                      return nameA.localeCompare(nameB);
                  })
                  .map(([name, flag]) => {
                      const required = flag.required ? "**Required:** Yes" : "**Required:** No";
                      const multipleProperty = flag.type === "option" && flag.multiple ? "**Multiple:** Yes" : "";
                      let type = "";
                      let validValues = "";
                      if(flag.type === "option") {
                        type = `**Type:** \`${flag.helpValue?.slice(1, -1)}\``;
                        if(Array.isArray(flag.options)) {
                            validValues = `\n  **Valid Values:** \`"${flag.options.join('"`, `"')}"\``;
                        }
                      }
                      else {
                            type = '**Type:** `flag`';
                      }

                      const description = flag.description ?? "";
                      const flagName = flag.char ? `-${flag.char}, --${name}` : `--${name}`;
                      const finalResult = `- **\`${flagName}\`**  \n  ${description}  \n  ${type} ${required} ${multipleProperty} ${validValues}`;
                      return finalResult.trim();
                  })
                  .join("\n\n")
            : "";



        let examplesText = "";

        if (command.examples) {
            for (const example of command.examples) {
                if (typeof example === "string") {
                    examplesText += `\n${example}`;
                }

                if (typeof example === "object") {
                    // Do not display description for examples where only "Example #<number>:" is present
                    examplesText += example.description.slice(0, -2) === "Example " ? `\n${example.command}\n` : `\n# ${example.description}\n${example.command}\n`;
                }
            }
        }

        const commandName = command.id.split(":").join(" ");
        
        examplesText = examplesText.replaceAll("<%= config.bin %>", "itp").replaceAll("<%= command.id %>", commandName).trimEnd();

        const returnContent : string[] = [];

        returnContent.push(`# itp ${commandName}`);
        
        if(command.description) {
            returnContent.push(command.description);
        }

        returnContent.push('## Options');
        
        if(options.length > 1) {
            returnContent.push(options);
        }
        else {
            returnContent.push("(This command does not have any options)");
        }

        returnContent.push('## Examples', 
                           `\`\`\`bash${examplesText}\n\`\`\``);

        if(command.apiReference) {
            if(Array.isArray(command.apiReference)) {
                const apiReferences = command.apiReference as apiReference[]; 
                returnContent.push(`## ${command.apiReference[0].sectionName ?? 'API Reference'}`);
                for (const apiRef of apiReferences) {
                    returnContent.push(`[${apiRef.name}](${apiRef.link})`);
                }
            }
            else {
                const apiReference = command.apiReference as apiReference;
                returnContent.push(`## ${apiReference.sectionName ?? 'API Reference'}`, `[${apiReference.name}](${apiReference.link})`);
            }
        }

        return returnContent.join("\n\n");
    }
    
    async generateDocs(config: Config, basePath: string) {
        const filteredCommands = config.commands.filter(c => !c.id.includes("help") && !c.id.includes("plugins") && !c.hidden);
        if(!filteredCommands) {
            return;
        }

        for (const command of filteredCommands) {
            this.log(`Generating docs for command: ${command.id}`);
            if(command.customDocs) {
                this.log(`Skipping command ${command.id} as it has custom docs`);
                continue;
            }

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
        const {flags} = await this.parse(DocsGenerator);

        const config = await Config.load(
            {
                devPlugins: false,
                root: process.cwd(),
                userPlugins: false,
            }
        );

        this.generateDocs(config, flags["output-dir"] ?? `${config.root}/docs`);
    }
    
    writeToFile(filePath: string, markdown: string) {
        const finalPath = `${filePath}.md`;
        this.log(`Writing to directory: ${finalPath}`);

        const dirName = path.dirname(finalPath);
        if (!fs.existsSync(dirName)) {
            fs.mkdirSync(dirName, {
                recursive: true,
            });
        }
        
        fs.writeFileSync(finalPath, markdown);
    }
}



