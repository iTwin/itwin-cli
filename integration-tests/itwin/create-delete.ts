/*---------------------------------------------------------------------------------------------
* Copyright (c) Bentley Systems, Incorporated. All rights reserved.
* See LICENSE.md in the project root for license terms and full copyright notice.
*--------------------------------------------------------------------------------------------*/

import { runCommand } from '@oclif/test';
import { expect } from 'chai';

import { createITwin, deleteITwin } from '../utils/helpers';

const tests = () => describe('create + delete', () => {
  let testITwinId: string;
  const testITwinName = 'IntegrationTestITwin';
  const testClass = 'Thing';
  const testSubClass = 'Asset';

  it('should create a new iTwin', async () => {
    const createdITwin = await createITwin(testITwinName, testClass, testSubClass);

    expect(createdITwin).to.have.property('id');
    testITwinId = createdITwin.id;
    
    expect(createdITwin).to.have.property('displayName', testITwinName);
    expect(createdITwin).to.have.property('class', testClass);
  });

  it('should delete the iTwin', async () => {
    await deleteITwin(testITwinId);

    const result = await runCommand(`itwin info --id ${testITwinId}`);
    expect(result.error).to.be.not.undefined;
    expect(result.error!.message).to.include('iTwinNotFound');
  });
});

export default tests;