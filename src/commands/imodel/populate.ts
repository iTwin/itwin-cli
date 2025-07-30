/*---------------------------------------------------------------------------------------------
 * Copyright (c) Bentley Systems, Incorporated. All rights reserved.
 * See LICENSE.md in the project root for license terms and full copyright notice.
 *--------------------------------------------------------------------------------------------*/

import { Flags } from "@oclif/core";

import { ApiReference } from "../../extensions/api-reference.js";
import BaseCommand from "../../extensions/base-command.js";
import { CustomFlags } from "../../extensions/custom-flags.js";
import { AuthorizationType } from "../../services/authorization/authorization-type.js";
import { checkAndGetFilesWithConnectors } from "../../services/synchronization/extension-to-connector-mappings.js";
import { PopulateResponse } from "../../services/synchronization/models/populate-response.js";

export default class PopulateIModel extends BaseCommand {
  public static apiReference: ApiReference = {
    link: "/docs/command-workflows/imodel-populate",
    name: "iModel Populate",
    sectionName: "Workflow Reference",
  };

  public static description = "Synchronize design files into an iModel.";

  public static examples = [
    {
      command: `<%= config.bin %> <%= command.id %> --imodel-id b1a2c3d4-5678-90ab-cdef-1234567890ab --file file1.dwg --connector-type DWG --file file2.dwg --connector-type DWG`,
      description: "Example 1: Synchronizing DWG Files",
    },
    {
      command: `<%= config.bin %> <%= command.id %> --imodel-id c2d3e4f5-6789-01ab-cdef-2345678901bc --file site1.dgn --connector-type CIVIL --file structure2.dgn --connector-type CIVIL`,
      description: "Example 2: Synchronizing DGN Files",
    },
    {
      command: `<%= config.bin %> <%= command.id %> --imodel-id d3e4f5g6-7890-12ab-cdef-3456789012cd --file data1.csv --file data2.csv --file model.ifc`,
      description: "Example 3: Synchronizing CSV and IFC Files",
    },
    {
      command: `<%= config.bin %> <%= command.id %> --imodel-id i9j0k1l2-3456-78ab-cdef-9012345678ij --file model.rvt --file design.dgn`,
      description: "Example 4: Synchronizing Revit and DGN Files",
    },
  ];

  public static flags = {
    "connector-type": Flags.string({
      char: "c",
      description: `Specify connectors to use for synchronization. This option can be provided multiple times. If no connector-type options are provided, they are selected automatically depending on file extensions of provided files. If only one connector is specified, it will be used for all files. If multiple connectors are specified, each connector will be used for the corresponding file in the files list (first connector for the first file, second connector for the second file, and so on).\n NOTE: .dgn and .dwg file types can be associated with multiple connector types. When no 'connector-type' options are provided, connectors for those file types are assigned as follows: .dgn => MSTN, .dwg => DWG `,
      helpValue: "<string>",
      multiple: true,
      options: ["AUTOPLANT", "CIVIL", "CIVIL3D", "DWG", "GEOSPATIAL", "IFC", "MSTN", "NWD", "OBD", "OPENTOWER", "PROSTRUCTURES", "REVIT", "SPPID", "SPXREVIEW"],
      required: false,
      type: "option",
    }),
    file: Flags.file({
      char: "f",
      description: "Specify a list of source files to synchronize into the iModel.",
      helpValue: "<string>",
      multiple: true,
      required: true,
    }),
    "imodel-id": CustomFlags.iModelIDFlag({
      description: "The ID of the iModel to populate.",
    }),
    "no-wait": Flags.boolean({
      description: "Do not wait for the synchronization process to complete.",
      required: false,
    }),
  };

  public async run(): Promise<PopulateResponse> {
    const { flags } = await this.parse(PopulateIModel);

    const iModelService = await this.getIModelService();
    const storageApiService = await this.getStorageApiService();
    const synchronizationApiService = await this.getSynchronizationApiService();

    if (flags["connector-type"] && flags["connector-type"].length !== 1 && flags.file.length !== flags["connector-type"].length) {
      this.error(
        "When multiple connector-type options are provided, their amount must match file option amount. Alternatively, you can provide a single connector-type option, which will then be applied to all file options. You can also provide no connector-type options, in which case the command will attempt automatic detection.",
      );
    }

    const filesAndConnectorToImport = checkAndGetFilesWithConnectors(flags.file, flags["connector-type"]);
    this.log(`Synchronizing files into iModel with ID: ${flags["imodel-id"]}`);
    const iModel = await iModelService.getIModel(flags["imodel-id"]);

    this.log(`Fetching root folder for iTwin: ${iModel.iTwinId}`);
    const rootFolder = await storageApiService.getTopLevelFoldersAndFiles(iModel.iTwinId);
    const rootFolderId = rootFolder?._links?.folder?.href?.split("/").pop();
    if (rootFolderId === undefined) {
      this.error(`Unable to get root folder for iTwin: ${iModel.iTwinId}`);
    }

    const files = await Promise.all(
      filesAndConnectorToImport.map(async (newFileInfo) => storageApiService.createOrUpdateFileInFolder(rootFolder, rootFolderId, newFileInfo)),
    );

    const authInfo = await this.authorizationService.info();
    if (authInfo.authorizationType === AuthorizationType.Interactive) {
      this.log("Authorizing...");
      const connectionAuth = await synchronizationApiService.authorize();
      if (connectionAuth.isUserAuthorized === undefined) {
        this.error("User is not authenticated for connection run");
      }
    }

    const connectionId = await synchronizationApiService.findOrCreateConnection(iModel.id, files, "Default iTwinCLI Connection");
    const runId = await synchronizationApiService.runSynchronization(connectionId, !flags["no-wait"]);

    return {
      iModelId: iModel.id,
      iTwinId: iModel.iTwinId,
      rootFolderId,
      summary: [
        {
          connectionId,
          files,
          runId,
        },
      ],
    };
  }
}
