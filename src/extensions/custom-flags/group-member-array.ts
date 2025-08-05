/*---------------------------------------------------------------------------------------------
 * Copyright (c) Bentley Systems, Incorporated. All rights reserved.
 * See LICENSE.md in the project root for license terms and full copyright notice.
 *--------------------------------------------------------------------------------------------*/

import zod from "zod";

import { Flags } from "@oclif/core";

import { GroupMemberRoles } from "../../services/access-control/models/group.js";
import { validateJson } from "../validation/validate-json.js";
import zodErrorToMessage from "../validation/zod-error-to-message.js";

export default Flags.custom<GroupMemberRoles[]>({
  // eslint-disable-next-line @typescript-eslint/promise-function-async
  parse: (input) => Promise.resolve(validateJson<GroupMemberRoles[]>(input, validationFunction)),
});

const validationFunction = (input: GroupMemberRoles[]): string => {
  const result = zod.array(groupMemberSchema).safeParse(input);
  if (result.error === undefined) return "";

  return zodErrorToMessage(result.error);
};

const groupMemberSchema = zod.object({
  groupId: zod.string().uuid(),
  roleIds: zod.array(zod.string().uuid()),
}) satisfies zod.ZodType<GroupMemberRoles>;
