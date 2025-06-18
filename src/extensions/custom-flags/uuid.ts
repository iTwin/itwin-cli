/*---------------------------------------------------------------------------------------------
 * Copyright (c) Bentley Systems, Incorporated. All rights reserved.
 * See LICENSE.md in the project root for license terms and full copyright notice.
 *--------------------------------------------------------------------------------------------*/

import { Flags } from "@oclif/core";

export default Flags.custom<string>({
  // eslint-disable-next-line @typescript-eslint/promise-function-async
  parse: (input) => Promise.resolve(validateUuid(input)),
});

const validateUuid = async (uuidString: string): Promise<string> => {
  const isUUID = uuidString.match(/^[\da-f]{8}-[\da-f]{4}-[1-5][\da-f]{3}-[89ab][\da-f]{3}-[\da-f]{12}$/i);
  if (!isUUID) {
    throw new Error(`'${uuidString}' is not a valid UUID.`);
  }

  return uuidString;
};
