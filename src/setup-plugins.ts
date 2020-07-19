import * as core from '@actions/core';
import {exec} from '@actions/exec';

export async function setupPlugins(
  pluginsJson: string,
  repo: string,
  id: string
): Promise<void> {
  const config = parse(pluginsJson, repo, id);
  config.plugins.forEach(async plugin => {
    await runCli('cf', ['add-plugin-repo', plugin.repo, plugin.repo]);
    await runCli('cf', ['install-plugin', '-r', plugin.repo, plugin.id, '-f']);
  });
}

export function parse(
  pluginsJson: string | undefined,
  repo: string | undefined,
  id: string | undefined
): PluginsConfig {
  let plugins: Plugin[] = [];
  if (pluginsJson) {
    plugins = JSON.parse(pluginsJson);
  }
  if (repo && id) {
    plugins.push({repo, id});
  }
  return {plugins};
}

export interface Plugin {
  repo: string;
  id: string;
}

export interface PluginsConfig {
  plugins: Plugin[];
}

async function runCli(cliPath: string, args: string[] | undefined) {
  let res: number = await exec(cliPath, args);
  if (res !== core.ExitCode.Success) {
    throw new Error('CF CLI exited with exit code ' + res);
  }
}
