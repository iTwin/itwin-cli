/*---------------------------------------------------------------------------------------------
* Copyright (c) Bentley Systems, Incorporated. All rights reserved.
* See LICENSE.md in the project root for license terms and full copyright notice.
*--------------------------------------------------------------------------------------------*/

import { IModel } from '@itwin/imodels-client-management';
import { runCommand } from '@oclif/test';
import { expect } from 'chai';

import { createIModel, createITwin, deleteIModel } from '../utils/helpers';
import runSuiteIfMainModule from '../utils/run-suite-if-main-module';

const tests = () => describe('create + delete', () => {
  const testIModelName = `cli-imodel-integration-test-${new Date().toISOString()}`;
  const testIModelDescription = "Some Description";
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
    const extent = {
      northEast: {
        latitude: 46.302_763_954_781_234,
        longitude: 7.835_541_640_797_823
      },
      southWest: {
        latitude: 46.132_677_028_348_06,
        longitude: 7.672_120_009_938_448
      }
    }

    const iModelName = `${testIModelName}-create`;
    const { result: createdIModel} = await runCommand<IModel>(`imodel create --itwin-id ${testITwinId} --name "${iModelName}" --description "${testIModelDescription}" --extent "${JSON.stringify(extent)}"`);

    expect(createdIModel).to.not.be.undefined;
    expect(createdIModel!.id).to.not.be.undefined;
    expect(createdIModel!.iTwinId).to.be.equal(testITwinId);
    expect(createdIModel!.name).to.be.equal(iModelName);
    expect(createdIModel!.description).to.be.equal(testIModelDescription);
    expect(createdIModel!.extent).to.be.deep.equal(extent);
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