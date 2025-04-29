/*---------------------------------------------------------------------------------------------
* Copyright (c) Bentley Systems, Incorporated. All rights reserved.
* See LICENSE.md in the project root for license terms and full copyright notice.
*--------------------------------------------------------------------------------------------*/

import { runCommand } from '@oclif/test';
import { expect } from 'chai';

import { createIModel, createITwin, deleteIModel } from '../utils/helpers';
import runSuiteIfMainModule from '../utils/run-suite-if-main-module';

const tests = () => describe('create + delete', () => {
  const testIModelName = `cli-imodel-integration-test-${new Date().toISOString()}`;
  let testITwinId: string;

  before(async () => {
    const testITwin = await createITwin(`cli-itwin-integration-test-${new Date().toISOString()}`, 'Thing', 'Asset');
    testITwinId = testITwin.id as string;
  });

  after(async () => { 
    const { result: deleteResult } = await runCommand(`itwin delete --itwin-id ${testITwinId}`);
    expect(deleteResult).to.have.property('result', 'deleted');
  });

  it('should create a new iModel', async () => {
    const iModelName = `${testIModelName}-create`;
    const createdIModel = await createIModel(iModelName, testITwinId);

    expect(createdIModel).to.have.property('id');
    expect(createdIModel).to.have.property('name', iModelName);
    expect(createdIModel).to.have.property('iTwinId', testITwinId);
  });

  it('should delete the iModel', async () => {
    const iModelName = `${testIModelName}-delete`;
    const createdIModel = await createIModel(iModelName, testITwinId);
    await deleteIModel(createdIModel.id);
    
    const result = await runCommand(`imodel info -m ${createdIModel.id}`);
    expect(result.error).to.be.not.undefined;
    expect(result.error!.code).to.be.equal('iModelNotFound');
  });
});

export default tests;

runSuiteIfMainModule(import.meta, tests);