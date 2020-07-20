# setup-cf-cli

<p align="left">
  <a href="https://github.com/jvalkeal/setup-cf-cli"><img alt="GitHub Actions status" src="https://github.com/jvalkeal/setup-cf-cli/workflows/Main%20workflow/badge.svg"></a>
</p>

GitHub Action to install and setup a [Cloudfoundry CLI](https://github.com/cloudfoundry/cli)
to get used with action workflows.

# Usage

See [action.yml](action.yml)

## Basic
```yaml
steps:
- uses: actions/checkout@v2
- uses: jvalkeal/setup-cf-cli@v0
  with:
    version: 6.51.0 # The CLI version to make available on the path.
```

## Login

**NOTE**
Not yet release, available only from _main_.

You need to store environment settings in a GitHub secrets,
GitHub will then make sure that none of these secrets are exposed
to publicly visible logs.

There's an embedded functionality to run login command which is disabled
on default. It's expected that _api_, _org_, _space_, _username_ and
_password_ are available as an environment variable. Below config
should default values.

```yaml
steps:
- name: Set up CF CLI
  uses: jvalkeal/setup-cf-cli@v0
  with:
    version: 6.51.0
    login: false
    login-api: CF_API
    login-org: CF_ORG
    login-space: CF_SPACE
    login-username: CF_USERNAME
    login-password: CF_PASSWORD
```

By just setting _login_ to _true_ would work nicely if env variables are
mapped from secrects like this:

```yaml
env:
  CF_API: ${{ secrets.CF_API }}
  CF_ORG: ${{ secrets.CF_ORG }}
  CF_SPACE: ${{ secrets.CF_SPACE }}
  CF_USERNAME: ${{ secrets.CF_USERNAME }}
  CF_PASSWORD: ${{ secrets.CF_PASSWORD }}
```

If a way actions does a login is not suitable, you can always do it
manually by doing something like:

```yaml
steps:
- name: Set up CF CLI
  uses: jvalkeal/setup-cf-cli@v0
  with:
    version: 6.51.0
- name: CF Login
  run: cf login -a $CF_API -u $CF_USERNAME -o $CF_ORG -s $CF_SPACE -p $CF_PASSWORD
  env:
    CF_API: ${{ secrets.CF_API }}
    CF_ORG: ${{ secrets.CF_ORG }}
    CF_SPACE: ${{ secrets.CF_SPACE }}
    CF_USERNAME: ${{ secrets.CF_USERNAME }}
    CF_PASSWORD: ${{ secrets.CF_PASSWORD }}
```


## Plugins

**NOTE**
Not yet release, available only from _main_.

It's possible to install plugins by defining its existense with a plugin repository.
If you only need to install one plugin, use `plugin-repo` and `plugin-id`, otherwise
if a need for multiple repos and plugins, define `plugins` which takes a json format.

```yaml
steps:
- uses: jvalkeal/setup-cf-cli@main
  with:
    plugins: |
      [
        {repo:"https://plugins.cloudfoundry.org", id:"blue-green-deploy"}
      ]
    plugin-repo: https://plugins.cloudfoundry.org
    plugin-id: blue-green-deploy
```

# Versions

Versions are released as a git tags. We're currenly on a pre-release stage so
current _0.x_ series can be found under tag _v0_ which will always be a same
as latest within _0.x_ like _v0.0.1_.

**NOTE:** While not recommended you can also use _main_ as a version which
would always have latest development version. Just remember that _main_
may not be stable.

# License

The scripts and documentation in this project are released under the [MIT License](LICENSE)

# Contributions

Contributions are welcome!  See [Contributor's Guide](docs/contributors.md)
