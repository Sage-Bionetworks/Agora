// -------------------------------------------------------------------------- //
// External
// -------------------------------------------------------------------------- //
import * as express from 'express';
import * as mongoose from 'mongoose';
import * as awsParamStore from 'aws-param-store';

// -------------------------------------------------------------------------- //
// Internal
// -------------------------------------------------------------------------- //
import {
  allBiodomainsRoute,
  biodomainsRoute,
  comparisonGenesRoute,
  distributionRoute,
  geneRoute,
  genesRoute,
  nominatedGenesRoute,
  searchGeneRoute,
  teamMemberImageRoute,
  teamsRoute,
} from './components';

// -------------------------------------------------------------------------- //
// Mongo Connection
// -------------------------------------------------------------------------- //
const database = { url: '' };

// Uncomment when in need of verbose debugging
/* mongoose.set('debug', function(coll, method, query, doc) {
    console.log(
        '\n\n',
        ' => Query executed: ',
        '\ncollection => ' + coll,
        '\nmethod => ' + method,
        '\ndata => ' + util.inspect(query),
        '\n',
        doc && ('doc => ' + util.inspect(doc)), '\n');
}); */

console.log(process.env);
console.log(process.env.MONGODB_HOST);
console.log(process.env.MONGODB_PORT);

// Set the database url
if (
  process.env.MONGODB_HOST &&
  process.env.MONGODB_PORT &&
  process.env.APP_ENV
) {
  const results = awsParamStore.getParametersSync(
    [
      '/agora-' + process.env.APP_ENV + '/MongodbUsername',
      '/agora-' + process.env.APP_ENV + '/MongodbPassword',
    ],
    { region: 'us-east-1' }
  );
  
  if (results && results.Parameters) {
    database.url =
      'mongodb://' +
      results.Parameters[1]['Value'] +
      ':' +
      results.Parameters[0]['Value'] +
      '@' +
      process.env.MONGODB_HOST +
      ':' +
      process.env.MONGODB_PORT +
      '/agora' +
      '?authSource=admin';
  }
} else {
  database.url = 'mongodb://localhost:27017/agora';
}

mongoose.connect(database.url);

// Get the default connection
const connection = mongoose.connection;

// Bind connection to error event (to get notification of connection errors)
connection.on(
  'error',
  console.error.bind(console, 'MongoDB connection error:')
);

// -------------------------------------------------------------------------- //
// Routes
// -------------------------------------------------------------------------- //
const router = express.Router();

connection.once('open', async () => {
  router.get('/biodomains', allBiodomainsRoute);
  router.get('/biodomains/:id', biodomainsRoute);
  router.get('/genes/search', searchGeneRoute);
  router.get('/genes/comparison', comparisonGenesRoute);
  router.get('/genes/nominated', nominatedGenesRoute);
  router.get('/genes/:id', geneRoute);
  router.get('/genes', genesRoute);
  router.get('/distribution', distributionRoute);
  router.get('/teams', teamsRoute);
  router.get('/team-member/:name/image', teamMemberImageRoute);
});

export default router;
