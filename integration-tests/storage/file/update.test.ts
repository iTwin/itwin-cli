/*---------------------------------------------------------------------------------------------
* Copyright (c) Bentley Systems, Incorporated. All rights reserved.
* See LICENSE.md in the project root for license terms and full copyright notice.
*--------------------------------------------------------------------------------------------*/

import { runCommand } from '@oclif/test';
import { expect } from 'chai';

import { fileTyped } from '../../../src/services/storage-client/models/file-typed';
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
    const { result: imodelDeleteResult } = await runCommand<{result: string}>(`imodel delete --imodel-id ${testIModelId}`);
    const { result: itwinDeleteResult } = await runCommand<{result: string}>(`itwin delete --itwin-id ${testITwinId}`);

    expect(imodelDeleteResult?.result).to.be.equal('deleted');
    expect(itwinDeleteResult?.result).to.be.equal('deleted');
  });

  it('should update the file\'s meta data', async () => {
    const updatedDisplayName = 'Updated Display Name';
    const updatedDescription = 'Updated description';
    const { result: fileInfo } = await runCommand<fileTyped>(`storage file update --file-id ${testFileId} --name "${updatedDisplayName}" --description "${updatedDescription}"`);

    expect(fileInfo?.id).to.be.equal(testFileId);
    expect(fileInfo?.displayName).to.be.equal(updatedDisplayName);
    expect(fileInfo?.description).to.be.equal(updatedDescription);
  });
});

export default tests;