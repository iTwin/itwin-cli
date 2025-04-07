/*---------------------------------------------------------------------------------------------
* Copyright (c) Bentley Systems, Incorporated. All rights reserved.
* See LICENSE.md in the project root for license terms and full copyright notice.
*--------------------------------------------------------------------------------------------*/

import { runCommand } from '@oclif/test';
import { expect } from 'chai';

import { createITwin, deleteITwin } from '../utils/helpers';

const tests = () => describe('info', () => {
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

  it('should get the iTwin info', async () => {
    const { stdout } = await runCommand(`itwin info --itwin-id ${testITwinId}`);
    const iTwinInfo = JSON.parse(stdout);

    expect(iTwinInfo).to.have.property('id', testITwinId);
    expect(iTwinInfo).to.have.property('displayName', name);
    expect(iTwinInfo).to.have.property('class', classType);
    expect(iTwinInfo).to.have.property('subClass', subClass);
  });

});

export default tests;