/*---------------------------------------------------------------------------------------------
* Copyright (c) Bentley Systems, Incorporated. All rights reserved.
* See LICENSE.md in the project root for license terms and full copyright notice.
*--------------------------------------------------------------------------------------------*/

import { IModel } from "@itwin/imodels-client-management";
import { ITwin } from "@itwin/itwins-client";
import { Flags } from "@oclif/core";

import BaseCommand from "../../extensions/base-command.js";

export default class SetContext extends BaseCommand {
    static description = "Set a new cached context.";

    static examples = [
        {
            command: `<%= config.bin %> <%= command.id %> --itwin-id 12345`,
            description: 'Example 1: Set a new cached context using an iTwin ID'
        },
        {
            command: `<%= config.bin %> <%= command.id %> --imodel-id 67890`,
            description: 'Example 2: Set a new cached context using an iModel ID'
        },
        {
            command: `<%= config.bin %> <%= command.id %>`,
            description: 'Example 3: Error when neither --itwin-id nor --imodel-id is provided'
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