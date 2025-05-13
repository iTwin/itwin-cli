/*---------------------------------------------------------------------------------------------
* Copyright (c) Bentley Systems, Incorporated. All rights reserved.
* See LICENSE.md in the project root for license terms and full copyright notice.
*--------------------------------------------------------------------------------------------*/

import BaseCommand from "../../extensions/base-command.js";

export default class InfoContext extends BaseCommand {
    static description = "Display the cached context.";

    static examples = [
        {
            command: `<%= config.bin %> <%= command.id %>`,
            description: 'Example 1: Display the cached context'
        }
    ];

    async run() {
        const context = this.getContext();
        return this.logAndReturnResult(context);
    }
}