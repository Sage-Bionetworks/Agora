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

const ExperimentalValidationSchema = new Schema(
  {
    ensembl_gene_id: String,
  },
  { collection: 'geneexpvalidation' }
);
const ExperimentalValidationCollection = model(
  'ExperimentalValidationCollection',
  ExperimentalValidationSchema
);

// -------------------------------------------------------------------------- //
// Functions
// -------------------------------------------------------------------------- //

export async function getGeneExperimentalValidation(ensg: string) {
  try {
    let result: any = cache.get('experimental-validation-' + ensg);

    if (result) {
      return result;
    }

    result = await ExperimentalValidationCollection.find({
      ensembl_gene_id: ensg,
    })
      .lean()
      .exec();

    cache.set('experimental-validation-' + ensg, result);
    return result;
  } catch (err) {
    //handleError(err);
    console.error(err);
    return;
  }
}
