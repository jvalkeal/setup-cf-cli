import io = require('@actions/io');
import fs = require('fs');
import path = require('path');
import child_process = require('child_process');

const toolDir = path.join(__dirname, 'runner', 'tools');
const tempDir = path.join(__dirname, 'runner', 'temp');
const cliDir = path.join(__dirname, 'runner', 'cli');

process.env['RUNNER_TOOL_CACHE'] = toolDir;
process.env['RUNNER_TEMP'] = tempDir;
import * as installer from '../src/installer';

let cliFilePath = '';
let cliUrl = '';
if (process.platform === 'win32') {
  cliFilePath = path.join(cliDir, 'cli_win.zip');
  cliUrl =
    'https://packages.cloudfoundry.org/stable?release=windows64-exe&source=github';
} else if (process.platform === 'darwin') {
  cliFilePath = path.join(cliDir, 'cli_mac.tar.gz');
  cliUrl =
    'https://packages.cloudfoundry.org/stable?release=macosx64-binary&source=github';
} else {
  cliFilePath = path.join(cliDir, 'cli_linux.tar.gz');
  cliUrl =
    'https://packages.cloudfoundry.org/stable?release=linux64-binary&source=github';
}

describe('maven installer tests', () => {
  beforeAll(async () => {
    await io.rmRF(toolDir);
    await io.rmRF(tempDir);
    await io.rmRF(cliDir);
    if (!fs.existsSync(`${cliFilePath}.complete`)) {
      // Download cli
      await io.mkdirP(cliDir);

      console.log('Downloading cli');
      child_process.execSync(`curl "${cliUrl}" > "${cliFilePath}"`);
      // Write complete file so we know it was successful
      fs.writeFileSync(`${cliFilePath}.complete`, 'content');
    }
  }, 300000);

  afterAll(async () => {
    try {
      await io.rmRF(toolDir);
      await io.rmRF(tempDir);
      await io.rmRF(cliDir);
    } catch {
      console.log('Failed to remove test directories');
    }
  }, 100000);

  it('Downloads latest cli without version given', async () => {
    await installer.getCli('6.51.0', 'linux64');
    const cliDir = path.join(toolDir, 'cloudfoundry-cli', '6.51.0', 'x64');

    expect(fs.existsSync(`${cliDir}.complete`)).toBe(true);
    expect(fs.existsSync(path.join(cliDir, 'cf'))).toBe(true);
  }, 100000);


});
