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

const NeuropathCorrelationsSchema = new Schema(
  {
    ensg: String,
  },
  { collection: 'genesneuropathcorr' }
);
const NeuropathCorrelationsCollection = model(
  'NeuropathCorrelationsCollection',
  NeuropathCorrelationsSchema
);

// -------------------------------------------------------------------------- //
//
// -------------------------------------------------------------------------- //

export async function getGeneNeuropathCorrelations(ensg: string) {
  try {
    let result: any = cache.get('neuropath-correlations-' + ensg);

    if (result) {
      return result;
    }

    result = await NeuropathCorrelationsCollection.find({ ensg: ensg })
      .lean()
      .exec();
    cache.set('neuropath-correlations-' + ensg, result);
    return result;
  } catch (err) {
    //handleError(err);
    console.error(err);
    return;
  }
}
