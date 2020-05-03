# setup-cf-cli-action

<p align="left">
  <a href="https://github.com/jvalkeal/setup-cf-cli-action"><img alt="GitHub Actions status" src="https://github.com/jvalkeal/setup-cf-cli-action/workflows/Main%20workflow/badge.svg"></a>
</p>

# Usage

See [action.yml](action.yml)

## Basic
```yaml
steps:
- uses: actions/checkout@v2
- uses: jvalkeal/setup-cf-cli-action@v0
  with:
    version: 6.51.0 # The CLI version to make available on the path.
    architecture: linux64 # (linux64, macosx64, windows64) - defaults to linux64
- run: cf -v
```

# License

The scripts and documentation in this project are released under the [MIT License](LICENSE)

# Contributions

Contributions are welcome!  See [Contributor's Guide](docs/contributors.md)
