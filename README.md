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
There's no embedded functionality to manage anything else than just
setting up CLI into a path. For commands to do anything usefull you
need to store environment settings in a GitHub secrets and
then run login command. GitHub will then make sure that none of these
secrets are exposed to publicly visible logs.

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

# Versions

Versions are released as a git tags. We're currenly on a pre-release stage so
current _0.x_ series can be found under tag _v0_ which will always be a same
as latest within _0.x_ like _v0.0.1_.

**NOTE:** While not recommended you can also use _master_ as a version which
would always have latest development version. Just remember that _master_
may not be stable.

# License

The scripts and documentation in this project are released under the [MIT License](LICENSE)

# Contributions

Contributions are welcome!  See [Contributor's Guide](docs/contributors.md)
