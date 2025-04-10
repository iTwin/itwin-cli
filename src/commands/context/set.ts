import { IModel } from "@itwin/imodels-client-management";
import { ITwin } from "@itwin/itwins-client";
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
        const iModelId = flags["imodel-id"];
        let iTwinId = flags["itwin-id"];
        
        // If iModelId is provided, check if it exists
        // and verify that it belongs to the specified iTwinId
        if(iModelId) {
            const iModel = await this.runCommand<IModel>("imodel:info", ["--imodel-id", iModelId]); 
            if(iTwinId && iModel.iTwinId !== flags["itwin-id"]) {
                this.error(`The iModel ID ${iModelId} does not belong to the specified iTwin ID ${iTwinId}.`);
            }

            iTwinId = iModel.iTwinId;
        }
        // If iTwinId is provided, check if it exists
        else if (iTwinId) {
            await this.runCommand<ITwin>("itwin:info", ["--itwin-id", iTwinId]);
        }
        // If neither iModelId nor iTwinId is provided, throw an error
        else {
            this.error("Either --itwin-id or --imodel-id must be provided.");
        } 

        const context = await this.setContext(iTwinId, iModelId);
        return this.logAndReturnResult(context);
    }
}