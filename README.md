# Wall of Targets

## Getting Started
```bash
# clone our repo
git clone https://github.com/Sage-Bionetworks/WallOfTargets.git

# change directory to our repo
cd WallOfTargets

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
* `webpack` (`npm install --global webpack`)
* `webpack-dev-server` (`npm install --global webpack-dev-server`)
* `karma` (`npm install --global karma-cli`)
* `protractor` (`npm install --global protractor`)
* `rimraf` {`npm install --global rimraf`}
* `typescript` (`npm install --global typescript`)
* `cross-env` (`npm install --global cross-env`)

## Running the app

* Local development environment

For local development you'll need the MongoDB Local (Downloadable Version). For a guid on how to install MongoDB, go to [this link](https://docs.mongodb.com/manual/administration/install-community/). On Windows, you can get it from the following Download Center link [here](https://www.mongodb.com/download-center?_ga=2.62089900.1820272119.1524602800-952612734.1523898940&_gac=1.79428326.1523898940.CjwKCAjwk9HWBRApEiwA6mKWacqRgoYOQ4ayn_M_ol5d5C7yy0aTEbZjKsersvLRfXJAozzJyqu29RoClFoQAvD_BwE#production).

After you downloaded it, go to the root of your `C` drive and create a `data` folder. After that, `cd` into the `data` folder and make a new folder called `db`.
Mongo knows to go to this folder automatically to retrieve and store data. To run MongoDB, you need to start the process at the installation location, e.g. go to:

```bash
C:\\Users\\YOUR_USER>cd "C:\Program Files\MongoDB\Server\3.6\bin"

C:\\Program Files\\MongoDB\\Server\\3.6\\bin>mongod
```

You should see a connection to port `27017` (MongoDB default port). You can also specify an alternate path and port for this. The connection itself will come from
our Express server through Mongoose (a framework that allows us to define objects with a strongly-typed schema that is mapped to a MongoDB document).

```bash
[initandlisten] waiting for connections on port 27017
```

If you also installed MongoDB Compass along with the main installation (a GUI to manage your MongoDB databases), just open it and connect to your localhost (use the default values). You'll notice a few connections opened in the cmd prompt with the database running (the one open with MongoDB listening on port `27017`). You should see something like:

```bash
[listener] connection accepted from 127.0.0.1:57948 #2 (2 connections now open)
```

Go back to Compass and create a database called `walloftargets`. In the Create Database form, use `genes` for the collection name. Now that we are all set, it is time to load
the data into our collection. Download the complete genes data in json form from Synapse repository [here](https://www.synapse.org/#!Synapse:syn12177499).

To regenerate the json file, start by downloading the complete genes data from [here](https://www.synapse.org/#!Synapse:syn11318688).

Install a global Node package to convert the `csv` to `json`:

```bash
$ npm i -g csvtojson
```

Navigate to the folder with the complete data and issue the following command:

```bash
$ csvtojson data.csv > data.json
```

Now go back to the Mongo binary folder directory (same folder you issued the `mongod` command). In that folder just use the following command:

```bash
mongoimport --db walloftargets --collection genes --drop --jsonArray --file "C:\PATH\TO\FILE\data.json"
```

We will be using lowercase name for the collection because Mongoose uses lowercase names for collections (even if you try to use an uppercase one).

* Remote production environment

To be added.

* Summing-up we have:

> Local development using local DynamoDB and the development mode to build and run the app. The database needs to be started and will be listening on port 8000.

> Remote development using tables created through Amazon console in the DynamoDB section. Here we are going to build our app with the production flag and copy the dist folder to the EC2 instance. We need to connect to the instance and run the app from the remote folder.

> If you are planning on running without AWS

To clean all AWS references, uninstall all the package dependencies related to AWS in the package.json and remove the references within the code.

* Final step

After you have installed all dependencies and got every requirement ready you can run the app. Open the project in an IDE or navigate to the root project folder and, in a terminal opened in that folder, you can run:

```bash
npm run build:dev
```

This builds the client-side of the application. The client configuration run webpack with the `--watch` flag, so any change to the `src/` folder (except the `src/server` folder) will rebuild the application. Leave that terminal open and open another one. In the second one you can issue our second command to get the server up and running.

```bash
npm start
```

The server configuration uses the `nodemon-webpack-plugin` when building, so if you run the server with `npm run server` or `npm start`, it will reload if you change files in the `src/server` folder.

At the moment, you need to reload the page after changing the files on the client-side. You don't need to stop the server when doing this because they use different packaging pipes. You need to restart the server when changing a route name or a configuration file, for instance. In this case, just stop the server and do another `npm start`.

The Express server will route the app for us and will communicate to MongoDB through Mongoose, the requests will be sent back to the Angular front-end. **Since we are loading a huge database locally, it is recommended that you have a good amount of RAM so the MongoDB will not crash**.

### build files
```bash
# development
npm run build:dev
# production (jit)
npm run build:prod
# AoT
npm run build:aot
```

### server
```bash
# development
npm start
# production
npm run build:server:prod
```

go to [http://0.0.0.0:3000](http://0.0.0.0:3000) or [http://localhost:3000](http://localhost:3000) in your browser

## Other commands

### hot module replacement
```bash
npm run server:dev:hmr
```

### watch and build files
```bash
npm run watch
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
# this will test both your JIT and AoT builds
npm run ci
```

### run Protractor's elementExplorer (for end-to-end)
```bash
npm run e2e:live
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

