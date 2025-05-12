/*---------------------------------------------------------------------------------------------
* Copyright (c) Bentley Systems, Incorporated. All rights reserved.
* See LICENSE.md in the project root for license terms and full copyright notice.
*--------------------------------------------------------------------------------------------*/

import { runCommand } from '@oclif/test';
import { expect } from 'chai';

import { storageConnection } from '../../../src/services/synchronizationClient/models/storage-connection';
import { storageRun } from '../../../src/services/synchronizationClient/models/storage-run';
import { storageRunsResponse } from '../../../src/services/synchronizationClient/models/storage-run-response';
import { createFile, createIModel, createITwin, getRootFolderId, isNativeAuthAccessTokenCached } from '../../utils/helpers';
import runSuiteIfMainModule from '../../utils/run-suite-if-main-module';

const tests = () => describe('run', () => {
  let testITwinId: string;
  let testIModelId: string;
  let rootFolderId: string;
  let testFileId: string;
  let connectionId: string;

  before(async () => {
    const testITwin = await createITwin(`cli-itwin-integration-test-${new Date().toISOString()}`, 'Thing', 'Asset');
    testITwinId = testITwin.id as string;
    const testIModel = await createIModel(`cli-imodel-integration-test-${new Date().toISOString()}`, testITwinId);
    testIModelId = testIModel.id;
    rootFolderId = await getRootFolderId(testITwinId);
    const testFile = await createFile(rootFolderId, 'ExtonCampus.dgn', 'examples/datasets/ExtonCampus.dgn');
    testFileId = testFile.id as string;
    
    const authenticationType = isNativeAuthAccessTokenCached() ? 'User': 'Service';
    const { result: createdConnection} = await runCommand<storageConnection>(`imodel connection create -m ${testIModelId} -f ${testFileId} --connector-type MSTN -n TestConnection --authentication-type ${authenticationType}`);
    expect(createdConnection).to.not.be.undefined;
    connectionId = createdConnection!.id!;
    await runCommand(`imodel connection auth`);
  });

  after(async () => {
    const { result: connectionDeleteResult } = await runCommand(`imodel connection delete --connection-id ${connectionId}`);
    const { result: fileDeleteResult} = await runCommand(`storage file delete --file-id ${testFileId}`);
    const { result: imodelDeleteResult } = await runCommand(`imodel delete --imodel-id ${testIModelId}`);
    const { result: itwinDeleteResult } = await runCommand(`itwin delete --itwin-id ${testITwinId}`);

    expect(connectionDeleteResult).to.have.property('result', 'deleted');
    expect(fileDeleteResult).to.have.property('result', 'deleted');
    expect(imodelDeleteResult).to.have.property('result', 'deleted');
    expect(itwinDeleteResult).to.have.property('result', 'deleted');
  });

  it('should create a connection run and wait for it to complete', async () => {
    const { result: createResult } = await runCommand(`imodel connection run create -c ${connectionId}`);
    expect(createResult).to.not.be.undefined;

    const { result: listResult } = await runCommand<storageRunsResponse>(`imodel connection run list -c ${connectionId}`);
    expect(listResult).to.not.be.undefined;
    expect(listResult?.runs).to.not.be.undefined;
    expect(listResult?.runs.length).to.be.equal(1);
    
    let { result: infoResult } = await runCommand<storageRun>(`imodel connection run info -c ${connectionId} --connection-run-id ${listResult?.runs[0].id}`);

    let index = 0;
    while(infoResult?.state !== "Completed" && ++index < 15) {
      // eslint-disable-next-line no-await-in-loop
      await new Promise(r => {setTimeout(r, 3000 * index)});

      // eslint-disable-next-line no-await-in-loop
      const { result } = await runCommand<storageRun>(`imodel connection run info -c ${connectionId} --connection-run-id ${listResult?.runs[0].id}`);
      infoResult = result;
    }

    expect(infoResult?.id).to.be.equal(listResult?.runs[0].id);
    expect(infoResult?.state).to.be.equal("Completed")
    expect(infoResult?.result).to.be.equal("Success");
  });
});

export default tests;

runSuiteIfMainModule(import.meta, tests);