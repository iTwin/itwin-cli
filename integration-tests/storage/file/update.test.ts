/*---------------------------------------------------------------------------------------------
* Copyright (c) Bentley Systems, Incorporated. All rights reserved.
* See LICENSE.md in the project root for license terms and full copyright notice.
*--------------------------------------------------------------------------------------------*/

import { runCommand } from '@oclif/test';
import { expect } from 'chai';

import { 
  createFile,
  createIModel,
  createITwin, 
  getRootFolderId 
} from '../../utils/helpers';

const tests = () => describe('update', () => {
  const testFileName = 'test.zip';
  const testFilePath = 'integration-tests/test.zip';
  let testFileId: string;
  let testIModelId: string;
  let testITwinId: string;

  before(async () => {
    const testITwin = await createITwin(`cli-itwin-integration-test-${new Date().toISOString()}`, 'Thing', 'Asset');
    testITwinId = testITwin.id as string;
    const testIModel = await createIModel(`cli-imodel-integration-test-${new Date().toISOString()}`, testITwinId);
    testIModelId = testIModel.id;
    const rootFolderId = await getRootFolderId(testITwinId);
    const testFile = await createFile(rootFolderId, testFileName, testFilePath);
    testFileId = testFile.id as string;
  });

  after(async () => {
    const { result: fileDeleteResult } = await runCommand(`storage file delete --file-id ${testFileId}`);
    const { result: imodelDeleteResult } = await runCommand(`imodel delete --imodel-id ${testIModelId}`);
    const { result: itwinDeleteResult } = await runCommand(`itwin delete --itwin-id ${testITwinId}`);

    expect(fileDeleteResult).to.have.property('result', 'deleted');
    expect(imodelDeleteResult).to.have.property('result', 'deleted');
    expect(itwinDeleteResult).to.have.property('result', 'deleted');
  });

  it('should update the file\'s meta data', async () => {
    const updatedDisplayName = 'Updated Display Name';
    const updatedDescription = 'Updated description';
    const { stdout } = await runCommand(`storage file update --file-id ${testFileId} --name "${updatedDisplayName}" --description "${updatedDescription}"`);
    const fileInfo = JSON.parse(stdout);

    expect(fileInfo).to.have.property('id', testFileId);
    expect(fileInfo).to.have.property('displayName', updatedDisplayName);
    expect(fileInfo).to.have.property('description', updatedDescription);
  });
});

export default tests;