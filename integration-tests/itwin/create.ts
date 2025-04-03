/*---------------------------------------------------------------------------------------------
* Copyright (c) Bentley Systems, Incorporated. All rights reserved.
* See LICENSE.md in the project root for license terms and full copyright notice.
*--------------------------------------------------------------------------------------------*/

import { ITwin } from "@itwin/itwins-client";
import { runCommand } from '@oclif/test';
import { expect } from 'chai';

import { deleteITwin } from "../utils/helpers";

const tests = () => describe('create', () => {
  let testITwinId: string;
  let testITwinId2: string;
  let testITwinChildId: string;
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

  after(async () => {
    await deleteITwin(testITwinChildId);
    await deleteITwin(testITwinId);
    await deleteITwin(testITwinId2)
  })

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
});

export default tests;