The included `.vscode` automatically connects to the webpack development server on port `3000`.

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

# Deployment

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
angular-starter/
 ├──config/                        * our configuration
 |   ├──build-utils.js             * common config and shared functions for prod and dev
 |   ├──config.common.json         * config for both environments prod and dev such title and description of index.html
 |   ├──config.dev.json            * config for devevlopment environment
 |   ├──config.prod.json           * config for production environment
 │   │                              (note: you can load your own config file, just set the evn ANGULAR_CONF_FILE with the path of your own file)
 |   ├──helpers.js                 * helper functions for our configuration files
 |   ├──spec-bundle.js             * ignore this magic that sets up our Angular testing environment
 |   ├──karma.conf.js              * karma config for our unit tests
 |   ├──protractor.conf.js         * protractor config for our end-to-end tests
 │   ├──webpack.common.js          * common tasks for webpack build process shared for dev and prod
 │   ├──webpack.dev.js             * our development webpack config
 │   ├──webpack.prod.js            * our production webpack config
 │   ├──webpack.server.js          * our server webpack config
 │   └──webpack.test.js            * our testing webpack config
 │
 ├──src/                           * our source files that will be compiled to javascript
 |   ├──main.browser.ts            * our entry file for our browser environment
 │   │
 |   ├──index.html                    * Index.html: where we generate our index page
 │   │
 |   ├──polyfills.ts                  * our polyfills file
 │   │
 │   ├──app/                          * WebApp: folder
 │   │   ├──charts                    * the charts module main folder, chart specific code
 │   │   ├   |──charts.module.ts      * the charts module file
 │   │   ├   |──services              * the core services folder, to be used by different modules
 │   │   ├   |   |──chart.service.ts  * chart related service, to be used only in this module
 │   │   ├   |   |──...               * other nested files
 │   │   ├   |──...                   * other nested files
 │   │   ├──core                      * the core module main folder, imports the other modules
 │   │   ├   |──core.module.ts        * the core module file, to be imported once by the app module
 │   │   ├   |──services              * the core services folder, to be used by different modules
 │   │   ├   |   |──data.service.ts   * data related service, e.g. loading data into the app
 │   │   ├   |   |──gene.service.ts   * gene related service, e.g. current selected gene
 │   │   ├   |   |──...               * other nested files
 │   │   ├   |──...                   * other nested files
 │   │   ├──models                    * our interface definitions
 │   │   ├   |──gene.ts               * the gene interface
 │   │   ├   |──index.ts              * exports all models
 │   │   ├──shared                    * our shared module main folder, to be imported by other modules
 │   │   ├   |──shared.module.ts      * the shared module file
 │   │   ├   |──...                   * other nested files
 │   │   ├──genes                     * our genes module main folder
 │   │   ├   |──genes.module.ts       * the genes module file
 │   │   ├   |──...                   * other nested files
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
 │       └──humans.txt                * for humans to know who the developers are
 │
 │
 ├──tslint.json                       * typescript lint config
 ├──typedoc.json                      * typescript documentation generator
 ├──tsconfig.json                     * typescript config used outside webpack
 ├──tsconfig.webpack.json             * config that webpack uses for typescript
 ├──package.json                      * what npm uses to manage its dependencies
 └──webpack.config.js                 * webpack main configuration file
```

# Database

DynamoDB was chosen for this project because it is consistent, single-digit millisecond latency at any scale. It is Amazon's key-value NoSQL database, a fully managed cloud database that supports both document and key-value store models. It works great with the `aws-sdk` and is easy to start developing locally and remotelly.

# License
 [MIT](/LICENSE)
