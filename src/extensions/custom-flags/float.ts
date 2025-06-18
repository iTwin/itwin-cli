/*---------------------------------------------------------------------------------------------
 * Copyright (c) Bentley Systems, Incorporated. All rights reserved.
 * See LICENSE.md in the project root for license terms and full copyright notice.
 *--------------------------------------------------------------------------------------------*/

import { Flags } from "@oclif/core";

export default Flags.custom<number>({
  // eslint-disable-next-line @typescript-eslint/promise-function-async
  parse: (input) => Promise.resolve(validateFloat(input)),
});

const validateFloat = async (floatString: string): Promise<number> => {
  if (!/^-?\d*(\.\d+)?$/.test(floatString)) {
    throw new TypeError(`${floatString} is not a valid number. Expected format: '1234.56'.`);
  }

  return Number.parseFloat(floatString);
};
