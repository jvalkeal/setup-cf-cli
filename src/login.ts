import * as core from '@actions/core';
import {exec} from '@actions/exec';

export async function login(
  apiEnv: string,
  orgEnv: string,
  spaceEnv: string,
  usernameEnv: string,
  passwordEnv: string
): Promise<void> {
  let api = '';
  let org = '';
  let space = '';
  let username = '';
  let password = '';

  if (process.env[apiEnv]) {
    api = process.env[apiEnv] || '';
  } else {
    throw new Error(`Env ${apiEnv} not found and needed for cf login`);
  }

  if (process.env[orgEnv]) {
    org = process.env[orgEnv] || '';
  } else {
    throw new Error(`Env ${orgEnv} not found and needed for cf login`);
  }

  if (process.env[spaceEnv]) {
    space = process.env[spaceEnv] || '';
  } else {
    throw new Error(`Env ${spaceEnv} not found and needed for cf login`);
  }

  if (process.env[usernameEnv]) {
    username = process.env[usernameEnv] || '';
  } else {
    throw new Error(`Env ${usernameEnv} not found and needed for cf login`);
  }

  if (process.env[passwordEnv]) {
    password = process.env[passwordEnv] || '';
  } else {
    throw new Error(`Env ${passwordEnv} not found and needed for cf login`);
  }

  await runCli('cf', [
    'login',
    '-a',
    api,
    '-u',
    username,
    '-o',
    org,
    '-s',
    space,
    '-p',
    password
  ]);
}

async function runCli(cliPath: string, args: string[] | undefined) {
  let res: number = await exec(cliPath, args);
  if (res !== core.ExitCode.Success) {
    throw new Error('CF CLI exited with exit code ' + res);
  }
}
