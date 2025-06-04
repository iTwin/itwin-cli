/*---------------------------------------------------------------------------------------------
* Copyright (c) Bentley Systems, Incorporated. All rights reserved.
* See LICENSE.md in the project root for license terms and full copyright notice.
*--------------------------------------------------------------------------------------------*/

import { ITwin } from '@itwin/itwins-client';
import { runCommand } from '@oclif/test';
import { expect } from 'chai';

import { createITwin } from '../utils/helpers';
import runSuiteIfMainModule from '../utils/run-suite-if-main-module';

const tests = () => describe('info', () => {
  const name = `cli-itwin-integration-test-${new Date().toISOString()}`;
  const classType = 'Thing';
  const subClass = 'Asset';
  let testITwinId: string;

  before(async () => {
    const testITwin = await createITwin(name, classType, subClass);
    testITwinId = testITwin.id as string;
  });

  after(async () => {
    const { result: deleteResult } = await runCommand<{result: string}>(`itwin delete --itwin-id ${testITwinId}`);
    expect(deleteResult).to.have.property('result', 'deleted');
  });

  it('should get the iTwin info', async () => {
    const { result: iTwin } = await runCommand<ITwin>(`itwin info --itwin-id ${testITwinId}`);
    
    expect(iTwin).to.have.property('id', testITwinId);
    expect(iTwin).to.have.property('displayName', name);
    expect(iTwin).to.have.property('class', classType);
    expect(iTwin).to.have.property('subClass', subClass);
  });

});

export default tests;

runSuiteIfMainModule(import.meta, tests);