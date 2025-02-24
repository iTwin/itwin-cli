/*---------------------------------------------------------------------------------------------
* Copyright (c) Bentley Systems, Incorporated. All rights reserved.
* See LICENSE.md in the project root for license terms and full copyright notice.
*--------------------------------------------------------------------------------------------*/

import { runCommand } from '@oclif/test';
import { expect } from 'chai';

import { createITwin, deleteITwin } from '../utils/helpers';

const tests = () => describe('list', () => {
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

  it('should list all iTwins', async () => {
    const { stdout } = await runCommand('itwin list');
    const iTwinList = JSON.parse(stdout);

    expect(iTwinList).to.not.be.undefined;
    expect(iTwinList).to.be.an('array').that.is.not.empty;
    expect(iTwinList.some((itwin: { id: string; }) => itwin.id === testITwinId)).to.be.true;
  });

  it('should query iTwins without any provided properties', async () => {
    const { stdout } = await runCommand('itwin list');
    const iTwinList = JSON.parse(stdout);

    expect(iTwinList).to.not.be.null;
  });

  it('should fail when provided bad subClass', async () => {
    const result = await runCommand('itwin list --sub-class InvalidSubClass');
    expect(result.error).to.be.not.undefined;
    expect(result.error!.message).to.include('InvalidSubClass');
  });

});

export default tests;