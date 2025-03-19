/*---------------------------------------------------------------------------------------------
* Copyright (c) Bentley Systems, Incorporated. All rights reserved.
* See LICENSE.md in the project root for license terms and full copyright notice.
*--------------------------------------------------------------------------------------------*/

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
    testITwinId = testITwin.id;
  });

  after(async () => {
    await deleteITwin(testITwinId);
  });

  it('should update the iTwin', async () => {
    const updatedDisplayName = 'UpdatedIntegrationTestITwin';
    const { stdout } = await runCommand(`itwin update --itwin-id ${testITwinId} --display-name ${updatedDisplayName}`);
    const updatedITwin = JSON.parse(stdout);

    expect(updatedITwin).to.have.property('id', testITwinId);
    expect(updatedITwin).to.have.property('displayName', updatedDisplayName);
    expect(updatedITwin).to.have.property('class', classType);
  });

});

export default tests;