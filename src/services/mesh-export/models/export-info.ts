/*---------------------------------------------------------------------------------------------
 * Copyright (c) Bentley Systems, Incorporated. All rights reserved.
 * See LICENSE.md in the project root for license terms and full copyright notice.
 *--------------------------------------------------------------------------------------------*/

import { Link } from "../../general-models/links.js";
import { ExportRequest } from "./export-request.js";

export interface ExportInfo {
  // eslint-disable-next-line @typescript-eslint/naming-convention
  _links: {
    mesh: Link;
  };
  displayName: string;
  error?: string;
  id: string;
  lastModified: Date;
  request: ExportRequest;
  status: "Complete" | "InProgress" | "Invalid" | "NotStarted";
}
