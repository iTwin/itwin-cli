/*---------------------------------------------------------------------------------------------
* Copyright (c) Bentley Systems, Incorporated. All rights reserved.
* See LICENSE.md in the project root for license terms and full copyright notice.
*--------------------------------------------------------------------------------------------*/

import { Flags } from "@oclif/core";
import zod from "zod";

import { UserMember } from "../../services/access-control-client/models/members.js";
import { validateJson } from "../validation/validate-json.js";
import zodErrorToMessage from "../validation/zod-error-to-message.js";

export default Flags.custom<UserMember[]>({
    parse: (input) => Promise.resolve(
        validateJson<UserMember[]>(input, validationFunction)
    ),
});

const validationFunction = (input: UserMember[]): string => {
    const result = zod.array(UserMemberSchema).safeParse(input);
    if(result.error === undefined)
        return '';

    return zodErrorToMessage(result.error);
}

const UserMemberSchema = zod.object({
    email: zod.string().email(),
    roleIds: zod.array(zod.string().uuid())
}) satisfies zod.ZodType<UserMember>