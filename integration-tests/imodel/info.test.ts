/*---------------------------------------------------------------------------------------------
* Copyright (c) Bentley Systems, Incorporated. All rights reserved.
* See LICENSE.md in the project root for license terms and full copyright notice.
*--------------------------------------------------------------------------------------------*/

import { runCommand } from '@oclif/test';
import { expect } from 'chai';

import { createIModel, createITwin, deleteIModel, deleteITwin } from '../utils/helpers';
import runSuiteIfMainModule from '../utils/run-suite-if-main-module';

const tests = () => describe('info', () => {
  const testIModelName = 'IntegrationTestIModel';
  let testIModelId: string;
  let testITwinId: string;

  before(async () => {
    const testITwin = await createITwin('IntegrationTestITwin', 'Thing', 'Asset');
    testITwinId = testITwin.id as string;
    const testIModel = await createIModel(testIModelName, testITwinId);
    testIModelId = testIModel.id;
  });

  after(async () => {
    await deleteIModel(testIModelId);
    await deleteITwin(testITwinId);
  });

  it('should get the iModel info', async () => {
    const { stdout } = await runCommand(`imodel info --imodel-id ${testIModelId}`);
    const iModelInfo = JSON.parse(stdout);

    expect(iModelInfo).to.have.property('id', testIModelId);
    expect(iModelInfo).to.have.property('name', testIModelName);
    expect(iModelInfo).to.have.property('iTwinId', testITwinId);
  });
});

export default tests;

runSuiteIfMainModule(import.meta, tests);