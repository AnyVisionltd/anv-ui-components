# Contributing to AnyVision UI

Thanks for your interest in improving our components-library!

Please review this document to help to streamline the process and save everyone's precious time.

This repo uses npm workspaces, so you should install `npm` as the package manager. See [installation guide](https://docs.npmjs.com/downloading-and-installing-node-js-and-npm).

## Issues

No software is bug-free. So, if you got an issue, follow these steps:

- Search the [issue list](https://github.com/AnyVisionltd/anv-ui-components/issues) for current and old issues.
  - If you find an existing issue, please UPVOTE the issue by adding a "thumbs-up reaction". We use this to help prioritize issues!
- If none of that is helping, create an issue with the following information:
  - Clear title (shorter is better).
  - Describe the issue in clear language.
  - Share error logs, screenshots and etc.

```sh
# Download and build this repository:
git clone https://github.com/AnyVisionltd/anv-ui-components.git
cd anv-ui-components
npm i

# make changes to try and reproduce the problem, such as adding components + stories
npm run storybook

# see if you can see the problem, if so, commit it:
git checkout "branch-describing-issue"
git add -A
git commit -m "reproduction for issue #123"

### Updating Tests

Before any contributions are submitted in a PR, make sure to add or update meaningful tests. A PR that has failing tests will be regarded as a “Work in Progress” and will not be merged until all tests pass.
When creating new unit test files, the tests should adhere to a particular folder structure and naming convention, as defined below.

```sh
# Proper naming convention and structure for js tests files
+-- parentFolder
|   +-- [filename].js
|   +-- [filename].test.js
```

## Pull Requests (PRs)

We welcome all contributions. There are many ways you can help us. This is few of those ways:

Before you submit a new PR, make sure you run `npm run test`. Do not submit a PR if tests are failing.

### Reviewing PRs

**As a PR submitter**, you should reference the issue if there is one, include a short description of what you contributed and, if it is a code change, instructions for how to manually test out the change. This is informally enforced by our [PR template](https://github.com/storybookjs/storybook/blob/master/.github/PULL_REQUEST_TEMPLATE.md). If your PR is reviewed as only needing trivial changes (e.g. small typos etc), and you have commit access then you can merge the PR after making those changes.

All issues should have a `type` label. `bug`/`feature`/`question`/etc...`.


## Development Guide

### Prerequisites

Please have the **_latest_** stable versions of the following on your machine

- node
- npm

### Initial Setup

If you run into trouble here, make sure your node, npm, are on the latest versions.

1.  `cd ~` (optional)
2.  `git clone https://github.com/AnyVisionltd/anv-ui-components.git`
3.  `cd anv-ui-components`
4.  `npm i`
5.  `yarn run storybook`
