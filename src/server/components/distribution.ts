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
  {
    type: String,
  },
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

export async function getProteomicsDistribution(type: string) {
  const cacheKey = 'proteomics-' + type + '-distribution';
  let result: any = cache.get(cacheKey);

  if (result) {
    return result;
  }

  result = await ProteomicsDistributionCollection.find({ type: type })
    .lean()
    .exec();
  cache.set(cacheKey, result);
  return result;
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
      proteomics: await getProteomicsDistribution('LFQ'),
      proteomic_LFQ: await getProteomicsDistribution('LFQ'),
      proteomic_TMT: await getProteomicsDistribution('TMT'),
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
