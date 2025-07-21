/*---------------------------------------------------------------------------------------------
 * Copyright (c) Bentley Systems, Incorporated. All rights reserved.
 * See LICENSE.md in the project root for license terms and full copyright notice.
 *--------------------------------------------------------------------------------------------*/

import { Repository } from "@itwin/itwins-client";
import { Flags } from "@oclif/core";

import { ApiReference } from "../../../extensions/api-reference.js";
import BaseCommand from "../../../extensions/base-command.js";
import { CustomFlags } from "../../../extensions/custom-flags.js";
import { checkIfRepositoryClassMatchSubclass } from "../../../extensions/validation/itwin-repository-classes.js";

export default class ListRepositories extends BaseCommand {
  public static apiReference: ApiReference = {
    link: "https://developer.bentley.com/apis/itwins/operations/get-repositories-by-itwin-id/",
    name: "List Repositories",
  };

  public static description = "Retrieve a list of repositories for a specified iTwin.";

  public static examples = [
    {
      command: `<%= config.bin %> <%= command.id %> --itwin-id ad0ba809-9241-48ad-9eb0-c8038c1a1d51`,
      description: "Example 1: Listing all repositories for an iTwin",
    },
    {
      command: `<%= config.bin %> <%= command.id %> --itwin-id ad0ba809-9241-48ad-9eb0-c8038c1a1d51 --class iModels`,
      description: "Example 2: Filtering repositories by class",
    },
    {
      command: `<%= config.bin %> <%= command.id %> --itwin-id ad0ba809-9241-48ad-9eb0-c8038c1a1d51 --class GeographicInformationSystem --sub-class WebMapTileService`,
      description: "Example 3: Filtering repositories by class and subClass",
    },
  ];

  public static flags = {
    class: Flags.string({
      description: "Specify a particular class of repositories to retrieve.",
      helpValue: "<string>",
      options: ["iModels", "RealityData", "Storage", "Forms", "Issues", "SensorData", "GeographicInformationSystem", "Construction", "Subsurface"],
      required: false,
    }),
    "itwin-id": CustomFlags.iTwinIDFlag({
      description: "The ID of the iTwin whose repositories should be retrieved.",
    }),
    "sub-class": Flags.string({
      description:
        "Specify a subClass of repositories. 'WebMapService', 'WebMapTileService' and 'MapServer' subclasses are only applicable to 'GeographicInformationSystem' class. 'Performance' subclass is only applicable to 'Construction' class. 'EvoWorkspace' subclass is only applicable to 'Subsurface' class.",
      helpValue: "<string>",
      options: ["WebMapService", "WebMapTileService", "MapServer", "Performance", "EvoWorkspace"],
      required: false,
    }),
  };

  public async run(): Promise<Repository[] | undefined> {
    const { flags } = await this.parse(ListRepositories);

    if (flags.class !== undefined && flags["sub-class"] !== undefined) {
      const error = checkIfRepositoryClassMatchSubclass(flags.class, flags["sub-class"]);
      if (error !== "") {
        this.error(error);
      }
    }

    const client = this.getITwinAccessClient();
    const accessToken = await this.getAccessToken();

    const response = await client.queryRepositoriesAsync(accessToken, flags["itwin-id"], {
      class: flags.class,
      subClass: flags["sub-class"],
    });

    if (response.error) {
      this.error(JSON.stringify(response.error, null, 2));
    }

    return this.logAndReturnResult(response.data);
  }
}
