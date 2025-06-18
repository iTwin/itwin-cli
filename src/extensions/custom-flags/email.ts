/*---------------------------------------------------------------------------------------------
 * Copyright (c) Bentley Systems, Incorporated. All rights reserved.
 * See LICENSE.md in the project root for license terms and full copyright notice.
 *--------------------------------------------------------------------------------------------*/

import zod from "zod";

import { Flags } from "@oclif/core";

export default Flags.custom<string>({
  // eslint-disable-next-line @typescript-eslint/promise-function-async
  parse: (input) => Promise.resolve(validateEmail(input)),
});

const validateEmail = (emailString: string): string => {
  const result = zod.string().email().safeParse(emailString);
  if (result.error !== undefined) {
    throw new Error(`'${emailString}' is not a valid email.`);
  }

  return emailString;
};
