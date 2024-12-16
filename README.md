# Servant Engineering Best Practice Recommendations & References

## Engineering Best Practices

### Dev Machine Setup Guides

#### Dev Tools

- [VS Code](https://code.visualstudio.com/)
- [Homebrew for Mac](https://brew.sh/)
- [NVM](https://github.com/nvm-sh/nvm#installing-and-updating)
- [Install git via brew](https://git-scm.com/download/mac)
- [Use Prettier in VSCode](https://www.robinwieruch.de/how-to-use-prettier-vscode/)
- [Show hidden files on Mac](https://setapp.com/how-to/show-hidden-files-on-mac)

#### Team Software

- [Slack](https://servant-io.slack.com/)
- [Google Calendar for Slack](https://servant-io.slack.com/apps/ADZ494LHY-google-calendar)
- [Zoom Scheduler for Google Cal](https://chrome.google.com/webstore/detail/zoom-scheduler/kgjfgplpablkjnlkjmjdecgdpfankdle)

### Recommended Editor Extensions

- Name: ES7+ React/Redux/React-Native snippets
  - Id: dsznajder.es7-react-js-snippets
    Description: Extensions for React, React-Native and Redux in JS/TS with ES7+ syntax. Customizable. Built-in integration with prettier.
    Version: 4.4.3
    Publisher: dsznajder
  - VS Marketplace Link: https://marketplace.visualstudio.com/items?itemName=dsznajder.es7-react-js-snippets
- Name: ESLint
  - Id: dbaeumer.vscode-eslint
    Description: Integrates ESLint JavaScript into VS Code.
    Version: 2.2.2
    Publisher: Microsoft
  - VS Marketplace Link: https://marketplace.visualstudio.com/items?itemName=dbaeumer.vscode-eslint
- Name: Git Graph
  - Id: mhutchie.git-graph
    Description: View a Git Graph of your repository, and perform Git actions from the graph.
    Version: 1.30.0
    Publisher: mhutchie
  - VS Marketplace Link: https://marketplace.visualstudio.com/items?itemName=mhutchie.git-graph
- Name: GitLens — Git supercharged
  - Id: eamodio.gitlens
    Description: Supercharge Git within VS Code — Visualize code authorship at a glance via Git blame annotations and CodeLens, seamlessly navigate and explore Git repositories, gain valuable insights via rich visualizations and powerful comparison commands, and so much more
    Version: 12.0.7
    Publisher: GitKraken
  - VS Marketplace Link: https://marketplace.visualstudio.com/items?itemName=eamodio.gitlens
- Name: HTML CSS Support
  - Id: ecmel.vscode-html-css
    Description: CSS Intellisense for HTML
    Version: 1.12.2
    Publisher: ecmel
  - VS Marketplace Link: https://marketplace.visualstudio.com/items?itemName=ecmel.vscode-html-css
- Name: JavaScript and TypeScript Nightly
  - Id: ms-vscode.vscode-typescript-next
    Description: Enables typescript@next to power VS Code's built-in JavaScript and TypeScript support
    Version: 4.8.20220530
    Publisher: Microsoft
  - VS Marketplace Link: https://marketplace.visualstudio.com/items?itemName=ms-vscode.vscode-typescript-next
- Name: Jest
  - Id: Orta.vscode-jest
    Description: Use Facebook's Jest With Pleasure.
    Version: 4.6.0
    Publisher: Orta
  - VS Marketplace Link: https://marketplace.visualstudio.com/items?itemName=Orta.vscode-jest
- Name: TODO Highlight
  - Id: wayou.vscode-todo-highlight
    Description: highlight TODOs, FIXMEs, and any keywords, annotations...
    Version: 1.0.5
    Publisher: Wayou Liu
  - VS Marketplace Link: https://marketplace.visualstudio.com/items?itemName=wayou.vscode-todo-highlight
- Name: XML
  - Id: redhat.vscode-xml
    Description: XML Language Support by Red Hat
    Version: 0.20.0
    Publisher: Red Hat
  - VS Marketplace Link: https://marketplace.visualstudio.com/items?itemName=redhat.vscode-xml

### Branching Strategy

We are beginning with a GitHub Flow-based strategy, using a `main` branch and `u/username/feature-x` branches. We plan to merge to keep our feature branches up-to-date with `main` and squash commits when merging PRs on GitHub.

We will adapt as we go and update our decisions here.

- [GitHub Flow](https://docs.github.com/en/get-started/quickstart/github-flow)
- [How to Write a Git Commit Message](https://cbea.ms/git-commit/#seven-rules)
- [What's the Difference Between the 3 Github Merge Methods?](https://rietta.com/blog/github-merge-types/) - We are using Squash & Merge

### Deployments

There are several branches created in the repo used to facilitate deployments to various environments. The merging strategy is driven by GitHub Actions and are primarily source from two source files

- onDemandMergeToDev.yml - for on-demand merges from `main` to `development`.
- mergeToDev.yml - This is a scheduled action that repeats daily at 12PM UTC time. It is configured so that different merges occur based on the day of the week.
  - Monday
    - Merge from `main` to `development`
  - Tuesday
    - Merge from `main` to `development`
  - Wednesday
    - Merge from `development` to `staging`
    - Merge from `main` to `development`
  - Thursday
    - Merge from `main` to `development`
  - Friday
    - Merge from `staging-ondeck` to `production`
    - Merge from `staging` to `staging-ondeck`
    - Merge from `development` to `staging`
    - Merge from `main` to `development`

Merges happen in that order resulting in a pattern which facilitates merges to `production` every week from the `staging-ondeck` branch, which in turn is only updated from `staging` _after_ the merge to production - resulting in a ≈2 week lag on merges to prod from main. Merges from `development` are pushed to `staging` every Wednesday and Friday and merges from `main` to `development` happen Mon-Fri.

To follow an example to illustrate, say a change is merged to `main` Week 1 on Tuesday, _after_ 12:00UTC. That change would merge as follows:

- `main` Week 1, Tuesday 13:00 UTC
- `development` Week 1, Wednesday 12:00 UTC
- `staging` Week 1, Friday 12:00 UTC
- `staging-ondeck` Week 2, Friday 12:00 UTC
- `production` Week 3 Friday 12:00 UTC

As another example, let's say a change merges to `main` on Monday:

- `main` Week 1, Monday 13:00 UTC
- `development` Week 1, Tuesday 12:00 UTC
- `staging` Week 1, Wednesday 12:00 UTC
- `staging-ondeck` Week 1, Friday 12:00 UTC
- `production` Week 2 Friday 12:00 UTC

Due to the schedule, you see that the cutoff time for merges to `main` is 12:00UTC Tuesdays for deployment to `production` the following week. In other words, anything checked into main by 12:00UTC Tuesday Week 1 will be merged to `production` Friday Week 2.

#### Deployments

Deployments are actually configured to trigger from merges to the branches above in Google Cloud Build instance.

This is also where ENV variables are configured.

## Project Structure

The project is configured as a monorepo with the source code all contained in /pangea-web/, docker files are in /dockerfiles/ and other configuration files are in /.github/ and /.vscode/

The /pangea-web directory contains the [NextJS](https://nextjs.org) application which is the front end web application for Pangea Prime. The directory is structured fairly standardly.

- /pages - contains the NextJS pages
- /components - contains react components consumed by those pages. The directory is further broken down by feature area which loosely correlate to the `/pages`
- /lib - contains utility classes, apis, data models, interface definitions, enums, shared resources, etc.
- /hooks - contains custom React hooks used by the application
- /atoms - contains definitions of the [RecoilJS](https://recoiljs.org/docs/introduction/installation) atoms and selectors used throughout the app. Files group together atom and files by feature area.
- /public - contains static resources (html, css, images, fonts) used by the application
- /styles - contains code and files related to the CSS and theming of the app
- /tests - contain the unit tests.

## State management

We are using [RecoilJS](https://recoiljs.org) for state management. All the atoms and selectors are stored within the /atoms directory.
