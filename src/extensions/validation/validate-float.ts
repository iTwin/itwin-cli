/*---------------------------------------------------------------------------------------------
* Copyright (c) Bentley Systems, Incorporated. All rights reserved.
* See LICENSE.md in the project root for license terms and full copyright notice.
*--------------------------------------------------------------------------------------------*/

export const validateFloat = async (floatString: string): Promise<string> => {
    if(!/^-?\d*(\.\d+)?$/.test(floatString)){
        throw new TypeError(`${floatString} is not a valid number.`)
    }

    return floatString;
};