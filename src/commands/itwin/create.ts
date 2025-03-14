/*---------------------------------------------------------------------------------------------
* Copyright (c) Bentley Systems, Incorporated. All rights reserved.
* See LICENSE.md in the project root for license terms and full copyright notice.
*--------------------------------------------------------------------------------------------*/

import { ITwin, ITwinClass, ITwinSubClass } from "@itwin/itwins-client";
import { Flags } from "@oclif/core";

import BaseCommand from "../../extensions/base-command.js";

export default class CreateITwin extends BaseCommand {
    static description = 'Create an iTwin';
  
    static flags = {
      class: Flags.string({
        description: 'The Class of your iTwin.',
        options: ["Account", "Thing", "Endeavor"],
        required: true,
      }),
      "data-center-location": Flags.string({
        description: 'Data center for iTwin data. Defaults to East US.',
        options: ['East US', 'North Europe', 'West Europe', 'Southeast Asia', 'Australia East', 'UK South', 'Canada Central', 'Central India', 'Japan East'],
        required: false,
      }),
      "display-name": Flags.string({
        description: "The iTwin's display name.",
        required: true,
      }),
      "geographic-location": Flags.string({
        description: 'Optional location, typically an address or city.',
        required: false
      }),
      "iana-time-zone": Flags.string({
        description: 'Optional IANA time zone ID.',
        required: false,
      }),
      number: Flags.string({
        description: 'Unique identifier for the iTwin. Defaults to iTwin Id if unspecified.',
        required: false,
      }),
      "parent-id": Flags.string({
        description: "Optional parent iTwin Id. Defaults to user's Account iTwin.",
        required: false,
      }),
      status: Flags.string({
        description: 'Status of the iTwin. Defaults to Active.',
        options: ['Active', 'Inactive', 'Trial'],
        required: false,
      }),
      "sub-class": Flags.string({
        description: 'The subClass of your iTwin.',
        options: ["Account", "Portfolio", "Asset", "Program", "Project", "WorkPackage"],
        required: false,
      }),
      type: Flags.string({
        description: "An open ended property to better define your iTwin's Type.",
        required: false,
      }),
    };
  
    async run() {
      const { flags } = await this.parse(CreateITwin);
  
      const iTwin : ITwin = {
        class: flags.class as ITwinClass,
        dataCenterLocation: flags["data-center-location"],
        displayName: flags["display-name"],
        geographicLocation: flags["geographic-location"],
        ianaTimeZone: flags["iana-time-zone"],
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
  
      return this.logAndReturnResult(creatediTwin.data);
    }
  }
  