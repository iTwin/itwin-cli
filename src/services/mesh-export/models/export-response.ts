/*---------------------------------------------------------------------------------------------
 * Copyright (c) Bentley Systems, Incorporated. All rights reserved.
 * See LICENSE.md in the project root for license terms and full copyright notice.
 *--------------------------------------------------------------------------------------------*/

import { Links } from "../../general-models/links.js";
import { ExportInfo } from "./export-info.js";

export interface ExportResponse {
  // eslint-disable-next-line @typescript-eslint/naming-convention
  _links: Links;
  exports: ExportInfo[];
}
