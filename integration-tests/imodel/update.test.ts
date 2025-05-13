/*---------------------------------------------------------------------------------------------
* Copyright (c) Bentley Systems, Incorporated. All rights reserved.
* See LICENSE.md in the project root for license terms and full copyright notice.
*--------------------------------------------------------------------------------------------*/

import { IModel } from '@itwin/imodels-client-management';
import { runCommand } from '@oclif/test';
import { expect } from 'chai';

import { createIModel, createITwin } from '../utils/helpers';
import runSuiteIfMainModule from '../utils/run-suite-if-main-module';

const tests = () => describe('update', () => {
  let testIModelId: string;
  let testITwinId: string;

  before(async () => {
    const testITwin = await createITwin(`cli-itwin-integration-test-${new Date().toISOString()}`, 'Thing', 'Asset');
    testITwinId = testITwin.id as string;
    const testIModel = await createIModel(`cli-imodel-integration-test-${new Date().toISOString()}`, testITwinId);
    testIModelId = testIModel.id;
  });

  after(async () => {
    const { result: imodelDeleteResult } = await runCommand(`imodel delete --imodel-id ${testIModelId}`);
    const { result: itwinDeleteResult } = await runCommand(`itwin delete --itwin-id ${testITwinId}`);

    expect(imodelDeleteResult).to.have.property('result', 'deleted');
    expect(itwinDeleteResult).to.have.property('result', 'deleted');
  });

  it('should update the iModel', async () => {
    const updatedName = 'UpdatedIntegrationTestIModel';
    const updatedDescription = "Some Description";
    const updatedExtent = {
      northEast: {
        latitude: 46.302_763_954_781_234,
        longitude: 7.835_541_640_797_823
      },
      southWest: {
        latitude: 46.132_677_028_348_06,
        longitude: 7.672_120_009_938_448
      }
    }

    const { result: updatedIModel } = await runCommand<IModel>(`imodel update --imodel-id ${testIModelId} --name ${updatedName} --description "${updatedDescription}" --extent "${JSON.stringify(updatedExtent)}"`);

    expect(updatedIModel).to.not.be.undefined;
    expect(updatedIModel!.id).to.not.be.undefined;
    expect(updatedIModel!.iTwinId).to.be.equal(testITwinId);
    expect(updatedIModel!.name).to.be.equal(updatedName);
    expect(updatedIModel!.description).to.be.equal(updatedDescription);
    expect(updatedIModel!.extent).to.be.deep.equal(updatedExtent);
  });
});

export default tests;

runSuiteIfMainModule(import.meta, tests);