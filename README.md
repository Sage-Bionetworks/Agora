[![Coverage Status](https://coveralls.io/repos/github/Sage-Bionetworks/Agora/badge.svg?branch=develop)](https://coveralls.io/github/Sage-Bionetworks/Agora?branch=develop)
[![Build Status](https://travis-ci.org/Sage-Bionetworks/Agora.svg?branch=develop)](https://travis-ci.org/Sage-Bionetworks/Agora)
[![GitHub version](https://badge.fury.io/gh/Sage-Bionetworks%2FAgora.svg)](https://badge.fury.io/gh/Sage-Bionetworks%2FAgora)

# Agora BETA

## Getting Started
```bash
# clone our repo
git clone https://github.com/Sage-Bionetworks/Agora.git

# change directory to our repo
cd Agora

# WINDOWS only. In terminal as administrator
npm install -g node-pre-gyp
```

## Dependencies
What you need to run this app:
* `node` and `npm` (`brew install node`)
* Ensure you're running the latest versions Node `v6.x.x`+ (or `v7.x.x`) and NPM `3.x.x`+

> If you have `nvm` installed, which is highly recommended (`brew install nvm`) you can do a `nvm install --lts && nvm use` in `$` to run with the latest Node LTS. You can also have this `zsh` done for you [automatically](https://github.com/creationix/nvm#calling-nvm-use-automatically-in-a-directory-with-a-nvmrc-file)

## Installing
Once you have those, you should install these globals with `npm install --global`:
* `webpack`
* `webpack-dev-server`
* `karma`
* `nodemon`
* `protractor`
* `rimraf`
* `typescript`
* `cross-env`
```
npm install -g webpack
npm install -g webpack-dev-server
npm install -g karma-cli
npm install -g protractor
npm install -g rimraf
npm install -g typescript
npm install -g cross-env
npm install -g artillery
npm install -g opencollective
```
## Running the app

* Local development environment

For local development you'll need the MongoDB Local (Downloadable Version). For a guid on how to install MongoDB, go to [this link](https://docs.mongodb.com/manual/administration/install-community/). On Windows, you can get it from the following Download Center link [here](https://www.mongodb.com/download-center?_ga=2.62089900.1820272119.1524602800-952612734.1523898940&_gac=1.79428326.1523898940.CjwKCAjwk9HWBRApEiwA6mKWacqRgoYOQ4ayn_M_ol5d5C7yy0aTEbZjKsersvLRfXJAozzJyqu29RoClFoQAvD_BwE#production).

After you downloaded it, go to the root of your `C` drive and create a `data` folder. After that, `cd` into the `data` folder and make a new folder called `db`.
Mongo knows to go to this folder automatically to retrieve and store data. To run MongoDB, you need to start the process at the installation location, e.g. go to:

```bash
# If you added mongo to your path, you can issue this from anywhere
C:\\Users\\YOUR_USER>cd "C:\Program Files\MongoDB\Server\3.6\bin"

C:\\Program Files\\MongoDB\\Server\\3.6\\bin>mongod
```

You should see a connection to port `27017` (MongoDB default port). You can also specify an alternate path and port for this. The connection itself will come from
our Express server through Mongoose (a framework that allows us to define objects with a strongly-typed schema that is mapped to a MongoDB document).

```bash
[initandlisten] waiting for connections on port 27017
```

If you also installed `MongoDB Compass` along with the main installation (a GUI to manage your `MongoDB` databases), just open it and connect to your localhost (use the default values). You'll notice a few connections opened in the cmd prompt with the database running (the one open with `MongoDB` listening on port `27017`). You should see something like:

```bash
[listener] connection accepted from 127.0.0.1:57948 #2 (2 connections now open)
```

Go back to `MongoDB Compass` and create a database called `agora`. In the Create Database form, use `genes` for the collection name. Now that we are all set, it's time to load the data into our collections.

# Downloading the data

The following commands will download four data files (`rnaseq_differential_expression.json`, `network.json`, `gene_info.json`, `team_info.json`) and all of the team images. You can download all of them using the `synapseclient`. Install the package manager `pip` [here](https://bootstrap.pypa.io/get-pip.py). After that, install the `synapseclient` using the following command:

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

* Remote production environment

If you are copying the dist folder, install Node in the remote machine. Then, install MongoDB and populate the needed collections (follow the steps described above). Start the application by running `node` against the generated `server.js` file. That file will server the built client bundle along with the `index.html` file.

If you are copying the entire project, install Node and any needed global dependencies in the remote machine. Then, run `npm install` to get all local dependencies installed and just follow the same steps for the local development (see below). You'll need to expose port `8080` so anyone can access the application.

In both cases the final URL will be the remote machine public ip.

* Final step

After you have installed all dependencies and got every requirement ready you can run the app. Open the project in an IDE or navigate to the root project folder and, in a terminal opened in that folder, you can run:

```bash
npm run start:mongo:windows
```

This starts the MongoDB and open a connection using the port `27017`. The server relies on this connection to work so if you try to start the server without a valid
MongoDB connection it won't work.

Open a second terminal and run the following command:

```bash
npm run watch
```

This command is going to build the client-side and `watch` for changes. If you need more control over the process you can use a two-step process, first build the client:

```bash
npm run build:dev
```

As the name suggests, this builds the client-side of the application with the development flag set to true. The main difference between this command and the previous one
is that the first one just builds the application and outputs it to the `dist` folder (for the AoT build a different temporary folder is used before going to `dist`). The previous one runs Webpack with the `--watch` flag, so any change made to the `src/` folder (except the `src/server` folder) will trigger a rebuild of the application
bundle.

At the moment, you need to reload the application on the browser manually after changing the client-side files to see the changes being rendered. If you want to use the
hot module replacement from Webpack to make the application reload and redraw on the browser automatically, you can use the `webpack-dev-server` by running the command `npm run server:dev` **only**, you don't need to start the server using the regular command described below. Be aware that using the `webpack-dev-server` requires you
to manually configure and register all the endpoints and mocks within this development server (see the `devServer` in the `webpack.dev.js` file for a sample configuration). It should be used for development only.

With the application built and the database waiting for connections, we issue the next command for the server. Open a third terminal and run the following command:

```bash
npm run server
```

This is going to build the server using the configuration from the `nodemon-webpack-plugin`. Nodemon already watches for changes so any change done to files inside the `src/server` folder is going to rebuild the server.

As a side note, you don't need to stop the server when changing client-side files, because they use different packaging pipes. You just need to restart the server when changing a route name or a configuration file, for instance. In this case, just stop the server and do another `npm run server`.

The Express server will route the app for us and will communicate to MongoDB through Mongoose, the requests will be sent back to the Angular front-end. **Since we are loading a huge database locally, it is recommended that you have a good amount of RAM so that MongoDB won't crash**. To sum it up:

### database
```bash
# start the MongoDB database and opens a connection
npm run start:mongo:windows
```

### watches and bundles the build, client-side
```bash
npm run watch
```

### bundles for different builds
```bash
# development
npm run build:dev
# production (jit)
npm run build:prod
# production AoT
npm run build:aot
```

### server
```bash
# development
npm run server
# production
npm run start:prod
```

go to [http://0.0.0.0:8080](http://0.0.0.0:8080) in your browser.

## Other commands

### AWS Elastic Beanstalk server start command

AWS Elastic Beanstalk Node.js platform version 12 or above uses the `start` command in `package.json` file to start the application. This replaces the legacy NodeCommand option in the `aws:elasticbeanstalk:container:nodejs` namespace. [See details here.](https://docs.aws.amazon.com/elasticbeanstalk/latest/dg/nodejs-platform-dependencies.html#nodejs-platform-packagejson) ***DO NOT MODIFY the `start` command in `package.json`*** . 

```bash
node --max_old_space_size=2000  ./dist/server.js
```

### hot module replacement
```bash
npm run server:dev:hmr
```

### run unit tests
```bash
npm run test
```

### watch and run our tests
```bash
npm run watch:test
```

### run end-to-end tests
```bash
# update Webdriver (optional, done automatically by postinstall script)
npm run webdriver:update
# this will start a test server and launch Protractor
npm run e2e
```

### continuous integration (run unit tests and e2e tests together)
```bash
# faster testing for builds, uses the AoT build, run this before pushing new code
npm run ci:travis
# a complete test using both the JIT and AoT builds
npm run ci
```

### run Protractor's elementExplorer (for end-to-end)
```bash
npm run e2e:live
```

## run load tests, so you can stress test the application (uses a EC2 URL for now)
```bash
npm run test:load
```

# Configuration
Configuration files live in `config/` we are currently using webpack, karma, and protractor for different stages of your application

# AoT Don'ts
The following are some things that will make AoT compile fail.

- Don’t use require statements for your templates or styles, use styleUrls and templateUrls, the angular2-template-loader plugin will change it to require at build time.
- Don’t use default exports.
- Don’t use `form.controls.controlName`, use `form.get(‘controlName’)`
- Don’t use `control.errors?.someError`, use `control.hasError(‘someError’)`
- Don’t use functions in your providers, routes or declarations, export a function and then reference that function name
- @Inputs, @Outputs, View or Content Child(ren), Hostbindings, and any field you use from the template or annotate for Angular should be public

# External Stylesheets
Any stylesheets (Sass or CSS) placed in the `src/styles` directory and imported into your project will automatically be compiled into an external `.css` and embedded in your production builds.

For example to use Bootstrap as an external stylesheet:
1) Create a `styles.scss` file (name doesn't matter) in the `src/styles` directory.
2) `npm install` the version of Boostrap you want.
3) In `styles.scss` add `@import 'bootstrap/scss/bootstrap.scss';`
4) In `src/app/core/core.module.ts` add underneath the other import statements: `import '../styles/styles.scss';`

Since we are using PrimeNG, style rules might not be applied to nested Angular children components. There are two ways to solve this issue enforce style scoping:

* Special Selectors

You can keep the Shadow DOM (emulated browser encapsulation) and still apply rules from third party libraries to nested children with this approach. This is the recommended way, but it is harder to implement in certain scenarios.

```bash
:host /deep/ .ui-paginator-bottom {
    display: none;
}
```

* Disable View Encapsulation

This is the easiest way to apply nested style rules, just go to the component and turn off the encapsulation. This way the rules are passed from parent to children without problems, but any rule created in one component affects the other components. This project uses this approach, so be aware to create style classes with using names related to the current component only.

```bash
...
import { ..., ViewEncapsulation } from '@angular/core';

@Component {
...
encapsulation: ViewEncapsulation.None,
}
```

# TypeScript
> To take full advantage of TypeScript with autocomplete you would have to install it globally and use an editor with the correct TypeScript plugins.

## Use latest TypeScript compiler
TypeScript 2.1.x includes everything you need. Make sure to upgrade, even if you installed TypeScript previously.

```
npm install --global typescript
```

## Use a TypeScript-aware editor
We have good experience using these editors:

* [Visual Studio Code](https://code.visualstudio.com/)
* [Webstorm 10](https://www.jetbrains.com/webstorm/download/)
* [Atom](https://atom.io/) with [TypeScript plugin](https://atom.io/packages/atom-typescript)
* [Sublime Text](http://www.sublimetext.com/3) with [Typescript-Sublime-Plugin](https://github.com/Microsoft/Typescript-Sublime-plugin#installation)

### Visual Studio Code + Debugger for Chrome
> Install [Debugger for Chrome](https://marketplace.visualstudio.com/items?itemName=msjsdiag.debugger-for-chrome) and see docs for instructions to launch Chrome

The included `.vscode` automatically connects to the Webpack development server on port `8080`.

# Types
> When you include a module that doesn't include Type Definitions inside of the module you can include external Type Definitions with @types

i.e, to have youtube api support, run this command in terminal:
```shell
npm i @types/youtube @types/gapi @types/gapi.youtube
```
In some cases where your code editor doesn't support Typescript 2 yet or these types weren't listed in ```tsconfig.json```, add these to **"src/custom-typings.d.ts"** to make peace with the compile check:
```es6
import '@types/gapi.youtube';
import '@types/gapi';
import '@types/youtube';
```

## Custom Type Definitions
When including 3rd party modules you also need to include the type definition for the module
if they don't provide one within the module. You can try to install it with @types

```
npm install @types/node
npm install @types/lodash
```

If you can't find the type definition in the registry we can make an ambient definition in
this file for now. For example

```typescript
declare module "my-module" {
  export function doesSomething(value: string): string;
}
```


If you're prototyping and you will fix the types later you can also declare it as type any

```typescript
declare var assert: any;
declare var _: any;
declare var $: any;
```

If you're importing a module that uses Node.js modules which are CommonJS you need to import as

```typescript
import * as _ from 'lodash';
```

# Local Development and Testing (Updated 9/30/2021)

## Application Code Testing

In a command window, start server by running:

```
npm run server
```

In a separate command window, start client by running:

```
npm run watch
```

Review your changes by going to `http://localhost:8080/`

## New Data Testing

1. New or updated data is usually in `json` format. Make sure you have MongoDB installed locally as described in "**Running the app**" section. Then you can import your json file to your local MongoDB database by running:

```
mongoimport --db agora --collection [add collection name here] --jsonArray --drop --file [path to the json file name]
```

More examples can be found [here](https://github.com/Sage-Bionetworks/Agora/blob/develop/mongo-import.sh). 

2. Verified the data is successfully imported to the database. You may do that by using a GUI for MongoDB. The connection address to MongoDB in your local machine is `localhost` and the port number is `27017`. 

## Before Deployment
Before pushing code to the dev branch, we should follow these steps to make sure no errors during the build process. 

1. Run `npm run test` to make sure no failed unit test
2. Run `npm run clean:all`. This removes the `./dist` folder
3. Delete `node_modules`
4. Run `npm install` to re-install the `node_modules`
5. Run `npm run build:aot` to build the client code. In a separate command window, run `npm run build:server:prod` to build the server code
6. Run the server script: `node --max_old_space_size=2000  ./dist/server.js`
7. Verify the Agora app is running without error in a browser at localhost:8080

# Deployment

## Continuous Deployment
We have setup Travis to deploy Agora to our [AWS infrastructure](https://github.com/Sage-Bionetworks/Agora-infra).

We continuously deploy to three environments:
* Development -> https://agora-develop.ampadportal.org
* Staging -> https://agora-staging.ampadportal.org
* Production -> https://agora.ampadportal.org

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

## Builds
* https://app.travis-ci.com/github/Sage-Bionetworks/Agora

## Deployment for New Data (Updated 9/30/2021)
1. First, make sure the data file is available in [Synapse](https://www.synapse.org/#!Synapse:syn12177492)
2. Update data version in `data-manifest.json` in [Agora Data Manager](https://github.com/Sage-Bionetworks/agora-data-manager/). ([example](https://github.com/Sage-Bionetworks/agora-data-manager/commit/d9006f01ae01b6c896bdc075e02ae1b683ecfd65)) The version should match the `data_manifest.csv` file in [Synapse](https://www.synapse.org/#!Synapse:syn13363290). 
3. If there is a new json file (i.e. not updating existing data), add an entry to `import-data.sh`. ([example](https://github.com/Sage-Bionetworks/agora-data-manager/commit/d9006f01ae01b6c896bdc075e02ae1b683ecfd65))
4. Deploy your changes in [Agora Data Manager](https://github.com/Sage-Bionetworks/agora-data-manager/) to dev branch. 
5. Verify new data is in the database in the dev environment. 
6. Update data version in Agora app. ([example](https://github.com/Sage-Bionetworks/Agora/pull/847/files)) The version should match the `data_manifest.csv` file in [Synapse](https://www.synapse.org/#!Synapse:syn13363290). Then deploy the change to [Agora's dev branch](https://agora-develop.ampadportal.org/genes). 
7. Check the app in the dev environment to ensure that the new data shows up, and that the expected data version is displayed in the footer. 
8. Once verified, repeat step 4 to 7 to finish deployment to staging and production branches. 


## Style Guide and Project Structure

This project follows the directions provided by the official [angular style guide](https://angular.io/guide/styleguide). Things that the guide state to keep in mind:

* Define components or services that do one thing only, per file. Try to use small sized functions where possible, making it reusable.

* Keep the consistency in file and folder names. Use dashes to separate words in the descriptive prefix name and dots to separate the suffix words. Use the type and extension names in the file name, e.g. `a.component.ts`, `a.service.ts` or `a.module.ts`. The style guide has references about naming the other types of files in an Angular project.

* The guide advises to use a `main.ts` file for boostrapping, we are using the notation `main.browser.ts` since it was modified for different configurations. It is also a reminder that is where the `platform browser` is.

* Use camel case for variable names, even for constants as they are easy to read. If the values don't change, use a const declaration. For Interfaces use an upper camel case, e.g. `MyInterface`.

* The guide advises separating application from third party imports. This projects goes one step further separating imports by source and purpose also, grouping Angular framework, project components and services, third party typescript/javascript libraries separately.

* The folder structure in not restrictive in the style guide, but it should be structured in a way so it is to maintain and expand the project, and identify files in a glance. This project uses a root folder called `src` and one main folder for each module. When a spacific folder reaches seven or more files it is split into sub-folders. Another reason to split is to keep a view smart component with container dumb components as children.

* For the file structure this project uses the component approach. This is the new standard for developing Angular apps and a great way to ensure maintainable code by encapsulation of our behavior logic. A component is basically a self contained app usually in a single file or a folder with each concern as a file: style, template, specs, e2e, and component class. Here's how it looks:

```
Agora/
 ├──config/                           * configuration root folder
 |   ├──build-utils.js                * common config and shared functions for prod and dev
 |   ├──config.common.json            * config for both environments prod and dev such title and description of index.html
 │   │                                 (note: you can load your own config file, just set the evn ANGULAR_CONF_FILE with the path of your own file)
 |   ├──config.dev.json               * google analytics key, development
 |   ├──config.prod.json              * google analytics key, production
 |   ├──helpers.js                    * helper functions for our configuration files
 |   ├──spec-bundle.js                * ignore this magic that sets up our Angular testing environment
 |   ├──karma.conf.js                 * karma config for our unit tests
 |   ├──protractor.conf.js            * protractor config for our end-to-end tests
 │   ├──webpack.common.js             * common tasks for Webpack build process shared for dev and prod
 │   ├──webpack.dev.js                * development Webpack config
 │   ├──webpack.github-deploy.js      * Github pages deploy Webpack config
 │   ├──webpack.prod.js               * production Webpack config
 │   ├──webpack.server.js             * server Webpack config
 │   └──webpack.test.js               * testing Webpack config
 │
 ├──src/                              * source files that will be compiled to javascript
 |   ├──main.browser.ts               * entry file for browser environment
 │   │
 |   ├──index.html                    * Index.html: where we generate our index page
 │   │
 |   ├──polyfills.ts                  * our polyfills file
 │   │
 │   ├──app/                          * WebApp: folder
 │   │   ├──charts                    * the charts module main folder, chart specific code
 │   │   ├   |──charts.module.ts      * the charts module file, to be used by different modules
 │   │   ├   |──services              * the charts services folder
 │   │   ├   |   |──chart.service.ts  * chart related service with different utility methods
 │   │   ├   |   |──...               * other files
 │   │   ├   |──...                   * other nested folders and files including the charts themselves
 │   │   ├──core                      * the core module main folder, imports the other modules
 │   │   ├   |──core.module.ts        * the core module file, to be imported once by the app module
 │   │   ├   |──services              * the core services folder, to be used by different modules
 │   │   ├   |   |──data.service.ts   * data related service, e.g. loading data into the app
 │   │   ├   |   |──gene.service.ts   * gene related service, e.g. current selected gene
 │   │   ├   |   |──...               * other files
 │   │   ├   |──...                   * other nested folders and files
 │   │   ├──genes                     * genes module main folder
 │   │   ├   |──genes.module.ts       * the genes module file, to be imported by different modules
 │   │   ├   |──...                   * other nested files
 │   │   ├──models                    * interface definitions
 │   │   ├   |──gene.ts               * the gene interface
 │   │   ├   |──geneLink.ts           * connection between genes interface
 │   │   ├   |──...                   * other files
 │   │   ├   |──index.ts              * exports all models
 │   │   ├──schemas                   * schemas to be used by Mongoose
 │   │   ├   |──gene.ts               * the gene schema
 │   │   ├   |──geneLink.ts           * the connection between genes schema
 │   │   ├   |──...                   * other files
 │   │   ├   |──index.ts              * exports all schemas
 │   │   ├──shared                    * shared module main folder
 │   │   ├   |──shared.module.ts      * the shared module file, to be imported by other modules
 │   │   ├   |──...                   * other files
 │   │   ├──testing                   * our shared module main folder
 │   │   ├   |──gene-mocks.ts         * mocks for genes
 │   │   ├   |──data-service-stub.ts  * mock for the data service
 │   │   ├   |──gene-service-stub.ts  * mock for the gene service
 │   │   ├   |──...                   * other stub files
 │   │   ├──app.component.spec.ts     * a simple test of components in app.component.ts
 │   │   ├──app.e2e.ts                * a simple end-to-end test for /
 │   │   └──app.component.ts          * a simple version of our App component components
 │   │
 │   ├──server/                       * the server related code folder
 │   |   ├──routes/                   * folder with our api routes
 │   │   ├   |──api.js                * exports the api backend routes, connects to AWS
 │   |   └──server.js                 * declares our express server and exports it in production mode
 │   │
 │   └──assets/                       * static assets are served here
 │       ├──icon/                     * our list of icons from www.favicon-generator.org
 │       ├──service-worker.js         * ignore this. Web App service worker that's not complete yet
 │       ├──robots.txt                * for search engines to crawl your website
 │       ├──humans.txt                * for humans to know who the developers are
 │       └──...                       * other files
 │
 │
 ├──get-data-aws.sh                   * shell script to download the data using amazon credentials from the bastian
 ├──get-data-local-aws.sh             * shell script to download the data using amazon credentials locally
 ├──get-data-local.sh                 * shell script to download the data locally using Synapse credentials
 ├──set-agora-version.sh              * shell script to set the Agora version based on the remote branch latest commit SHA id
 ├──start-mongo.sh                    * shell script to start the MongoDB
 ├──tslint.json                       * typescript lint config
 ├──typedoc.json                      * typescript documentation generator
 ├──tsconfig.json                     * typescript config used outside webpack
 ├──tsconfig.webpack.json             * config that Webpack uses for typescript
 ├──package.json                      * what npm uses to manage its dependencies
 └──webpack.config.js                 * Webpack main configuration file
```

# Database

MongoDB was chosen for this project because it is an object-oriented, simple, dynamic, and scalable NoSQL database. It is based on the NoSQL document store model. The data objects are stored as separate documents inside a collection. Pros:

* Document oriented

* High performance

* High availability — Replication

* High scalability – Sharding

* Dynamic — No rigid schema.

* Flexible – field addition/deletion have less or no impact on the application

* Heterogeneous Data

* No Joins

* Distributed

* Data Representation in JSON or BSON

* Geospatial support

* Easy Integration with BigData Hadoop

* Document-based query language that’s nearly as powerful as SQL

* Cloud distributions such as AWS, Microsoft, RedHat,dotCloud and SoftLayer etc:-. In fact, MongoDB is built for the cloud. Its native scale-out architecture, enabled by ‘sharding,’ aligns well with the horizontal scaling and agility afforded by cloud computing.

# License
 [MIT](/LICENSE)
