/*---------------------------------------------------------------------------------------------
* Copyright (c) Bentley Systems, Incorporated. All rights reserved.
* See LICENSE.md in the project root for license terms and full copyright notice.
*--------------------------------------------------------------------------------------------*/

import { runCommand } from '@oclif/test';
import { expect } from 'chai';

import { trackingResponse } from '../../src/services/changed-elements-client/tracking';
import { createIModel, createITwin } from '../utils/helpers';
import { resultResponse } from '../utils/result-response';
import runSuiteIfMainModule from '../utils/run-suite-if-main-module';

const tests = () => describe('enable + disable + info', () => {
  let testIModelId: string;
  let testITwinId: string;

  before(async () => {
    const testITwin = await createITwin(`cli-itwin-integration-test-${new Date().toISOString()}`, 'Thing', 'Asset');
    testITwinId = testITwin.id as string;
    const testIModel = await createIModel(`cli-imodel-integration-test--${new Date().toISOString()}`, testITwinId);
    testIModelId = testIModel.id;
  });

  after(async () => {
    const { result: imodelDeleteResult } = await runCommand<{result: string}>(`imodel delete --imodel-id ${testIModelId}`);
    const { result: itwinDeleteResult } = await runCommand<{result: string}>(`itwin delete --itwin-id ${testITwinId}`);

    expect(imodelDeleteResult?.result).to.be.equal('deleted');
    expect(itwinDeleteResult?.result).to.be.equal('deleted');
  });

  it('should have enabled change tracking', async () => {
    const { result: enableResponse } = await runCommand<resultResponse>(`changed-elements enable --imodel-id ${testIModelId} --itwin-id ${testITwinId}`);
    expect(enableResponse?.result).equals('enabled');    

    const { result: infoResponse } = await runCommand<trackingResponse>(`changed-elements info --imodel-id ${testIModelId} --itwin-id ${testITwinId}`);
    expect(infoResponse?.enabled).to.be.true;
  });

  it('should disable change tracking for the specified iModel', async () => {
    const { result: disableResponse } = await runCommand<resultResponse>(`changed-elements disable --imodel-id ${testIModelId} --itwin-id ${testITwinId}`);
    expect(disableResponse?.result).equals('disabled');    
    
    const { result: infoResponse } = await runCommand<trackingResponse>(`changed-elements info -m ${testIModelId} -i ${testITwinId}`);
    expect(infoResponse?.enabled).to.be.false;
  });
});

export default tests;

runSuiteIfMainModule(import.meta, tests);