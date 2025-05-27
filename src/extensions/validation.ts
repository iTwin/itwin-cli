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

export const validateGuidCSV = async (csvGuidString: string): Promise<string> => {
    const GUIDs = csvGuidString.split(',');
    const areAllGUIDs = GUIDs.every((guid) => guid.match(/^[\da-f]{8}-[\da-f]{4}-[1-5][\da-f]{3}-[89ab][\da-f]{3}-[\da-f]{12}$/i))
    if(!areAllGUIDs) {
        throw new Error(`There are invalid GUIDs in '${csvGuidString}'.`)
    }
    
    return csvGuidString;
}