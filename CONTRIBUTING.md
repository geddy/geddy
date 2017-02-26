# Contributing

> Please read these instructions carefully

**Pointers:**

- A basic understanding of git branching is required.
- Do not commit changes on the 'master' branch.
- Do not merge any branches.
- We will take care of merging, bumping up the version number, changelog, and tagging.

If you do not follow those principles. Your pull request will be rejected. We would like to maintain a clean repo to work in, and try avoid headaches :laughing:

> **For Admins:**
> - Make sure to merge using the `--no-ff` flag. This is so we can see where the commits originally came from by avoiding fast-forwarding.
> - Make sure to merge hotfixes into 'develop' as well as 'master'.
> - Create a 'release-[next version]' branch before merging 'develop' into 'master'.
>   **Process:**
>   - `$ git checkout -b release-[next version] develop` i.e. v16.0.3
>   - Bump up the version number in the `package.json` file (without the 'v') and commit the change.
>   - Update the `CHANGELOG.md` file. Look back through the commit history to help you.
>   - Apply bug fixes **(optional)**
>   - `$ git checkout master`
>   - `$ git merge --no-ff release-[version number]`
>   - `$ git tag -a [version number]` **(Required)** In the tag message, name it and follow with a list of highlighted changes. It should match what was written in the changelog.
>   - `$ git checkout develop`
>   - `$ git merge --no-ff release-[version number]`
>   - `$ git branch -d release-[version number]`
>   - When pushing the changes to the repo, remember to push the tag as well:
>     `$ git push origin <tag_name>`
> - Make sure to delete release, feature and hotfix branches once they have been merged. This will stop branch clutter.

## Branch structure:

### master:

This is the production branch. Do not make any commits here. We will merge the relevant branch if it is accepted.

### develop:

Here you can odd commits. When creating a pull request, point to this branch.

### feature-[the feature you are adding]:

These are feature branches.

If you have a feature you would like to add, that is likely to have many commits, then please create a feature branch and point to this branch when creating a pull request.

> **Note:**
> Make sure to branch off from the 'develop' branch, using:
>
> `$ git checkout -b feature-[the feature you are adding] develop`

### hotfix-[next version]

These are for quick (important) fixes. Please place the incremented version number into the branch name. It is in the format [vMAJOR.MINOR.HOTFIX]. So if the current version is 'v15.2.3', you would write:

`$ git checkout -b hotfix-v15.2.4 master`.

> **Note:**
> These must branch off the 'master' branch, as it is something on the 'master' branch you are attempting to fix. Do not create hotfix branches for the 'develop' branch, as it can be committed directly onto the 'develop' branch.

---

Any questions, create an 'issue'. We would rather make sure that you grasp the branching correctly, instead of creating a load of commits on the wrong branch that you will then need to migrate to another branch.

---

If you would like to read up on this branching model, please follow [this link][1].

:octocat:

[1]: http://nvie.com/posts/a-successful-git-branching-model/
