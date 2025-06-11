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
    const { result: imodelDeleteResult } = await runCommand<{ result: string }>(`imodel delete --imodel-id ${testIModelId}`);
    const { result: itwinDeleteResult } = await runCommand<{ result: string }>(`itwin delete --itwin-id ${testITwinId}`);

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
    };

    const { result: updatedIModel } = await runCommand<IModel>(`imodel update --imodel-id ${testIModelId} --name ${updatedName} --description "${updatedDescription}" --extent "${JSON.stringify(updatedExtent)}"`);

    expect(updatedIModel).to.not.be.undefined;
    expect(updatedIModel!.id).to.not.be.undefined;
    expect(updatedIModel).to.have.property('iTwinId', testITwinId);
    expect(updatedIModel!.name).to.be.equal(updatedName);
    expect(updatedIModel!.description).to.be.equal(updatedDescription);
    expect(updatedIModel!.extent).to.be.deep.equal(updatedExtent);
  });

  it('should update the iModel with extent provided via separate flags', async () => {
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
    };

    const { result: updatedIModel } = await runCommand<IModel>(`imodel update --imodel-id ${testIModelId} --name ${updatedName} --description "${updatedDescription}" --ne-latitude ${updatedExtent.northEast.latitude} --ne-longitude ${updatedExtent.northEast.longitude} --sw-latitude ${updatedExtent.southWest.latitude} --sw-longitude ${updatedExtent.southWest.longitude}`);

    expect(updatedIModel).to.not.be.undefined;
    expect(updatedIModel!.id).to.not.be.undefined;
    expect(updatedIModel).to.have.property('iTwinId', testITwinId);
    expect(updatedIModel!.name).to.be.equal(updatedName);
    expect(updatedIModel!.description).to.be.equal(updatedDescription);
    expect(updatedIModel!.extent).to.be.deep.equal(updatedExtent);
  });


  it('should return an error if user provides extent in both ways', async () => {
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
    };

    const { error: updateError } = await runCommand<IModel>(`imodel update --imodel-id ${testIModelId} --name ${updatedName} --description "${updatedDescription}" --extent "${JSON.stringify(updatedExtent)}" --ne-latitude ${updatedExtent.northEast.latitude} --ne-longitude ${updatedExtent.northEast.longitude} --sw-latitude ${updatedExtent.southWest.latitude} --sw-longitude ${updatedExtent.southWest.longitude}`);

    expect(updateError).to.not.be.undefined;
    expect(updateError?.message).to.match(/--extent=\[object Object] cannot also be provided when using --ne-latitude/);
    expect(updateError?.message).to.match(/--extent=\[object Object] cannot also be provided when using --ne-longitude/);
    expect(updateError?.message).to.match(/--extent=\[object Object] cannot also be provided when using --sw-latitude/);
    expect(updateError?.message).to.match(/--extent=\[object Object] cannot also be provided when using --sw-longitude/);
  });

  it('should return an error if user does not provide all extent flags', async () => {
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
    };

    const { error: updateError } = await runCommand<IModel>(`imodel update --imodel-id ${testIModelId} --name ${updatedName} --description "${updatedDescription}" --ne-latitude ${updatedExtent.northEast.latitude} --ne-longitude ${updatedExtent.northEast.longitude} --sw-latitude ${updatedExtent.southWest.latitude}`);

    expect(updateError).to.not.be.undefined;
    expect(updateError?.message).to.match(/All of the following must be provided when using --sw-latitude: --ne-latitude, --ne-longitude, --sw-longitude/);
  });

  it('should return an error if a component of the provided extent is not a valid number', async () => {
    const { error: createError} = await runCommand<IModel>(`imodel update --imodel-id ${testIModelId} --ne-latitude 46.302abc --ne-longitude 7.835 --sw-latitude 46.132 --sw-longitude 7.672`);

    expect(createError).to.not.be.undefined;
    expect(createError?.message).to.match(/46.302abc is not a valid number./);
  });
});

export default tests;

runSuiteIfMainModule(import.meta, tests);