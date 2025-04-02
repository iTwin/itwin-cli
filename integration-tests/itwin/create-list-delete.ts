/*---------------------------------------------------------------------------------------------
* Copyright (c) Bentley Systems, Incorporated. All rights reserved.
* See LICENSE.md in the project root for license terms and full copyright notice.
*--------------------------------------------------------------------------------------------*/

import { ITwin } from "@itwin/itwins-client";
import { runCommand } from '@oclif/test';
import { expect } from 'chai';

const tests = () => describe('create + list + delete', () => {
  let testITwinId: string;
  let testITwinId2: string;
  let testITwinChildId: string;
  let testITwinAccountId: string;
  const testITwinName1 = 'IntegrationTestITwin';
  const testITwinName2 = 'OtherIntegrationTestITwin';
  const testChildITwinName = 'IntegrationTestITwinChild';
  const testClass = 'Thing';
  const testSubClass = 'Asset';
  const testGeographicLocation= 'San Francisco, CA'
  const testDataCenterLocation = 'UK South'
  const testStatus = 'Inactive'
  const testIanaTimeZone = 'America/Los_Angeles'
  const testType = 'Type1'
  const testNumber = Math.random().toString(36).slice(2)

  it('should create a new iTwin', async () => {
    const itwinJson = await runCommand(`itwin create --name "${testITwinName1}" --class ${testClass} --sub-class ${testSubClass} --type ${testType} --number ${testNumber}`); 
    const itwinObj: ITwin = JSON.parse(itwinJson.stdout);
    expect(itwinObj).to.have.property('id'); 
    expect(itwinObj.displayName).to.be.equal(testITwinName1);
    expect(itwinObj.class).to.be.equal(testClass);
    expect(itwinObj.subClass).to.be.equal(testSubClass);
    expect(itwinObj.type).to.be.equal(testType);
    expect(itwinObj.number).to.be.equal(testNumber);
    testITwinId = itwinObj.id!;
    testITwinAccountId = itwinObj.parentId!;
  });

  it('should create a new child iTwin', async () => {
    const itwinChildJson = await runCommand(`itwin create --name "${testChildITwinName}" --class ${testClass} --sub-class ${testSubClass} --parent-id ${testITwinId} --status ${testStatus}`);
    const itwinChildObj: ITwin = JSON.parse(itwinChildJson.stdout);
    expect(itwinChildObj).to.have.property('id'); 
    expect(itwinChildObj.displayName).to.be.equal(testChildITwinName);
    expect(itwinChildObj.class).to.be.equal(testClass);
    expect(itwinChildObj.subClass).to.be.equal(testSubClass);
    expect(itwinChildObj.parentId).to.be.equal(testITwinId);
    expect(itwinChildObj.status).to.be.equal(testStatus);
    testITwinChildId = itwinChildObj.id!;
  });

  it('should create a new iTwin with location information', async () => {
    const itwinJson = await runCommand(`itwin create --name "${testITwinName2}" --class ${testClass} --sub-class ${testSubClass} --data-center-location "${testDataCenterLocation}" --iana-time-zone ${testIanaTimeZone} --geographic-location "${testGeographicLocation}"`);
    const itwinObj: ITwin = JSON.parse(itwinJson.stdout);
    expect(itwinObj).to.have.property('id'); 
    expect(itwinObj.displayName).to.be.equal(testITwinName2);
    expect(itwinObj.class).to.be.equal(testClass);
    expect(itwinObj.subClass).to.be.equal(testSubClass);
    expect(itwinObj.dataCenterLocation).to.be.equal(testDataCenterLocation);
    expect(itwinObj.ianaTimeZone).to.be.equal(testIanaTimeZone);
    expect(itwinObj.geographicLocation).to.be.equal(testGeographicLocation);
    testITwinId2 = itwinObj.id!;
  });

  it('should fail when provided bad subClass', async () => {
    const result = await runCommand('itwin list --sub-class InvalidSubClass');
    expect(result.error).to.be.not.undefined;
    expect(result.error!.message).to.include('InvalidSubClass');
  });

  it('should list created active itwins', async () => {
    const result = await runCommand(`itwin list --sub-class ${testSubClass}`);
    const resultArr: ITwin[] = JSON.parse(result.stdout);

    expect(resultArr).to.be.an('array').that.is.not.empty;
    expect(resultArr.some(itwin => itwin.id === testITwinId)).to.be.true;
    expect(resultArr.some(itwin => itwin.id === testITwinId2)).to.be.true;
    expect(resultArr.some(itwin => itwin.id === testITwinChildId)).to.be.false;
  });

  it('should list all created itwins', async () => {
    const result = await runCommand(`itwin list --sub-class ${testSubClass} --include-inactive --itwin-account-id ${testITwinAccountId}`);
    const resultArr: ITwin[] = JSON.parse(result.stdout);

    expect(resultArr).to.be.an('array').that.is.not.empty;
    expect(resultArr.some(itwin => itwin.id === testITwinId)).to.be.true;
    expect(resultArr.some(itwin => itwin.id === testITwinId2)).to.be.true;
    expect(resultArr.some(itwin => itwin.id === testITwinChildId)).to.be.true;
  });

  it('should list no itwins when provided invalid itwin account id', async () => {
    const result = await runCommand(`itwin list --sub-class ${testSubClass} --include-inactive --itwin-account-id ${crypto.randomUUID()}`);
    const resultArr: ITwin[] = JSON.parse(result.stdout);

    expect(resultArr).to.be.an('array').that.is.empty;
  });

  it('should list itwin by display name', async () => {
    const result = await runCommand(`itwin list --sub-class ${testSubClass} --name ${testITwinName2}`);
    const resultArr: ITwin[] = JSON.parse(result.stdout);

    expect(resultArr).to.be.an('array').that.is.not.empty;
    expect(resultArr.some(itwin => itwin.id === testITwinId)).to.be.false;
    expect(resultArr.some(itwin => itwin.id === testITwinId2)).to.be.true;
    expect(resultArr.some(itwin => itwin.id === testITwinChildId)).to.be.false;
  });


  it('should list itwin by type and number', async () => {
    const result = await runCommand(`itwin list --sub-class ${testSubClass} --include-inactive --type ${testType} --number ${testNumber}`);
    const resultArr: ITwin[] = JSON.parse(result.stdout);

    expect(resultArr).to.be.an('array').that.is.not.empty;
    expect(resultArr.some(itwin => itwin.id === testITwinId)).to.be.true;
    expect(resultArr.some(itwin => itwin.id === testITwinId2)).to.be.false;
    expect(resultArr.some(itwin => itwin.id === testITwinChildId)).to.be.false;
  });

  it('should list itwin by parent and status', async () => {
    const result = await runCommand(`itwin list --sub-class ${testSubClass} --parent-id ${testITwinId} --status ${testStatus}`);
    const resultArr: ITwin[] = JSON.parse(result.stdout);

    expect(resultArr).to.be.an('array').that.is.not.empty;
    expect(resultArr.some(itwin => itwin.id === testITwinId)).to.be.false;
    expect(resultArr.some(itwin => itwin.id === testITwinId2)).to.be.false;
    expect(resultArr.some(itwin => itwin.id === testITwinChildId)).to.be.true;
  });

  it('should search for itwins by number', async () => {
    const result = await runCommand(`itwin list --sub-class ${testSubClass} --search ${testNumber.slice(2, 4)}`);
    const resultArr: ITwin[] = JSON.parse(result.stdout);

    expect(resultArr).to.be.an('array').that.is.not.empty;
    expect(resultArr.some(itwin => itwin.id === testITwinId)).to.be.true;
    expect(resultArr.some(itwin => itwin.id === testITwinId2)).to.be.false;
    expect(resultArr.some(itwin => itwin.id === testITwinChildId)).to.be.false;
  });

  it('should search for itwins by display name', async () => {
    const result = await runCommand(`itwin list --sub-class ${testSubClass} --search ${testITwinName2}`);
    const resultArr: ITwin[] = JSON.parse(result.stdout);

    expect(resultArr).to.be.an('array').that.is.not.empty;
    expect(resultArr.some(itwin => itwin.id === testITwinId)).to.be.false;
    expect(resultArr.some(itwin => itwin.id === testITwinId2)).to.be.true;
    expect(resultArr.some(itwin => itwin.id === testITwinChildId)).to.be.false;
  });

  it('should list itwins with skip/top', async () => {
    const result = await runCommand(`itwin list --include-inactive`);
    const itwinIds: string[] = (JSON.parse(result.stdout) as ITwin[]).map(itwin => itwin.id!);
    expect(itwinIds).to.be.an('array').that.is.not.empty;

    const resultFiltered = await runCommand(`itwin list --include-inactive --skip 1 --top 2`);
    const filteredITwinIds = (JSON.parse(resultFiltered.stdout) as ITwin[]).map(itwin => itwin.id);
    expect(filteredITwinIds).to.be.an('array').that.is.not.empty;
    expect(filteredITwinIds.toString()).to.be.equal(itwinIds.slice(1, 3).toString())
  });

  it('should delete the child iTwin', async () => {
    const result = await runCommand(`itwin delete --itwin-id ${testITwinChildId}`);
    const deleteResult = JSON.parse(result.stdout);
    expect(deleteResult).to.have.property('result', 'deleted');

    const itwinChildResult = await runCommand(`itwin info --itwin-id ${testITwinChildId}`);
    expect(itwinChildResult.error).to.be.not.undefined;
    expect(itwinChildResult.error!.message).to.include('iTwinNotFound');
  });

  it('should delete the iTwin #1', async () => {
    const result = await runCommand(`itwin delete --itwin-id ${testITwinId}`);
    const deleteResult = JSON.parse(result.stdout);
    expect(deleteResult).to.have.property('result', 'deleted');

    const itwinResult = await runCommand(`itwin info --itwin-id ${testITwinId}`);
    expect(itwinResult.error).to.be.not.undefined;
    expect(itwinResult.error!.message).to.include('iTwinNotFound');
  });

  it('should delete the iTwin #2', async () => {
    const result = await runCommand(`itwin delete --itwin-id ${testITwinId2}`);
    const deleteResult = JSON.parse(result.stdout);
    expect(deleteResult).to.have.property('result', 'deleted');

    const itwinResult = await runCommand(`itwin info --itwin-id ${testITwinId2}`);
    expect(itwinResult.error).to.be.not.undefined;
    expect(itwinResult.error!.message).to.include('iTwinNotFound');
  });
});

export default tests;