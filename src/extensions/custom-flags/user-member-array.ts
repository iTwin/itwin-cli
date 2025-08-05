/*---------------------------------------------------------------------------------------------
 * Copyright (c) Bentley Systems, Incorporated. All rights reserved.
 * See LICENSE.md in the project root for license terms and full copyright notice.
 *--------------------------------------------------------------------------------------------*/

import zod from "zod";

import { Flags } from "@oclif/core";

import { UserMemberRoles } from "../../services/access-control/models/user-member.js";
import { validateJson } from "../validation/validate-json.js";
import zodErrorToMessage from "../validation/zod-error-to-message.js";

export default Flags.custom<UserMemberRoles[]>({
  // eslint-disable-next-line @typescript-eslint/promise-function-async
  parse: (input) => Promise.resolve(validateJson<UserMemberRoles[]>(input, validationFunction)),
});

const validationFunction = (input: UserMemberRoles[]): string => {
  const result = zod.array(userMemberSchema).safeParse(input);
  if (result.error === undefined) return "";

  return zodErrorToMessage(result.error);
};

const userMemberSchema = zod.object({
  email: zod.string().email(),
  roleIds: zod.array(zod.string().uuid()),
}) satisfies zod.ZodType<UserMemberRoles>;
