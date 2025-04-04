/*---------------------------------------------------------------------------------------------
* Copyright (c) Bentley Systems, Incorporated. All rights reserved.
* See LICENSE.md in the project root for license terms and full copyright notice.
*--------------------------------------------------------------------------------------------*/

import { Flags } from "@oclif/core";

import BaseCommand from "../../extensions/base-command.js";
import { Query } from "../../services/iTwin-api-client.js";

export default class ApiRequest extends BaseCommand {
    static description = "Make direct HTTP requests to any iTwin Platform API endpoint. Useful for custom operations or accessing APIs without dedicated commands.";
  
    static flags = {
        body: Flags.string({
            description: "The body to include in the request. It must be serialized JSON.",
            helpValue: '<string>',
        }),
        "empty-response": Flags.boolean({
            description: "Indicates the request will not return a response body."
        }),
        header: Flags.string({
            description: "Headers to include in the request. Use the format 'HeaderName: value'.",
            flag: "h",
            helpValue: '<string>',
            multiple: true,
        }),
        method: Flags.string({
            description: "HTTP method for the request.",
            helpValue: '<string>',
            options: ["GET", "POST", "PUT", "DELETE", "PATCH"],
            required: true,
        }),
        path: Flags.string({
            description: "API endpoint path to send the request to.",
            helpValue: '<string>',
            required: true,
        }),
        query: Flags.string({
            description: "Query parameters to include in the request. Use the format 'QueryKey:value'.",
            helpValue: '<string>',
            multiple: true,
        }),
        "version-header": Flags.string({
            description: "API version header for versioned endpoints.",
            helpValue: '<string>',
        }),
    };
  
    async run() {
        const { flags } = await this.parse(ApiRequest);
  
        const mappedHeaders: Record<string, string> = flags.header?.reduce((acc, header) => {
            const [key, value] = header.split(":");
            acc[key] = value.trim();
            return acc;
        }, {} as Record<string, string>) || {};

        const query: Query[] | undefined = flags.query?.map((query) => {
            const [key, value] = query.split(":");
            return { key: key.trim(), value: value.trim() };
        }) || undefined;

        const client = await this.getITwinApiClient();

        const requestOptions = {
            apiPath: flags.path,
            apiVersionHeader: flags["version-header"],
            body: flags.body ? JSON.parse(flags.body) : undefined,
            headers: mappedHeaders,
            method: flags.method as "DELETE" | "GET" | "PATCH" | "POST" | "PUT",
            query
        };

        if (flags["empty-response"]) {
            await client.sendRequestNoResponse(requestOptions);
            return this.logAndReturnResult({result: "success"});
        }

        const response = await client.sendRequest<unknown>(requestOptions);
        return this.logAndReturnResult(response);
    }
  }
  