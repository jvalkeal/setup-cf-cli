import * as core from '@actions/core';
import * as installer from './installer';
import {setupPlugins} from './setup-plugins';
import {login} from './login';

async function run() {
  try {
    let version = core.getInput('version', {required: true});
    await installer.getCli(version);

    const plugins = core.getInput('plugins', {required: false});
    const pluginRepo = core.getInput('plugin-repo', {required: false});
    const pluginId = core.getInput('plugin-id', {required: false});
    await setupPlugins(plugins, pluginRepo, pluginId);

    const doLogin = core.getInput('login', {required: false}) === 'true';
    if (doLogin) {
      const apiEnv = core.getInput('login-api', {required: false}) || 'CF_API';
      const orgEnv = core.getInput('login-org', {required: false}) || 'CF_ORG';
      const spaceEnv =
        core.getInput('login-space', {required: false}) || 'CF_SPACE';
      const usernameEnv =
        core.getInput('login-username', {required: false}) || 'CF_USERNAME';
      const passwordEnv =
        core.getInput('login-password', {required: false}) || 'CF_PASSWORD';
      await login(apiEnv, orgEnv, spaceEnv, usernameEnv, passwordEnv);
    }
  } catch (error) {
    core.setFailed(error.message);
  }
}

run();
