/*---------------------------------------------------------------------------------------------
* Copyright (c) Bentley Systems, Incorporated. All rights reserved.
* See LICENSE.md in the project root for license terms and full copyright notice.
*--------------------------------------------------------------------------------------------*/

import { ITwin, ITwinClass, ITwinSubClass } from "@itwin/itwins-client";
import { Flags } from "@oclif/core";

import { ApiReference } from "../../extensions/api-reference.js";
import BaseCommand from "../../extensions/base-command.js";

export default class CreateITwin extends BaseCommand {
  public static apiReference: ApiReference = {
    link: "https://developer.bentley.com/apis/itwins/operations/create-itwin/",
    name: "Create iTwin",
  };

  public static customDocs = true;

  public static description = 'Create a new iTwin with specified properties.';

  public static examples = [
    {
      command: `<%= config.bin %> <%= command.id %> --class Thing --sub-class Asset --name "Golden Gate Revamp"`,
      description: `Example 1: Creating an iTwin with the 'Thing' class and 'Asset' subclass`
    },
    {
      command: `<%= config.bin %> <%= command.id %> --class Endeavor --sub-class Project --name "Bridge Construction" --geographic-location "San Francisco, CA" --iana-time-zone America/Los_Angeles`,
      description: `Example 2: Creating an iTwin with the 'Endeavor' class and 'Project' subclass`
    },
    {
      command: `<%= config.bin %> <%= command.id %> --class Endeavor --sub-class Program --name "Rail Network" --data-center-location "UK South" --status Trial`,
      description: `Example 3: Creating an iTwin with data center location and status set to 'Trial'`
    }
  ];

  public static flags = {
    class: Flags.string({
      description: 'The Class of your iTwin.',
      helpValue: '<string>',
      options: ["Account", "Thing", "Endeavor"],
      required: true,
    }),
    "data-center-location": Flags.string({
      description: 'Data center for iTwin data. Defaults to East US.',
      helpValue: '<string>',
      options: ['East US', 'North Europe', 'West Europe', 'Southeast Asia', 'Australia East', 'UK South', 'Canada Central', 'Central India', 'Japan East'],
      required: false,
    }),
    "geographic-location": Flags.string({
      description: 'Optional location, typically an address or city.',
      helpValue: '<string>',
      required: false
    }),
    "iana-time-zone": Flags.string({
      description: 'Optional IANA time zone ID.',
      helpValue: '<string>',
      required: false,
    }),
    name: Flags.string({
      char: 'n',
      description: "The iTwin's display name.",
      helpValue: '<string>',
      required: true,
    }),
    // eslint-disable-next-line id-denylist
    number: Flags.string({
      description: 'Unique identifier for the iTwin. Defaults to iTwin Id if unspecified.',
      helpValue: '<string>',
      required: false,
    }),
    "parent-id": Flags.string({
      description: "Optional parent iTwin Id. Defaults to user's Account iTwin.",
      helpValue: '<string>',
      required: false,
    }),
    save: Flags.boolean({
      description: 'Save the iTwin id to the context.',
      required: false,
    }),
    status: Flags.string({
      description: 'Status of the iTwin. Defaults to Active.',
      helpValue: '<string>',
      options: ['Active', 'Inactive', 'Trial'],
      required: false,
    }),
    "sub-class": Flags.string({
      description: 'The subClass of your iTwin.',
      helpValue: '<string>',
      options: ["Account", "Portfolio", "Asset", "Program", "Project", "WorkPackage"],
      required: true,
    }),
    type: Flags.string({
      description: "An open ended property to better define your iTwin's Type.",
      helpValue: '<string>',
      required: false,
    }),
  };
  
  public async run(): Promise<ITwin | undefined> {
    const { flags } = await this.parse(CreateITwin);
  
    const iTwin : ITwin = {
      class: flags.class as ITwinClass,
      dataCenterLocation: flags["data-center-location"],
      displayName: flags.name,
      geographicLocation: flags["geographic-location"],
      ianaTimeZone: flags["iana-time-zone"],
      // eslint-disable-next-line id-denylist
      number: flags.number,
      parentId: flags["parent-id"],
      status: flags.status,
      subClass: flags["sub-class"] as ITwinSubClass,
      type: flags.type
    };
  
    const accessToken = await this.getAccessToken();
    const client = this.getITwinAccessClient();

    const creatediTwin = await client.createiTwin(accessToken, iTwin);
    if(creatediTwin.error)
    {
      this.error(JSON.stringify(creatediTwin.error, null, 2));
    }

    if (flags.save) {
      if(creatediTwin.data?.id === undefined){
        this.log("iTwin Id not found in response. Cannot save to context.");
      }
      else {
        await this.setContext(creatediTwin.data.id);
      }
    }
  
    return this.logAndReturnResult(creatediTwin.data);
  }
}
