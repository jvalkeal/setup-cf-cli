# setup-cf-cli-action

<p align="left">
  <a href="https://github.com/jvalkeal/setup-cf-cli-action"><img alt="GitHub Actions status" src="https://github.com/jvalkeal/setup-cf-cli-action/workflows/Main%20workflow/badge.svg"></a>
</p>

This action sets up a java environment for use in actions by:

- optionally downloading and caching a requested version of java by version and adding to PATH. Default downloads are populated from the [Zulu Community distribution of OpenJDK](http://static.azul.com/zulu/bin/)
- registering problem matchers for error output

# Usage

See [action.yml](action.yml)

## Basic
```yaml
steps:
- uses: actions/checkout@v2
- uses: jvalkeal/setup-cf-cli-action@v1
  with:
    version: '6.51.0' # The CLI version to make available on the path.
    architecture: linux64 # (linux64, macosx64, windows64) - defaults to linux64
- run: cf -v
```

# License

The scripts and documentation in this project are released under the [MIT License](LICENSE)

# Contributions

Contributions are welcome!  See [Contributor's Guide](docs/contributors.md)
