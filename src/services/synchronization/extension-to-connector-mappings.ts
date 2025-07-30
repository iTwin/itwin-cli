/*---------------------------------------------------------------------------------------------
 * Copyright (c) Bentley Systems, Incorporated. All rights reserved.
 * See LICENSE.md in the project root for license terms and full copyright notice.
 *--------------------------------------------------------------------------------------------*/

import fs from "node:fs";
import path from "node:path";

import { ConnectorFileInfo } from "../storage/models/connector-file-info.js";
import { ConnectorType } from "./models/connector-type.js";

const fileExtensionToConnectorType: Record<string, ConnectorType[]> = {
  "3dm": [ConnectorType.MSTN],
  "3ds": [ConnectorType.MSTN],
  dae: [ConnectorType.MSTN],
  dgn: [ConnectorType.MSTN, ConnectorType.CIVIL, ConnectorType.OBD, ConnectorType.PROSTRUCTURES],
  dwg: [ConnectorType.DWG, ConnectorType.AUTOPLANT, ConnectorType.CIVIL3D, ConnectorType.MSTN],
  dxf: [ConnectorType.DWG],
  fbx: [ConnectorType.MSTN],
  geodb: [ConnectorType.GEOSPATIAL],
  geojson: [ConnectorType.GEOSPATIAL],
  hln: [ConnectorType.MSTN],
  "i.dgn": [ConnectorType.MSTN],
  ifc: [ConnectorType.IFC],
  igs: [ConnectorType.MSTN],
  jt: [ConnectorType.MSTN],
  kml: [ConnectorType.GEOSPATIAL],
  "land.xml": [ConnectorType.MSTN],
  nwc: [ConnectorType.NWD],
  nwd: [ConnectorType.NWD],
  obj: [ConnectorType.MSTN],
  otxml: [ConnectorType.OPENTOWER],
  rvt: [ConnectorType.REVIT],
  sat: [ConnectorType.MSTN],
  shp: [ConnectorType.GEOSPATIAL],
  skp: [ConnectorType.MSTN],
  stl: [ConnectorType.MSTN],
  stp: [ConnectorType.MSTN],
  vue: [ConnectorType.SPXREVIEW],
  // eslint-disable-next-line @typescript-eslint/naming-convention
  x_t: [ConnectorType.MSTN],
  zip: [ConnectorType.SPPID],
};

function getConnectorTypeFromFileExtension(extension: string): ConnectorType {
  const found = fileExtensionToConnectorType[extension.toLowerCase()];
  return found[0];
}

export function checkAndGetFilesWithConnectors(files: string[], connectorTypes: string[] | undefined): ConnectorFileInfo[] {
  const resultArray = new Array<ConnectorFileInfo>();

  for (const [index, file] of files.entries()) {
    if (!fs.existsSync(file)) {
      throw new Error(`File at: '${file}' does not exist`);
    }

    let connector;
    if (connectorTypes && connectorTypes.length === 1) {
      connector = ConnectorType[connectorTypes[0] as keyof typeof ConnectorType];
    } else if (connectorTypes && connectorTypes.length === files.length) {
      connector = ConnectorType[connectorTypes[index] as keyof typeof ConnectorType];
    } else if (!connectorTypes) {
      const splitedFile = file.split(".");

      if (splitedFile.length === 1) {
        throw new Error(`${file} has no extension`);
      }

      if (splitedFile.length >= 3) {
        connector = getConnectorTypeFromFileExtension(`${splitedFile.at(-2)}.${splitedFile.at(-1)}`);
      }

      connector ??= getConnectorTypeFromFileExtension(`${splitedFile.at(-1)}`);
    }

    if (!connector) {
      throw new Error(`Unable to get extension from file name: ${file}`);
    }

    resultArray.push({
      connectorType: connector,
      fileName: path.basename(file),
      fullFilePath: file,
    });
  }

  return resultArray;
}
