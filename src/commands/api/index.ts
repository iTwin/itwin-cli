/*---------------------------------------------------------------------------------------------
 * Copyright (c) Bentley Systems, Incorporated. All rights reserved.
 * See LICENSE.md in the project root for license terms and full copyright notice.
 *--------------------------------------------------------------------------------------------*/

import { Command, Flags } from "@oclif/core";

import { ApiReference } from "../../extensions/api-reference.js";
import BaseCommand from "../../extensions/base-command.js";
import { CustomFlags } from "../../extensions/custom-flags.js";
import { Query } from "../../services/iTwin-platform-api-client.js";

export default class ApiRequest extends BaseCommand {
  public static apiReference: ApiReference = {
    link: "https://developer.bentley.com/apis/",
    name: "ITwin Platform APIs docs",
    sectionName: "APIs Docs Reference",
  };

  public static description =
    "Make direct HTTP requests to any iTwin Platform API endpoint. Useful for custom operations or accessing APIs without dedicated commands.";

  public static examples: Command.Example[] = [
    {
      command: "itp api --method GET --path users/me",
      description: "Example 1: Sending a GET request",
    },
    {
      command: 'itp api --method GET --path itwins/favorite --query subClass:Account --query "$top:10" --header "Prefer: return=minimal"',
      description: "Example 2: Sending a request with headers and query parameters",
    },
    {
      command: "itp api --method DELETE --path itwins/favorites/dc914a84-e0c9-40e2-9d14-faf5ed84147f --empty-response",
      description: "Example 3: Sending a delete request without response body",
    },
    {
      command: 'itp api --method POST --path itwins/exports --body \'{"outputFormat": "JsonGZip"}\'',
      description: "Example 4: Sending a post request",
    },
    {
      // eslint-disable-next-line no-useless-escape
      command: 'itp api --method POST --path users/getbyidlist --body "[\\`\"b644de17-f07e-4b43-8c33-ad2b1bacee3b\\`\"]"',
      description: "Example 5: Sending a post request (Windows PowerShell)",
    },
  ];

  public static flags = {
    body: CustomFlags.noSchemaJson({
      description: "The body to include in the request. It must be serialized JSON.",
      helpValue: "<string>",
    }),
    "empty-response": Flags.boolean({
      description: "Indicates the request will not return a response body.",
    }),
    header: Flags.string({
      description: "Headers to include in the request. Use the format 'HeaderName: value'.",
      flag: "h",
      helpValue: "<string>",
      multiple: true,
    }),
    method: Flags.string({
      description: "HTTP method for the request.",
      helpValue: "<string>",
      options: ["GET", "POST", "PUT", "DELETE", "PATCH"],
      required: true,
    }),
    path: Flags.string({
      description: "API endpoint path to send the request to.",
      helpValue: "<string>",
      required: true,
    }),
    query: Flags.string({
      description: "URL query parameters for the request. Use format 'QueryKey:value'.",
      helpValue: "<string>",
      multiple: true,
    }),
    "version-header": Flags.string({
      description: "API version header for versioned endpoints.",
      helpValue: "<string>",
    }),
  };

  public async run(): Promise<unknown> {
    const { flags } = await this.parse(ApiRequest);

    const mappedHeaders: Record<string, string> =
      flags.header?.reduce(
        (acc, header) => {
          const [key, value] = header.split(":");
          acc[key] = value.trim();
          return acc;
        },
        {} as Record<string, string>,
      ) || {};

    const queries: Query[] | undefined =
      flags.query?.map((query) => {
        const indexOfColon = query.indexOf(":");
        if (indexOfColon === -1) {
          this.error(`Invalid query format: ${query}. Expected format is 'key:value'.`);
        }

        // Split the query string into key and value
        const key = query.slice(0, indexOfColon).trim();
        const value = query.slice(indexOfColon + 1).trim();

        return { key, value };
      }) || undefined;

    const client = await this.getITwinPlatformApiClient();

    const requestOptions = {
      apiPath: flags.path,
      apiVersionHeader: flags["version-header"],
      body: flags.body,
      headers: mappedHeaders,
      method: flags.method as "DELETE" | "GET" | "PATCH" | "POST" | "PUT",
      query: queries,
    };

    if (flags["empty-response"]) {
      await client.sendRequestNoResponse(requestOptions);
      return this.logAndReturnResult({ result: "success" });
    }

    const response = await client.sendRequest<unknown>(requestOptions);
    return this.logAndReturnResult(response);
  }
}
