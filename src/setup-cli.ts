import * as core from '@actions/core';
import * as installer from './installer';
import {setupPlugins} from './setup-plugins';

async function run() {
  try {
    let version = core.getInput('version', {required: true});
    await installer.getCli(version);

    const plugins = core.getInput('plugins', {required: false});
    const pluginRepo = core.getInput('plugin-repo', {required: false});
    const pluginId = core.getInput('plugin-id', {required: false});
    await setupPlugins(plugins, pluginRepo, pluginId);
  } catch (error) {
    core.setFailed(error.message);
  }
}

run();
