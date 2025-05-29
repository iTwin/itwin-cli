/*---------------------------------------------------------------------------------------------
* Copyright (c) Bentley Systems, Incorporated. All rights reserved.
* See LICENSE.md in the project root for license terms and full copyright notice.
*--------------------------------------------------------------------------------------------*/

export const validateUuidCSV = async (csvUuidString: string): Promise<string> => {
    const UUIDs = csvUuidString.split(',');
    const areAllUUIDs = UUIDs.every((uuid) => uuid.match(/^[\da-f]{8}-[\da-f]{4}-[1-5][\da-f]{3}-[89ab][\da-f]{3}-[\da-f]{12}$/i))
    if(!areAllUUIDs) {
        throw new Error(`There are invalid UUIDs in '${csvUuidString}'.`)
    }
    
    return csvUuidString;
}