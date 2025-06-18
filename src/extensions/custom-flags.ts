/*---------------------------------------------------------------------------------------------
 * Copyright (c) Bentley Systems, Incorporated. All rights reserved.
 * See LICENSE.md in the project root for license terms and full copyright notice.
 *--------------------------------------------------------------------------------------------*/

import { CustomOptions, OptionFlag } from "@oclif/core/interfaces";

import extent from "./custom-flags/extent.js";
import groupMembers from "./custom-flags/group-member-array.js";
import noSchemaJson from "./custom-flags/no-schema-json.js";
import userMembers from "./custom-flags/user-member-array.js";
import uuid from "./custom-flags/uuid.js";

// eslint-disable-next-line @typescript-eslint/naming-convention
export const CustomFlags = {
  extent,
  groupMembers,
  iModelIDFlag: (config: CustomFlagConfig): OptionFlag<string, CustomOptions> =>
    uuid({
      char: "m",
      description: config.description,
      env: "ITP_IMODEL_ID",
      helpValue: "<string>",
      required: true,
    }),
  iTwinIDFlag: (config: CustomFlagConfig): OptionFlag<string, CustomOptions> =>
    uuid({
      char: "i",
      description: config.description,
      env: "ITP_ITWIN_ID",
      helpValue: "<string>",
      required: true,
    }),
  noSchemaJson,
  userMembers,
  uuid,
};

export interface CustomFlagConfig {
  description: string;
}
