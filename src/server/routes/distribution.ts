// -------------------------------------------------------------------------- //
// External imports
// -------------------------------------------------------------------------- //
import { Schema, model } from 'mongoose';

// -------------------------------------------------------------------------- //
// Internal imports
// -------------------------------------------------------------------------- //
import { cache } from '../cache';
import { setHeaders } from '../helpers';

// -------------------------------------------------------------------------- //
// Schemas
// -------------------------------------------------------------------------- //

const RnaDistributionSchema = new Schema(
  {},
  { collection: 'rnaboxdistribution' }
);
const RnaDistributionCollection = model(
  'RnaDistributionCollection',
  RnaDistributionSchema
);

const ProteomicsDistributionSchema = new Schema(
  {},
  { collection: 'proteomicsboxdistribution' }
);
const ProteomicsDistributionCollection = model(
  'ProteomicsDistributionCollection',
  ProteomicsDistributionSchema
);

const ScoreDistributionSchema = new Schema(
  {},
  { collection: 'genescoredistribution' }
);
const ScoreDistributionCollection = model(
  'ScoreDistributionCollection',
  ScoreDistributionSchema
);

// -------------------------------------------------------------------------- //
//
// -------------------------------------------------------------------------- //

export async function getRnaDistribution() {
  try {
    let result: any = cache.get('rna-distribution');

    if (result) {
      return result;
    }

    result = await RnaDistributionCollection.find().lean().exec();
    cache.set('rna-distribution', result);
    return result;
  } catch (err) {
    //handleError(err);
    console.error(err);
    return;
  }
}

// -------------------------------------------------------------------------- //
//
// -------------------------------------------------------------------------- //

export async function getProteomicsDistribution() {
  try {
    let result: any = cache.get('proteomics-distribution');

    if (result) {
      return result;
    }

    result = await ProteomicsDistributionCollection.find().lean().exec();
    cache.set('proteomics-distribution', result);
    return result;
  } catch (err) {
    //handleError(err);
    console.error(err);
    return;
  }
}

// -------------------------------------------------------------------------- //
//
// -------------------------------------------------------------------------- //

export async function getScoreDistribution() {
  try {
    let result: any = cache.get('score-distribution');

    if (result) {
      return result;
    }

    result = await ScoreDistributionCollection.find()
      .sort('name')
      .lean()
      .exec();

    // Handle old format
    if (result.length === 1) {
      result = Object.values(result[0]).filter(
        (d: any) => d.distribution?.length
      );
    }

    cache.set('score-distribution', result);
    return result;
  } catch (err) {
    //handleError(err);
    console.error(err);
    return;
  }
}

// -------------------------------------------------------------------------- //
//
// -------------------------------------------------------------------------- //

export async function getDistribution() {
  try {
    let result: any = cache.get('distribution');

    if (result) {
      return result;
    }

    result = {
      rna: await getRnaDistribution(),
      proteomics: await getProteomicsDistribution(),
      score: await getScoreDistribution(),
    };

    cache.set('distribution', result);
    return result;
  } catch (err) {
    //handleError(err);
    console.error(err);
    return;
  }
}

// -------------------------------------------------------------------------- //
//
// -------------------------------------------------------------------------- //

export async function distributionRoute(req: any, res: any) {
  setHeaders(res);
  res.json(await getDistribution());
}
