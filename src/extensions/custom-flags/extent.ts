/*---------------------------------------------------------------------------------------------
* Copyright (c) Bentley Systems, Incorporated. All rights reserved.
* See LICENSE.md in the project root for license terms and full copyright notice.
*--------------------------------------------------------------------------------------------*/

import { Extent } from "@itwin/imodels-client-management";
import { Flags } from "@oclif/core";
import zod from "zod";

import { validateJson } from "../validation/validate-json.js";
import zodErrorToMessage from "../validation/zod-error-to-message.js";

export default Flags.custom<Extent>({
  // eslint-disable-next-line @typescript-eslint/promise-function-async
  parse: (input) => Promise.resolve(
    validateJson<Extent>(input, validationFunction),
  )
});

const validationFunction = (input: Extent): string => {
  const result = extentSchema.safeParse(input);
  if (result.error === undefined)
    return '';

  return zodErrorToMessage(result.error);
};

const extentSchema = zod.object({
  northEast: zod.object({
    latitude: zod.number(),
    longitude: zod.number(),
  }),
  southWest: zod.object({
    latitude: zod.number(),
    longitude: zod.number(),
  }),
}) satisfies zod.ZodType<Extent>;