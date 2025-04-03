/*---------------------------------------------------------------------------------------------
* Copyright (c) Bentley Systems, Incorporated. All rights reserved.
* See LICENSE.md in the project root for license terms and full copyright notice.
*--------------------------------------------------------------------------------------------*/

import { runCommand } from '@oclif/test';
import { expect } from 'chai';

import { createIModel, createITwin, deleteIModel, deleteITwin } from '../utils/helpers';

const tests = () => describe('update', () => {
  let testIModelId: string;
  let testITwinId: string;

  before(async () => {
    const testITwin = await createITwin('IntegrationTestITwin', 'Thing', 'Asset');
    testITwinId = testITwin.id as string;
    const testIModel = await createIModel('IntegrationTestIModel', testITwinId);
    testIModelId = testIModel.id;
  });

  after(async () => {
    await deleteIModel(testIModelId);
    await deleteITwin(testITwinId);
  });

  it('should update the iModel', async () => {
    const updatedName = 'UpdatedIntegrationTestIModel';
    const { stdout } = await runCommand(`imodel update --imodel-id ${testIModelId} --name ${updatedName}`);
    const updatedITwin = JSON.parse(stdout);

    expect(updatedITwin).to.have.property('id', testIModelId);
    expect(updatedITwin).to.have.property('name', updatedName);
  });

});

export default tests;