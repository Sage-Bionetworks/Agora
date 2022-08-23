[![Coverage Status](https://coveralls.io/repos/github/Sage-Bionetworks/Agora/badge.svg?branch=develop)](https://coveralls.io/github/Sage-Bionetworks/Agora?branch=develop)
[![Build Status](https://travis-ci.org/Sage-Bionetworks/Agora.svg?branch=develop)](https://travis-ci.org/Sage-Bionetworks/Agora)
[![GitHub version](https://badge.fury.io/gh/Sage-Bionetworks%2FAgora.svg)](https://badge.fury.io/gh/Sage-Bionetworks%2FAgora)

# Agora BETA

## Prerequisites

What you need to run this app:

- `node` and `npm` (`brew install node`)
  -- Ensure you're running the latest versions Node `v16.x.x`+ and NPM `8.x.x`+
- [MongoDB](https://www.mongodb.com/docs/manual/administration/install-community/)
  -- You can use a GUI like [Compass](https://www.mongodb.com/products/compass)
  > If you have `nvm` installed, which is highly recommended (`brew install nvm`) you can do a `nvm install --lts && nvm use` in `$` to run with the latest Node LTS. You can also have this `zsh` done for you [automatically](https://github.com/creationix/nvm#calling-nvm-use-automatically-in-a-directory-with-a-nvmrc-file)

## Getting Started

### 1 - Install

```bash
# Clone the repo
git clone https://github.com/Sage-Bionetworks/Agora.git

# Go to repo folder
cd Agora

# Install dependencies
npm install
```

### 2 - Create database

You will need to create a MongoDB database and name it `agora`. Use `genes` for the collection name.

- [Using the MongoDB Shell](https://www.mongodb.com/basics/create-database#option-2)
- [Using MongoDB Compass](https://www.mongodb.com/basics/create-database#option-3)

Note: You can use the following scripts to start the database:

```
# Linux and MacOS
npm run mongo:start
# Windows
npm run mongo:start:windows
```

### 3 - Import the data

The following commands will download the data files and all of the team images. You can download all of them using the `synapseclient`. Install the package manager `pip` [here](https://bootstrap.pypa.io/get-pip.py). After that, install the `synapseclient` using the following command:

```bash
pip install synapseclient
```

To get the data files using credentials provided by AWS, run:

```bash
npm run data:local-aws
```

If you have your own Synapse credentials, you can run:

```bash
npm run data:local
```

If you are on an AWS EC2 that has been granted access (e.g., for deployment) you can run:

```bash
npm run data:aws
```

If the `aws` command fails in any of the scripts, you might be running the wrong version. To use `aws secretsmanager` you need the `aws cli` version to be `1.15.8` and upwards

```bash
aws --version
# Exemple of incorrect version
aws-cli/1.14.65 Python/2.7.9 Windows/8 botocore/1.9.18
```

To manually update your version go to [this](https://docs.aws.amazon.com/cli/latest/userguide/cli-install-macos.html) link.

You should see all of the data files and teams members pictures in the folders created by any of the scripts above.

To add those images to our database, we are going to use the `mongofiles` executable. If you did not add mongo to your `PATH`, copy the images to the `Mongo` binary directory or run the executable remotely from the images directory (replace `mongofiles` in the next command for the binary path). If you have `Mongo` in your `PATH` use the following script command:

```bash
# Imports all data files and team images
npm run mongo:import
```

You'll need `Linux` to run the previous script. If you need to do this in `Windows`, you can get any `Linux` distribution at the `Windows Store` (e.g. `Ubuntu`).

### 4 - Build

```bash
# Build the server amd app
npm run dev
```

### 5 - Start

```bash
# Start the server and app
npm run start
```

Go to [http://localhost:8080](http://localhost:8080)

# Development

```bash
# Build the server and app and watch for changes
npm run dev
```

Go to [http://localhost:8080](http://localhost:8080)

# Testing

```bash
# Run unit tests
npm run test

# Run unit tests and watch for changes
npm run test:watch

# Run end-to-end tests (requires build)
npm run test:e2e
```

# Deployment

## Commit changes

Before pushing code to the dev branch, we should follow these steps to make sure everything is running without errors.

```bash
# Clean everything
npm run clean

# Re-install dependencies
npm install

# Run unit tests
npm run test

# Build app and server
npm run build

# Run end-to-end tests
npm run test:e2e

# Go to localhost:8080 and verify the app is running without errors
npm run start
```

## Continuous Deployment

We have setup Travis to deploy Agora to our [AWS infrastructure](https://github.com/Sage-Bionetworks/Agora-infra).
We continuously deploy to three environments:

- Development -> https://agora-develop.ampadportal.org
- Staging -> https://agora-staging.ampadportal.org
- Production -> https://agora.ampadportal.org

## Deployment Workflow

To deploy Agora updates to one of the environments just merge code to the branch you would like
to deploy to then Travis will take care of building, testing and deployming the Agora
application.

## Deployment configurations

Elastic beanstalk uses files in the
[.ebextensions folder](https://docs.aws.amazon.com/elasticbeanstalk/latest/dg/customize-containers-ec2.html)
to configure the environment that the Agora application runs in.
The .ebextensions files are packaged up with Agora and deployed to beanstalk
by the CI system.

## Deployment Builds

- https://app.travis-ci.com/github/Sage-Bionetworks/Agora

## Deployment for New Data (Updated 9/30/2021)

1. First, make sure the data file is available in [Synapse](https://www.synapse.org/#!Synapse:syn12177492)
2. Update data version in `data-manifest.json` in [Agora Data Manager](https://github.com/Sage-Bionetworks/agora-data-manager/). ([example](https://github.com/Sage-Bionetworks/agora-data-manager/commit/d9006f01ae01b6c896bdc075e02ae1b683ecfd65)) The version should match the `data_manifest.csv` file in [Synapse](https://www.synapse.org/#!Synapse:syn13363290).
3. If there is a new json file (i.e. not updating existing data), add an entry to `import-data.sh`. ([example](https://github.com/Sage-Bionetworks/agora-data-manager/commit/d9006f01ae01b6c896bdc075e02ae1b683ecfd65))
4. Deploy your changes in [Agora Data Manager](https://github.com/Sage-Bionetworks/agora-data-manager/) to dev branch.
5. Verify new data is in the database for the dev branch.
6. Update data version in Agora app. ([example](https://github.com/Sage-Bionetworks/Agora/pull/847/files)) The version should match the `data_manifest.csv` file in [Synapse](https://www.synapse.org/#!Synapse:syn13363290). Then deployment the change to [Agora's dev branch](https://agora-develop.ampadportal.org/genes).
7. Check new data shows up on [Agora's dev branch](https://agora-develop.ampadportal.org/genes).
8. Once verified, repeat step 4 to 7 to finish deployment to staging and production branches.

## New Data Testing

1. New or updated data is usually in `json` format. Make sure you have MongoDB installed locally as described in "**Running the app**" section. Then you can import your json file to your local MongoDB database by running:

```
mongoimport --db agora --collection [add collection name here] --jsonArray --drop --file [path to the json file name]
```

More examples can be found [here](https://github.com/Sage-Bionetworks/Agora/blob/develop/mongo-import.sh).

2. Verified the data is successfully imported to the database. You may do that by using a GUI for MongoDB. The connection address to MongoDB in your local machine is `localhost` and the port number is `27017`.

# Style Guide and Project Structure

This project follows the directions provided by the official [angular style guide](https://angular.io/guide/styleguide). Things that the guide state to keep in mind:

- Define components or services that do one thing only, per file. Try to use small sized functions where possible, making it reusable.

- Keep the consistency in file and folder names. Use dashes to separate words in the descriptive prefix name and dots to separate the suffix words. Use the type and extension names in the file name, e.g. `a.component.ts`, `a.service.ts` or `a.module.ts`. The style guide has references about naming the other types of files in an Angular project.

- Use camel case for variable names, even for constants as they are easy to read. If the values don't change, use a const declaration. For Interfaces use an upper camel case, e.g. `MyInterface`.

- The guide advises separating application from third party imports. This projects goes one step further separating imports by source and purpose also, grouping Angular framework, project components and services, third party typescript/javascript libraries separately.

- The folder structure in not restrictive in the style guide, but it should be structured in a way so it is to maintain and expand the project, and identify files in a glance. This project uses a root folder called `src` and one main folder for each module. When a spacific folder reaches seven or more files it is split into sub-folders. Another reason to split is to keep a view smart component with container dumb components as children.

- For the file structure this project uses the component approach. This is the new standard for developing Angular apps and a great way to ensure maintainable code by encapsulation of our behavior logic. A component is basically a self contained app usually in a single file or a folder with each concern as a file: style, template, specs, e2e, and component class.

# External Stylesheets

Any stylesheets (Sass or CSS) placed in the `src/styles` directory and imported into your project will automatically be compiled into an external `.css` and embedded in your production builds.

For example to use Bootstrap as an external stylesheet:

1. Create a `styles.scss` file (name doesn't matter) in the `src/styles` directory.
2. `npm install` the version of Boostrap you want.
3. In `styles.scss` add `@import 'bootstrap/scss/bootstrap.scss';`
4. In `src/app/core/core.module.ts` add underneath the other import statements: `import '../styles/styles.scss';`

Since we are using PrimeNG, style rules might not be applied to nested Angular children components. There are two ways to solve this issue enforce style scoping:

- Special Selectors

You can keep the Shadow DOM (emulated browser encapsulation) and still apply rules from third party libraries to nested children with this approach. This is the recommended way, but it is harder to implement in certain scenarios.

```bash
:host /deep/ .ui-paginator-bottom {
    display: none;
}
```

- Disable View Encapsulation

This is the easiest way to apply nested style rules, just go to the component and turn off the encapsulation. This way the rules are passed from parent to children without problems, but any rule created in one component affects the other components. This project uses this approach, so be aware to create style classes with using names related to the current component only.

```bash
...
import { ..., ViewEncapsulation } from '@angular/core';

@Component {
...
encapsulation: ViewEncapsulation.None,
}
```

# AoT Don'ts

The following are some things that will make AoT compile fail.

- Don’t use require statements for your templates or styles, use styleUrls and templateUrls, the angular2-template-loader plugin will change it to require at build time.
- Don’t use default exports.
- Don’t use `form.controls.controlName`, use `form.get(‘controlName’)`
- Don’t use `control.errors?.someError`, use `control.hasError(‘someError’)`
- Don’t use functions in your providers, routes or declarations, export a function and then reference that function name
- @Inputs, @Outputs, View or Content Child(ren), Hostbindings, and any field you use from the template or annotate for Angular should be public

# Configuration

Configuration files live in `config/` we are currently using webpack, karma, for different stages of your application

# License

[MIT](/LICENSE)
