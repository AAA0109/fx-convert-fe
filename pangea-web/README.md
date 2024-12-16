This is a [Next.js](https://nextjs.org/) project bootstrapped with [`create-next-app`](https://github.com/vercel/next.js/tree/canary/packages/create-next-app).

## Getting Started

- Make sure you are on node 18 (or higher)
- This is a mono repo, so make sure you are in the PANGEA-WEB folder
- Create a local `.env` file:
  ```bash
  cp .env.development .env.local
  ```
- Update your `.env.local` file to point prime-frontend to the BE API of your choice(_Or request a copy from your fellow engineer_).
- Make sure NEXT_PUBLIC_PANGEA_API_URL points to a local or DEV instance of `hedgedesk_dashboard`
- Install all third-party libraries:
  ```bash
  npm i
  ```
- Run the development server:
  ```bash
  npm run dev
  ```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## Running the app locally for the first time

If you got your `.env.local` populated from a fellow engineer, no need to do anything here.

- download Python if you do not already have it installed: `brew install python`
- Run the dev_setup script: `npm run dev-setup`, entering Pangea API username/password when prompted
- Start the app in local dev mode: `npm run dev`

## Building the site

- `npm run build`
- `npm run start`

## NPM script descriptions

Below is a list of the npm scripts available in the project and a description of their function

- `npm run dev`: Runs `next dev` to launch the site in development mode on localhost:3000
- `npm run dev:inspect`: Runs `next dev` with the `inspect` node option enabled for more debugging logging.
- `npm run build`: Runs `next build` which does an optimized build of the site and completes static site generation. Contents go to the .next folder.
- `npm run build:debug`: Runs `next build --debug` which enables debug options within NextJs.
- `npm run build:nolint`: Runs `next build --no-lint` which disables linting during the compilation.
- `npm run build:analyze`: Creates analysis logs of the build which are helpful in examining package sizes and dependencies.
- `npm start`: Starts the program locally. Requires running `npm run build` first.
- `npm run lint`: Runs the NextJs-configured linter on the pages containing .ts files and outputs the findings.
- `npm run lint:fix`: Runs the NextJs-configured linter on the pages containing .ts files and attempts to automatically resolve the findings.
- `npm run component-barrels`: Creates barrel files (index.ts) through the folder hierarchy by finding exported members and rolling them up.
- `npm run prettier`: Runs prettier on .ts files.
- `npm run prettier:fix`: Runs prettier and fixes violations on .ts files.
- `npm run test`: Turns on `jest` in watch mode.
- `npm run test:once`: Runs all unit tests in the project.
- `npm run test:ci`: Runs the scriptable version of jest - used in cloud build files.
- `npm run test:e2e`: Runs end to end tests using playwright.
- `npm run test:e2e:reports`: Runs end to end tests using playwright and generates report for it.
- `npm run buildtypes`: Uses the swagger-typescript-api script to generate the Api.ts and data-contract.ts files from the OpenAPI documentation on the Pangea API swagger pages.
- `npm run dev-setup`: Runs a python script to assist in setting up the developers machine for local development. Creates .env.local, secrets.json, etc.

## Opening PRs

Ideally it'd be nice to include a screenshot or screen recording or your work. This will give quick insight to the reviewers and also all the designer to perform a quick design QA before your PR is merged.

#### Tools for recording

- All OS's - [Loom](https://www.loom.com/). You can use Loom with your Pangea email since Pangea has a business license.
- MacOS, Windows - [Licecap](https://www.cockos.com/licecap/).
- Linux - [Peek](https://github.com/phw/peek).

#### Feature flags

There's a devtool available which allows toggling feature flags at runtime. To enable devtools, set `NEXT_PUBLIC_ENABLE_FEATURE_FLAG_DEVTOOL` environment variable to true, this value will be passed to the `enableDevtool` prop on the `FeatureFlagProvider`.

In addition to the <FeatureFlag /> component, a `useFeatureFlags` hook is exported which allows you to add component logic
outside of UI component.

###### Integration

1. Use `featureFlags.json`
   We strongly suggest the use of `featureFlags.json` file in the **_pangea-web/_** folder of this project. This file will allow you to easily
   enable or disable specific features within your application without having to modify the code directly. We can modify this to fetch a JSON file
   from a back-end endpoint later in the future.

2. Use one `<FeatureFlagProvider>` per project.
   It is recommended to use a single `<FeatureFlagProvider>` in the project, as this component was designed for this specific use case. Any requirements that don't align with this approach will require custom modifications.

3. `<FeatureFlag />` allows an optional fallback prop. When the feature is disabled, the fallback component will be rendered.

4. Listed below are a few rules on adding feature flags
   - Feature flag names should always be lowercase and separated by a hyphen, not camelCase.
   - Do not use abbreviations in feature flag names.
   - Feature flag should always include the date it was added and a description.

## Merge Strategy

- Each day -> automatic merge from to `main` to `development`
- Each Wednesday, Friday morning -> automatic merge from `development` to `staging`
- Each Friday morning, automatic merge from `staging` into `staging-ondeck`
- Each Friday morning, automatic merge from `staging-ondeck` into `production`
- Hotfix can be done manually

```mermaid
gitGraph
commit
branch development order:1
commit
branch staging order:2
commit
branch staging-ondeck order:3
commit
branch production order:4
commit
checkout main
commit
commit
checkout development
merge main id:"Monday - 1"
commit
checkout main
commit
commit
commit
checkout development
merge main id:"Tuesday - 1"
commit
checkout main
commit
checkout staging
merge development id:"Wed Stage - 1"
commit
checkout development
merge main id:"Wednesday - 1"
commit
checkout main
commit
commit
commit
checkout development
merge main id:"Thursday - 1"
commit
checkout main
commit
commit
commit
#checkout production
#merge staging-ondeck id:"Fri Prod - 1"
#commit
checkout staging-ondeck
merge staging id:"Fri Staging-Ondeck - 1"
commit
checkout staging
merge development id:"Fri Stage - 1"
commit
checkout development
merge main id:"Fri - 1"
commit
checkout main
commit
commit
commit
checkout development
merge main id:"Monday -2"
commit
checkout main
commit
commit
checkout development
merge main id:"Tuesday -2"
commit
checkout main
commit
checkout staging
merge development id:"Wed Stage - 2"
commit
checkout development
merge main id:"Wednesday - 2"
commit
checkout main
commit
commit
commit
checkout development
merge main id:"Thursday - 2"
commit
checkout main
commit
commit
commit
checkout production
merge staging-ondeck id:"Fri Prod - 2"
commit
checkout staging-ondeck
merge staging id:"Fri Staging-Ondeck - 2"
commit
checkout staging
merge development id:"Fri Stage - 2"
commit
checkout development
merge main id:"Fri - 2"
commit
checkout main
commit
commit
```
