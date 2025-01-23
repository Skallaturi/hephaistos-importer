# Updating

From https://publish.obsidian.md/hub/04+-+Guides%2C+Workflows%2C+%26+Courses/Guides/Using+GitHub+actions+to+create+releases+for+plugins
:

> I'm using GitHub actions to automate this. My workflow looks like this:
>
> -   Write code, fix stuff, etc. and commit my changes, pushing them to GitHub as needed.
> -   When I'm ready to release a new version,
> -   Update the `manifest.json` with the right version, commit and push it.
> -   use `git tag <version number>`, e.g. `git tag 1.0.0` using semantic versioning.
> -   Push the new tag to GitHub `git push origin --tags`
> -   GitHub takes care of the rest

# Version history

## Version 2.0.0

Since Hephaistos made the JSON available from the API, The plugin was redesigned from scratch.

## Version 1.0.0

Initial version, using Hephaistos graphQL to extract the most important stats.
