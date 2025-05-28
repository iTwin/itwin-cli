/*---------------------------------------------------------------------------------------------
* Copyright (c) Bentley Systems, Incorporated. All rights reserved.
* See LICENSE.md in the project root for license terms and full copyright notice.
*--------------------------------------------------------------------------------------------*/

export const validateJson = <T>(jsonString: string, validationFunc?: (input: T) => string): T => {
    let parsed: T;
    try {
        parsed = JSON.parse(jsonString) as T;
    }
    catch {
        throw new Error(`'${jsonString}' is not valid serialized JSON.`);
    }
    
    if(validationFunc === undefined)
        return parsed;

    const validationError = validationFunc(parsed)
    if (validationError.length > 0) {
        throw new Error(validationError);
    }
    
    return parsed;
}