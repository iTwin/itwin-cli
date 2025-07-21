/*---------------------------------------------------------------------------------------------
 * Copyright (c) Bentley Systems, Incorporated. All rights reserved.
 * See LICENSE.md in the project root for license terms and full copyright notice.
 *--------------------------------------------------------------------------------------------*/

export function checkIfRepositoryClassMatchSubclass(repositoryClass: string, repositorySubclass?: string): string {
  switch (repositoryClass) {
    case "GeographicInformationSystem":
      if (repositorySubclass !== undefined && !["WebMapService", "WebMapTileService", "MapServer"].includes(repositorySubclass)) {
        return "'GeographicInformationSystem' class may only have one of the following subClasses: ['WebMapService', 'WebMapTileService', 'MapServer'].";
      }
      break;
    case "Construction":
      if (repositorySubclass !== undefined && !["Performance"].includes(repositorySubclass)) {
        return "'Construction' class may only have one of the following subClasses: ['Performance'].";
      }
      break;
    case "Subsurface":
      if (repositorySubclass !== undefined && !["EvoWorkspace"].includes(repositorySubclass)) {
        return "'Subsurface' class may only have one of the following subClasses: ['EvoWorkspace'].";
      }
      break;
    default:
      if (repositorySubclass !== undefined) {
        return `'${repositoryClass}' class must not have a subClass.`;
      }
  }
  return "";
}
