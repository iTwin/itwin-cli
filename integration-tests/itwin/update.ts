/*---------------------------------------------------------------------------------------------
* Copyright (c) Bentley Systems, Incorporated. All rights reserved.
* See LICENSE.md in the project root for license terms and full copyright notice.
*--------------------------------------------------------------------------------------------*/

import { ITwin } from "@itwin/itwins-client";
import { runCommand } from '@oclif/test';
import { expect } from 'chai';

import { createITwin, deleteITwin } from '../utils/helpers';

const tests = () => describe('update', () => {
  const name = 'IntegrationTestITwin';
  const classType = 'Thing';
  const subClass = 'Asset';
  let testITwinId: string;

  before(async () => {
    const testITwin = await createITwin(name, classType, subClass);
    testITwinId = testITwin.id as string;
  });

  after(async () => {
    await deleteITwin(testITwinId);
  });

  it('should update the iTwin', async () => {
    const updatedGeographicLocation = 'San Francisco, CA';
    const updatedIanaTimeZone = 'America/Los_Angeles';
    const updatedDisplayName = 'UpdatedIntegrationTestITwin';
    const updatedNumber = Math.random().toString(36).slice(2);
    const updatedStatus = 'Trial'
    const updatedType = 'Type1'

    const { stdout } = await runCommand(`itwin update --itwin-id ${testITwinId} --geographic-location "${updatedGeographicLocation}" --iana-time-zone ${updatedIanaTimeZone} --name ${updatedDisplayName} --number ${updatedNumber} --status ${updatedStatus} --type ${updatedType}`);
    const updatedITwin: ITwin = JSON.parse(stdout);

    expect(updatedITwin).to.not.be.undefined;
    expect(updatedITwin.id).to.be.equal(testITwinId);
    expect(updatedITwin.displayName).to.be.equal(updatedDisplayName);
    expect(updatedITwin.class).to.be.equal(classType);
    expect(updatedITwin.geographicLocation).to.be.equal(updatedGeographicLocation);
    expect(updatedITwin.ianaTimeZone).to.be.equal(updatedIanaTimeZone);
    expect(updatedITwin.number).to.be.equal(updatedNumber);
    expect(updatedITwin.status).to.be.equal(updatedStatus);
    expect(updatedITwin.type).to.be.equal(updatedType);
  });
});

export default tests;