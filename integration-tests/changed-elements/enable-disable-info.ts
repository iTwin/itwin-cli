/*---------------------------------------------------------------------------------------------
* Copyright (c) Bentley Systems, Incorporated. All rights reserved.
* See LICENSE.md in the project root for license terms and full copyright notice.
*--------------------------------------------------------------------------------------------*/

import { runCommand } from '@oclif/test';
import { expect } from 'chai';

import { createIModel, createITwin, deleteIModel, deleteITwin } from '../utils/helpers';

const tests = () => describe('enable + disable + info', () => {
  const testIModelName = 'IntegrationTestIModel';
  let testIModelId: string;
  let testITwinId: string;

  before(async () => {
    const testITwin = await createITwin('IntegrationTestITwin', 'Thing', 'Asset');
    testITwinId = testITwin.id;
    const testIModel = await createIModel(testIModelName, testITwinId);
    testIModelId = testIModel.id;
  });

  after(async () => {
    await deleteIModel(testIModelId);
    await deleteITwin(testITwinId);
  });

  it('should enable change tracking for the specified iModel', async () => {
    const { stdout } = await runCommand(`changed-elements enable --imodel-id ${testIModelId} --itwin-id ${testITwinId}`);
    const result = JSON.parse(stdout);

    expect(result).to.have.property('result', 'enabled');
  });

  it('should have enabled change tracking', async () => {
    const { stdout } = await runCommand(`changed-elements info --imodel-id ${testIModelId} --itwin-id ${testITwinId}`);
    const result = JSON.parse(stdout);

    expect(result).to.have.property('enabled', true);
  });

  it('should disable change tracking for the specified iModel', async () => {
    const { stdout } = await runCommand(`changed-elements disable --imodel-id ${testIModelId} --itwin-id ${testITwinId}`);
    const result = JSON.parse(stdout);
    
    expect(result).to.have.property('result', 'disabled');
  });

  it('should have disabled change tracking', async () => {
    const { stdout } = await runCommand(`changed-elements info --imodel-id ${testIModelId} --itwin-id ${testITwinId}`);
    const result = JSON.parse(stdout);
    
    expect(result).to.have.property('enabled', false);
  });

});

export default tests;