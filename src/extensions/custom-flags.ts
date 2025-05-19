import { Flags } from "@oclif/core";

// eslint-disable-next-line unicorn/no-static-only-class
export class CustomFlags {
    static iModelIDFlag = (config : CustomFlagConfig) => Flags.string({
        char: 'm',
        description: config.description,
        env: 'ITP_IMODEL_ID',
        helpValue: '<string>',
        required: true,
    });
    
    static iTwinIDFlag = (config : CustomFlagConfig) => Flags.string({ 
        char: 'i', 
        description: config.description,
        env: 'ITP_ITWIN_ID',
        helpValue: '<string>',
        required: true,
    });

    static async validateFloat(floatString: string): Promise<string> {
        if(!/^-?\d*(\.\d+)?$/.test(floatString)){
            throw new TypeError(`${floatString} is not a valid number.`)
        }

        return floatString;
    };
}

export type CustomFlagConfig = {
    description: string;
};