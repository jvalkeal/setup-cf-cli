# Release

## Master

To consume master version we basically need to build and push dist to master:

```bash
$ npm run release
$ git add .
$ git commit -m "Update master dist"
$ git push
```


## Versioned

Assuming it's time to release `v0.0.2` we need to:

- Go to major release branch `releases/v0`
- Merge changes i.e. if all we need are from master
- Build and tag both `v0` and `v0.0.2`
- Push branch and tags


```bash
$ git checkout releases/v0
$ git merge master
$ git push
$ npm run release
$ git commit -m "Upgrade v0 dist"
$ git push
$ git tag -f v0
$ git tag -f v0.0.2
$ git checkout master
$ git push origin master -f --tags
```
