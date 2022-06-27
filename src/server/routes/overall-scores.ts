// -------------------------------------------------------------------------- //
// External
// -------------------------------------------------------------------------- //
import { Schema, model } from 'mongoose';

// -------------------------------------------------------------------------- //
// Internal
// -------------------------------------------------------------------------- //
import { cache } from '../cache';

// -------------------------------------------------------------------------- //
// Schemas
// -------------------------------------------------------------------------- //

const OverallScoresSchema = new Schema(
  {
    ENSG: String,
  },
  { collection: 'genesoverallscores' }
);
const OverallScoresCollection = model(
  'OverallScoresCollection',
  OverallScoresSchema
);

// -------------------------------------------------------------------------- //
// Functions
// -------------------------------------------------------------------------- //

export async function getGeneOverallScores(ensg: string) {
  let result: any = cache.get('overall-score-' + ensg);

  if (result) {
    return result;
  }

  result = await OverallScoresCollection.findOne({
    ENSG: ensg,
  })
    .lean()
    .exec();

  if (result) {
    const normalized: { [key: string]: any } = {};

    // Normalize keys to lowercase
    Object.keys(result).forEach((k: string) => {
      normalized[k.toLowerCase()] = result[k];
    });

    result = normalized;
  }

  cache.set('overall-score-' + ensg, result);
  return result;
}
