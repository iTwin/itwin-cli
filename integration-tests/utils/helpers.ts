/*---------------------------------------------------------------------------------------------
* Copyright (c) Bentley Systems, Incorporated. All rights reserved.
* See LICENSE.md in the project root for license terms and full copyright notice.
*--------------------------------------------------------------------------------------------*/

import { runCommand } from "@oclif/test";
import { expect } from "chai";

export async function loginToCli() {
    const result = await runCommand('auth login');
    expect(result.stdout).to.contain('User successfully logged in using Service login');
}

export async function createFile(folderId: string, displayName: string, filePath: string, description?: string) {
    // 1. Create meta data
    const createResult = await runCommand(`storage file create --folder-id ${folderId} --name "${displayName}" --description "${description}"`);
    const createdFile = JSON.parse(createResult.stdout);

    expect(createdFile).to.have.property('_links');
    expect(createdFile._links).to.have.property('completeUrl');
    expect(createdFile._links).to.have.property('uploadUrl');

    const uploadUrl = createdFile._links.uploadUrl.href;

    // extract file id from completeUrl that looks like this: "https://api.bentley.com/storage/files/TYJsPN0xtkWId0yUrXkS5pN5AQzuullIkxz5aDnDJSI/complete"
    const completeUrl = createdFile._links.completeUrl.href;
    const fileId = completeUrl.split('/').at(-2);

    // 2. Upload file
    const uploadResult = await runCommand(`storage file upload --upload-url "${uploadUrl}" --file-path ${filePath}`);
    const uploadedFile = JSON.parse(uploadResult.stdout);

    expect(uploadedFile).to.have.property('result', 'uploaded');

    // 3. Confirm upload complete
    const completeResult = await runCommand(`storage file update-complete --file-id ${fileId}`)
    const completedFile = JSON.parse(completeResult.stdout);

    expect(completedFile).to.have.property('id', fileId);

    return completedFile;
}

export async function createFolder(parentFolderId: string, displayName: string, description?: string) {
    const result = await runCommand(`storage folder create --parent-folder-id ${parentFolderId} --name "${displayName}" --description "${description}"`);
    const createdFolder = JSON.parse(result.stdout);
    expect(createdFolder).to.have.property('type', 'folder');
    expect(createdFolder).to.have.property('displayName', displayName);
    expect(createdFolder).to.have.property('parentFolderId', parentFolderId);
    return createdFolder;
}

export async function createITwin(displayName: string, classType: string, subClassType: string) {
    const result = await runCommand(`itwin create --name "${displayName}" --class ${classType} --sub-class ${subClassType}`);
    const createdITwin = JSON.parse(result.stdout);
    expect(createdITwin).to.have.property('id');
    return createdITwin;
}

export async function createIModel(name: string, iTwinId: string) {
    const result = await runCommand(`imodel create --itwin-id ${iTwinId} --name "${name}"`);
    const createdIModel = JSON.parse(result.stdout);
    expect(createdIModel).to.have.property('id');
    return createdIModel;
}

export async function deleteFile(fileId: string) {
    const result = await runCommand(`storage file delete --file-id ${fileId}`);
    const deleteResult = JSON.parse(result.stdout);
    expect(deleteResult).to.have.property('result', 'deleted');
}

export async function deleteFolder(folderId: string) {
    const result = await runCommand(`storage folder delete --folder-id ${folderId}`);
    const deleteResult = JSON.parse(result.stdout);
    expect(deleteResult).to.have.property('result', 'deleted');
}

export async function deleteITwin(id: string) {
    const result = await runCommand(`itwin delete --itwin-id ${id}`);
    const deleteResult = JSON.parse(result.stdout);
    expect(deleteResult).to.have.property('result', 'deleted');
}

export async function deleteIModel(id: string) {
    const result = await runCommand(`imodel delete --imodel-id ${id}`);
    const deleteResult = JSON.parse(result.stdout);
    expect(deleteResult).to.have.property('result', 'deleted');
}

export async function getRootFolderId(iTwinId: string) {
    const { stdout } = await runCommand(`storage root-folder --itwin-id ${iTwinId}`);
    const topFolders = JSON.parse(stdout);
    const rootFolderId = topFolders?._links?.folder?.href?.split('/').pop();
    return rootFolderId;
}