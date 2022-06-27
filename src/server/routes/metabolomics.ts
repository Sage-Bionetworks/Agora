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

const MetabolomicsSchema = new Schema(
  {
    ensembl_gene_id: String,
  },
  { collection: 'genesmetabolomics' }
);
const MetabolomicsCollection = model(
  'MetabolomicsCollection',
  MetabolomicsSchema
);

// -------------------------------------------------------------------------- //
// Functions
// -------------------------------------------------------------------------- //

export async function getGeneMetabolomics(ensg: string) {
  try {
    let result: any = cache.get('metabolomics-' + ensg);

    if (result) {
      return result;
    }

    result = await MetabolomicsCollection.findOne({
      ensembl_gene_id: ensg,
    })
      .lean()
      .exec();

    cache.set('metabolomics-' + ensg, result);
    return result;
  } catch (err) {
    //handleError(err);
    console.error(err);
    return;
  }
}
