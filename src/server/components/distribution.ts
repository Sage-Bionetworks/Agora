// -------------------------------------------------------------------------- //
// External imports
// -------------------------------------------------------------------------- //
import { Schema, model } from 'mongoose';

// -------------------------------------------------------------------------- //
// Internal imports
// -------------------------------------------------------------------------- //
import { cache } from '../cache';
import { setHeaders } from '../helpers';
import {
  getOverallScoresDistribution,
  getRnaDifferentialExpressionDistribution,
} from './';

// -------------------------------------------------------------------------- //
// Schemas
// -------------------------------------------------------------------------- //

const ProteomicsDistributionSchema = new Schema(
  {},
  { collection: 'proteomicsboxdistribution' }
);
const ProteomicsDistributionCollection = model(
  'ProteomicsDistributionCollection',
  ProteomicsDistributionSchema
);

// -------------------------------------------------------------------------- //
//
// -------------------------------------------------------------------------- //

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
      rna_differential_expression:
        await getRnaDifferentialExpressionDistribution(),
      proteomics: await getProteomicsDistribution(),
      overall_scores: await getOverallScoresDistribution(),
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
