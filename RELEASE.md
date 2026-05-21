# Release Guide

This document outlines the steps to deploy a new version of `@bilte-co/socky-js` to npm.

The project uses [Changesets](https://github.com/changesets/changesets) for versioning and GitHub Actions for automated publishing (see [.github/workflows/release.yml](./.github/workflows/release.yml)).

---

## Overview

```diagram
╭──────────╮   ╭──────────╮   ╭────────────╮   ╭───────────╮   ╭──────────╮
│  Branch  │──▶│ Changeset│──▶│  PR + Main │──▶│  Version  │──▶│  Publish │
│  + code  │   │   added  │   │   merge    │   │     PR    │   │  to npm  │
╰──────────╯   ╰──────────╯   ╰────────────╯   ╰───────────╯   ╰──────────╯
```

---

## Prerequisites

Before starting, make sure you have:

- Push access to `bilte-co/socky-js`
- `aube` and `node >= 18` installed locally (managed via `mise`)
- The repo cloned and dependencies installed:
  ```sh
  aube ci
  ```
- The following repository secrets configured in GitHub:
  - `NPM_TOKEN` — npm automation token with publish access to `@bilte-co/socky-js`
  - `GITHUB_TOKEN` — provided automatically by GitHub Actions

---

## 1. Create a feature branch

```sh
git checkout -b feat/my-change
```

Make your code changes under `src/`, `lib/`, or `types/`.

## 2. Validate locally

Run the same checks that CI will run:

```sh
aubr clean
aubr build
aubr typecheck
aubr lint
aube run --if-present test
```

Optionally inspect the publish contents:

```sh
npm pack --dry-run
```

## 3. Add a changeset

Every user-facing change must include a changeset describing the bump and the change:

```sh
aubr changeset
```

You will be prompted to choose:

- **Bump type** — `patch` (bug fixes), `minor` (new features, backwards compatible), or `major` (breaking changes)
- **Summary** — a short, user-facing description that will appear in `CHANGELOG.md`

This writes a markdown file into [.changeset/](./.changeset/). Commit it alongside your code:

```sh
git add .changeset/*.md
git commit -m "feat: my change"
```

> Internal-only changes (CI, docs, refactors with no user impact) do not need a changeset.

## 4. Open a PR and merge to `main`

- Push the branch and open a pull request against `main`.
- Once approved and CI is green, merge the PR.

## 5. The "Version Packages" PR

When commits with changesets land on `main`, the `release` workflow runs and the [`changesets/action`](https://github.com/changesets/action) step opens (or updates) a PR titled **"Version Packages"** that:

- Consumes the pending changeset files
- Bumps `version` in [package.json](./package.json)
- Updates [CHANGELOG.md](./CHANGELOG.md)
- Deletes the consumed changesets

Review this PR to confirm the version bump and changelog entries look correct, then **merge it**.

## 6. Automatic publish to npm

Merging the "Version Packages" PR triggers the `release` workflow again. This time, because there are no pending changesets, it runs:

```
./node_modules/.bin/changeset publish
```

The workflow will:

1. Check out the repo and set up Node 24 with `registry.npmjs.org`
2. Install `aube` via `mise`
3. Run `aube ci`, `aubr build`, `aubr typecheck`, and tests
4. Verify the publish contents with `npm pack --dry-run`
5. Publish the package to npm with provenance (`publishConfig.provenance: true`)
6. Push the matching git tag (e.g. `v0.6.2`)

## 7. Verify the release

Once the workflow finishes:

- Check the [Actions tab](https://github.com/bilte-co/socky-js/actions) for a green `release` run
- Confirm the new version exists on npm:
  ```sh
  npm view @bilte-co/socky-js version
  ```
- Confirm the git tag was pushed:
  ```sh
  git fetch --tags
  git tag --list | tail
  ```
- Spot-check installation in a scratch project:
  ```sh
  npm i @bilte-co/socky-js@latest
  ```

---

## Manual / emergency publish

If the automated workflow is unavailable, you can publish from a clean local checkout of `main`:

```sh
git checkout main
git pull
aube ci
aubr clean
aubr build
aubr typecheck
npm pack --dry-run        # sanity check tarball contents
npm publish --access public --provenance
```

You must be logged in (`npm whoami`) as a user with publish rights to `@bilte-co`.

---

## Troubleshooting

- **Workflow fails on `aube ci`** — make sure `aube-lock.yaml` is committed and up to date.
- **`changeset publish` skipped** — there are no pending changesets; merge a PR that adds one, or merge the open "Version Packages" PR.
- **`npm publish` 403** — `NPM_TOKEN` is missing, expired, or lacks publish rights to `@bilte-co/socky-js`.
- **Provenance error** — ensure the workflow has `id-token: write` permission (already set in [release.yml](./.github/workflows/release.yml)).
- **Wrong files in the tarball** — adjust the `files` array in [package.json](./package.json) and re-run `npm pack --dry-run`.
