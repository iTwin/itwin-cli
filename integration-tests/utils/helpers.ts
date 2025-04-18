/*---------------------------------------------------------------------------------------------
* Copyright (c) Bentley Systems, Incorporated. All rights reserved.
* See LICENSE.md in the project root for license terms and full copyright notice.
*--------------------------------------------------------------------------------------------*/

import { IModel } from "@itwin/imodels-client-management"
import { ITwin } from "@itwin/itwins-client";
import { TestBrowserAuthorizationClientConfiguration, TestUserCredentials, getTestAccessToken } from "@itwin/oidc-signin-tool";
import { runCommand } from "@oclif/test";
import { expect } from "chai";
import * as dotenv from 'dotenv';
import { GetInboxRequest, GetMessageRequest, MailinatorClient } from 'mailinator-client'
import fs from "node:fs"
import os from 'node:os'

import { fileTyped } from "../../src/services/storage-client/models/file-typed.js";
import { fileUpload } from "../../src/services/storage-client/models/file-upload.js";
import { folderTyped } from "../../src/services/storage-client/models/folder-typed.js";
import { itemsWithFolderLink } from "../../src/services/storage-client/models/items-with-folder-link.js";

export async function serviceLoginToCli() {
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

/**
 * Fetches emails from the specified inbox and then finds and returns the invitation link for iTwinName iTwin.
 * NOTE: This function only works for `@bentley.m8r.co` email addresses and not `@be-mailinator.eastus.cloudapp.azure.com` email addresses.
 * @param inbox Inbox to fetch the invitation email from.
 * @param iTwinName Name of the iTwin.
 * @returns Invitation link for joining the iTwin.
 */
export async function fetchEmailsAndGetInvitationLink(inbox: string, iTwinName: string): Promise<string> {
    await new Promise<void>(resolve => {setTimeout(_ => resolve(), 45 * 1000);});

    expect(process.env.ITP_MAILINATOR_API_KEY).to.not.be.undefined;

    const client = new MailinatorClient(process.env.ITP_MAILINATOR_API_KEY!);
    const inboxResponse = await client.request(new GetInboxRequest("private", inbox, undefined, 10));
    expect(inboxResponse.result).to.not.be.null;

    for (let i = 0; i < inboxResponse.result!.msgs.length; i++) {
        if (inboxResponse.result!.msgs[i].subject !== "You have been invited to collaborate")
            continue;
        
        // eslint-disable-next-line no-await-in-loop
        const messageResponse = await client.request(new GetMessageRequest("private", inboxResponse.result!.msgs[i].id ));
        expect(messageResponse.result).to.not.be.null;
        const messageBody = messageResponse.result!.parts[0].body;
        if (!messageBody.includes(iTwinName))
            continue;

        const invitationTokenRegex = /href=".*?invitationToken.*?"/;
        const matches = messageBody.match(invitationTokenRegex);
        expect(matches).to.not.be.null;
        expect(matches!.length).to.be.equal(1);
        return matches![0].slice("href=\"".length, -1);
    }

    throw new Error("Email was not found in inbox.")
}

export async function nativeLoginToCli() {
    if(isNativeAuthAccessTokenCached())
        return;

    const authTokenObject = {
        authToken: await getNativeAuthAccessToken(),
        authenticationType: "Interactive",
        expirationDate: new Date(Date.now() + 1000 * 60 * 59),
        manuallyWritten: true
    }
    
    fs.writeFileSync(getTokenPathByOS(), JSON.stringify(authTokenObject), 'utf8');
}

export function nativeLogoutFromCli() {
    if(isNativeAuthAccessTokenCached()) {
        fs.rmSync(getTokenPathByOS());
    }
}

const getNativeAuthAccessToken = async (): Promise<string> => {
    dotenv.config({path: '.env'});
    expect(process.env.ITP_NATIVE_TEST_CLIENT_ID, "ITP_NATIVE_TEST_CLIENT_ID").to.not.be.undefined;
    expect(process.env.ITP_ISSUER_URL, "ITP_ISSUER_URL").to.not.be.undefined;
    const config: TestBrowserAuthorizationClientConfiguration = {
        authority: process.env.ITP_ISSUER_URL!,
        clientId: process.env.ITP_NATIVE_TEST_CLIENT_ID!,
        redirectUri: "http://localhost:3301/signin-callback",
        scope: "itwin-platform",
    }

    expect(process.env.ITP_TEST_USER_EMAIL, "ITP_TEST_USER_EMAIL").to.not.be.undefined;
    expect(process.env.ITP_TEST_USER_PASSWORD, "ITP_TEST_USER_PASSWORD").to.not.be.undefined;
    const user: TestUserCredentials = {
        email: process.env.ITP_TEST_USER_EMAIL!,
        password: process.env.ITP_TEST_USER_PASSWORD!
    }

    const accessToken = await getTestAccessToken(config, user);
    expect(accessToken, "Access token").to.not.be.undefined;
    return accessToken!;
} 

const isNativeAuthAccessTokenCached = ():boolean => {
    const tokenPath = getTokenPathByOS();
    if(fs.existsSync(tokenPath)) {
        const tokenJson = fs.readFileSync(tokenPath, 'utf8');
        const tokenObj = JSON.parse(tokenJson);
        if (tokenObj.manuallyWritten !== undefined && new Date(tokenObj.expirationDate).getTime() > Date.now())
            return true;
    }

    return false;
}

const getTokenPathByOS = () => {
    switch (os.type()) {
        case 'Darwin': {
            return "~/Library/Caches/itp/token.json"
        }

        case 'Linux': {
            return "~/.config/itp/token.json"
        }
        
        case 'Windows_NT': {
            return `${process.env.LOCALAPPDATA}/itp/token.json`
        }

        default: {
            throw new Error("Unknown OS");
        }
    }
}