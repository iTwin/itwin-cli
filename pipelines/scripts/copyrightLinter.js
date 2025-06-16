/*---------------------------------------------------------------------------------------------
 * Copyright (c) Bentley Systems, Incorporated. All rights reserved.
 * See LICENSE.md in the project root for license terms and full copyright notice.
 *--------------------------------------------------------------------------------------------*/

import console from "node:console";
import fs from "node:fs";
import fg from "fast-glob";
import process from "node:process";

let pattern = process.argv.slice(2).flatMap((x) => (x !== "--fix" ? x.replaceAll("\\", "/") : []));

// if no pattern is specified, then lint everything
if (pattern.length === 0) {
  pattern = "**/*.{ts,js}";
}

const filePaths = fg.sync(pattern, {
  dot: true,
  ignore: ["**/node_modules/**/*", "**/dist/**/*", "**/tmp/**/*", "bin/**/*"],
});

const copyrightLine1 = `Copyright (c) Bentley Systems, Incorporated. All rights reserved.`;
const copyrightLine2 = `See LICENSE.md in the project root for license terms and full copyright notice.`;

export const copyrightBannerScss = `// ${copyrightLine1}\n// ${copyrightLine2}`;
export const copyrightBannerHtml = `<!--\n  ${copyrightLine1}\n  ${copyrightLine2}\n-->`;
export const copyrightBannerJs =
  "/*---------------------------------------------------------------------------------------------\n" +
  ` * ${copyrightLine1}\n` +
  ` * ${copyrightLine2}\n` +
  " *--------------------------------------------------------------------------------------------*/\n";

if (filePaths) {
  filePaths.forEach((filePath) => {
    const fileContent = fs.readFileSync(filePath, { encoding: "utf8" });
    if (!fileContent.includes(copyrightLine1) && !fileContent.includes(copyrightLine2)) {
      if (process.argv.includes("--fix")) {
        switch (filePath.substring(filePath.lastIndexOf("."))) {
          case ".js":
          case ".ts":
          case ".css":
            if (fileContent.startsWith("@charset")) {
              // @charset must be the first line in the file so insert the copyright banner after it
              fs.writeFileSync(filePath, fileContent.replace('@charset "UTF-8";', `@charset "UTF-8";\n${copyrightBannerJs}`));
            } else {
              fs.writeFileSync(filePath, `${copyrightBannerJs}\n${fileContent}`);
            }
            break;
          case ".html":
            fs.writeFileSync(filePath, `${copyrightBannerHtml}\n${fileContent}`);
            break;
          case ".scss":
            fs.writeFileSync(filePath, `${copyrightBannerScss}\n${fileContent}`);
            break;
        }
      } else {
        process.exitCode = 1;
        console.log(`copyrightLinter.js failed at ${filePath}`);
      }
    }
  });
}

if (process.exitCode === 1) {
  console.log("\nRun 'npm run lint:copyright:fix' to fix the issues.");
}
