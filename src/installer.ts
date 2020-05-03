let tempDirectory = process.env['RUNNER_TEMP'] || '';

import * as core from '@actions/core';
import * as io from '@actions/io';
import * as exec from '@actions/exec';
import * as httpm from '@actions/http-client';
import * as tc from '@actions/tool-cache';
import * as fs from 'fs';
import * as path from 'path';
import * as semver from 'semver';

const IS_WINDOWS = process.platform === 'win32';

if (!tempDirectory) {
  let baseLocation;
  if (IS_WINDOWS) {
    // On windows use the USERPROFILE env variable
    baseLocation = process.env['USERPROFILE'] || 'C:\\';
  } else {
    if (process.platform === 'darwin') {
      baseLocation = '/Users';
    } else {
      baseLocation = '/home';
    }
  }
  tempDirectory = path.join(baseLocation, 'actions', 'temp');
}

export async function getCli(version: string, arch: string): Promise<void> {
  const toolName = 'cloudfoundry-cli';
  let toolPath = tc.find(toolName, version);

  if (toolPath) {
    core.debug(`Tool found in cache ${toolPath}`);
  } else {
    core.debug('Downloading CLI from packages.cloudfoundry.org');

    const downloadInfo = getDownloadInfo(
      version,
      arch,
      'packages.cloudfoundry.org'
    );
    core.debug(`DownloadInfo ${downloadInfo.version} ${downloadInfo.url}`);

    const cliFile = await tc.downloadTool(downloadInfo.url);
    core.debug(`cliFile ${cliFile}`);
    const cliVersion = downloadInfo.version;
    const compressedFileExtension = IS_WINDOWS ? '.zip' : '.tgz';

    let tempDir: string = path.join(
      tempDirectory,
      'temp_' + Math.floor(Math.random() * 2000000000)
    );
    core.debug(`tempDir ${tempDir}`);

    const cliDir = await unzipCliDownload(
      cliFile,
      compressedFileExtension,
      tempDir
    );
    core.debug(`cli extracted to ${cliDir}`);
    toolPath = await tc.cacheDir(
      cliDir,
      toolName,
      getCacheVersionString(cliVersion)
    );
  }
  core.addPath(toolPath);
}

function getCacheVersionString(version: string) {
  const versionArray = version.split('.');
  const major = versionArray[0];
  const minor = versionArray.length > 1 ? versionArray[1] : '0';
  const patch = versionArray.length > 2 ? versionArray[2] : '0';
  return `${major}.${minor}.${patch}`;
}

function getFileEnding(file: string): string {
  let fileEnding = '';

  if (file.endsWith('.tgz')) {
    fileEnding = '.tgz';
  } else if (file.endsWith('.zip')) {
    fileEnding = '.zip';
  } else {
    throw new Error(`${file} has an unsupported file extension`);
  }

  return fileEnding;
}

async function extractFiles(
  file: string,
  fileEnding: string,
  destinationFolder: string
): Promise<void> {
  const stats = fs.statSync(file);
  if (!stats) {
    throw new Error(`Failed to extract ${file} - it doesn't exist`);
  } else if (stats.isDirectory()) {
    throw new Error(`Failed to extract ${file} - it is a directory`);
  }

  if ('.tgz' === fileEnding) {
    await tc.extractTar(file, destinationFolder);
  } else if ('.zip' === fileEnding) {
    await tc.extractZip(file, destinationFolder);
  } else {
    throw new Error(`Failed to extract ${file} - only .zip or .tgz supported`);
  }
}

async function unzipCliDownload(
  repoRoot: string,
  fileEnding: string,
  destinationFolder: string
): Promise<string> {
  // Create the destination folder if it doesn't exist
  await io.mkdirP(destinationFolder);

  const cliFile = path.normalize(repoRoot);
  const stats = fs.statSync(cliFile);
  if (stats.isFile()) {
    await extractFiles(path.resolve(cliFile), fileEnding, destinationFolder);
    return destinationFolder;
  } else {
    throw new Error(`CLI argument ${cliFile} is not a file`);
  }
}

function getDownloadInfo(
  version: string,
  arch: string,
  server: string
): {version: string; url: string} {
  // https://packages.cloudfoundry.org/stable?release=windows64-exe&source=github
  // https://packages.cloudfoundry.org/stable?release=macosx64-binary&source=github
  // https://packages.cloudfoundry.org/stable?release=linux64-binary&source=github

  // https://packages.cloudfoundry.org/stable?release=linux64-binary&version=6.51.0&source=github-rel
  // https://packages.cloudfoundry.org/stable?release=linux32-binary&version=6.51.0&source=github-rel
  // https://packages.cloudfoundry.org/stable?release=macosx64-binary&version=6.51.0&source=github-rel
  // https://packages.cloudfoundry.org/stable?release=windows64-exe&version=6.51.0&source=github-rel
  // https://packages.cloudfoundry.org/stable?release=windows32-exe&version=6.51.0&source=github-rel

  const release = arch === 'windows64' ? '-exe' : '-binary';
  let curUrl = `https://${server}/stable?source=github&release=${arch}${release}`;
  if (version) {
    curUrl = curUrl + `&version=${version}`;
  }
  return {version: version, url: curUrl};
}
