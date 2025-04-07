/*---------------------------------------------------------------------------------------------
* Copyright (c) Bentley Systems, Incorporated. All rights reserved.
* See LICENSE.md in the project root for license terms and full copyright notice.
*--------------------------------------------------------------------------------------------*/

import { IModel } from "@itwin/imodels-client-management"
import { ITwin } from "@itwin/itwins-client";
import { runCommand } from "@oclif/test";
import { expect } from "chai";

import { fileTyped } from "../../src/services/storage-client/models/file-typed.js";
import { fileUpload } from "../../src/services/storage-client/models/file-upload.js";
import { folderTyped } from "../../src/services/storage-client/models/folder-typed.js";
import { itemsWithFolderLink } from "../../src/services/storage-client/models/items-with-folder-link.js";

export async function loginToCli() {
    const result = await runCommand('auth login');
    expect(result.stdout).to.contain('User successfully logged in using Service login');
}

export async function createFile(folderId: string, displayName: string, filePath: string, description?: string): Promise<fileTyped> {
    // 1. Create meta data
    const {result: createdFile} = await runCommand<fileUpload>(`storage file create --folder-id ${folderId} --name "${displayName}" --description "${description}"`);

    expect(createdFile).to.have.property('_links');
    expect(createdFile!._links).to.have.property('completeUrl');
    expect(createdFile!._links).to.have.property('uploadUrl');

    const uploadUrl = createdFile!._links!.uploadUrl!.href;

    // extract file id from completeUrl that looks like this: "https://api.bentley.com/storage/files/TYJsPN0xtkWId0yUrXkS5pN5AQzuullIkxz5aDnDJSI/complete"
    const completeUrl = createdFile!._links!.completeUrl!.href;
    const fileId = completeUrl!.split('/').at(-2);

    // 2. Upload file
    const uploadResult = await runCommand(`storage file upload --upload-url "${uploadUrl}" --file-path ${filePath}`);
    const uploadedFile = JSON.parse(uploadResult.stdout);

    expect(uploadedFile).to.have.property('result', 'uploaded');

    // 3. Confirm upload complete
    const {result: completedFile} = await runCommand<fileTyped>(`storage file update-complete --file-id ${fileId}`)

    expect(completedFile).to.not.be.undefined;
    expect(completedFile).to.have.property('id', fileId);

    return completedFile as fileTyped;
}

export async function createFolder(parentFolderId: string, displayName: string, description?: string): Promise<folderTyped> {
    const { result: createdFolder } = await runCommand<folderTyped>(`storage folder create --parent-folder-id ${parentFolderId} --name "${displayName}" --description "${description}"`);
   
    expect(createdFolder).to.not.be.undefined;
    expect(createdFolder!.type).to.be.equal('folder');
    expect(createdFolder!.displayName).to.be.equal(displayName);
    expect(createdFolder!.parentFolderId).to.be.equal(parentFolderId);
    return createdFolder as folderTyped;
}

export async function createITwin(displayName: string, classType: string, subClassType: string): Promise<ITwin> {
    const { result: createdITwin } = await runCommand<ITwin>(`itwin create --name "${displayName}" --class ${classType} --sub-class ${subClassType}`);
    
    expect(createdITwin).to.not.be.undefined;
    expect(createdITwin).to.have.property('id');
    return createdITwin as ITwin;
}

export async function createIModel(name: string, iTwinId: string): Promise<IModel> {
    const { result: createdIModel} = await runCommand<IModel>(`imodel create --itwin-id ${iTwinId} --name "${name}"`);
    
    expect(createdIModel).to.not.be.undefined;
    expect(createdIModel).to.have.property('id');
    return createdIModel as IModel;
}

export async function deleteFile(fileId: string): Promise<void> {
    const result = await runCommand(`storage file delete --file-id ${fileId}`);
    const deleteResult = JSON.parse(result.stdout);
    expect(deleteResult).to.have.property('result', 'deleted');
}

export async function deleteFolder(folderId: string): Promise<void> {
    const result = await runCommand(`storage folder delete --folder-id ${folderId}`);
    const deleteResult = JSON.parse(result.stdout);
    expect(deleteResult).to.have.property('result', 'deleted');
}

export async function deleteITwin(id: string): Promise<void> {
    const result = await runCommand(`itwin delete --itwin-id ${id}`);
    const deleteResult = JSON.parse(result.stdout);
    expect(deleteResult).to.have.property('result', 'deleted');
}

export async function deleteIModel(id: string): Promise<void> {
    const result = await runCommand(`imodel delete --imodel-id ${id}`);
    const deleteResult = JSON.parse(result.stdout);
    expect(deleteResult).to.have.property('result', 'deleted');
}

export async function getRootFolderId(iTwinId: string): Promise<string> {
    const { result: topFolders } = await runCommand<itemsWithFolderLink>(`storage root-folder --itwin-id ${iTwinId}`);
    const rootFolderId = topFolders?._links?.folder?.href?.split('/').pop();

    expect(rootFolderId).to.not.be.undefined;
    return rootFolderId as string;
}