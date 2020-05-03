import * as core from '@actions/core';
import * as installer from './installer';

async function run() {
  try {
    let version = core.getInput('version', {required: true});
    const arch = core.getInput('architecture', {required: true});
    await installer.getCli(version, arch);
  } catch (error) {
    core.setFailed(error.message);
  }
}

run();
