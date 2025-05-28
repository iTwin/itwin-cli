/*---------------------------------------------------------------------------------------------
* Copyright (c) Bentley Systems, Incorporated. All rights reserved.
* See LICENSE.md in the project root for license terms and full copyright notice.
*--------------------------------------------------------------------------------------------*/

import { Flags } from "@oclif/core";

import { validateJson } from "../validation/validate-json.js";

export default Flags.custom<object>({
    parse: (input) => Promise.resolve(
        validateJson<object>(input)
    ),
});