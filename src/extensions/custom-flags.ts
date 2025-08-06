/*---------------------------------------------------------------------------------------------
 * Copyright (c) Bentley Systems, Incorporated. All rights reserved.
 * See LICENSE.md in the project root for license terms and full copyright notice.
 *--------------------------------------------------------------------------------------------*/

import { CustomOptions, OptionFlag } from "@oclif/core/interfaces";

import email from "./custom-flags/email.js";
import extent from "./custom-flags/extent.js";
import float from "./custom-flags/float.js";
import groupMemberRoles from "./custom-flags/group-member-roles.js";
import noSchemaJson from "./custom-flags/no-schema-json.js";
import userMemberRoles from "./custom-flags/user-member-roles.js";
import uuid from "./custom-flags/uuid.js";
import uuidCsv from "./custom-flags/uuidCsv.js";

// eslint-disable-next-line @typescript-eslint/naming-convention
export const CustomFlags = {
  email,
  extent,
  float,
  groupMemberRoles,
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
  userMemberRoles,
  uuid,
  uuidCsv,
};

export interface CustomFlagConfig {
  description: string;
}
