// -------------------------------------------------------------------------- //
// Internal
// -------------------------------------------------------------------------- //
import { cache } from '../cache';
import {
  ExperimentalValidation,
  ExperimentalValidationCollection,
} from '../models';

// -------------------------------------------------------------------------- //
// Functions
// -------------------------------------------------------------------------- //

export async function getExperimentalValidation(ensg: string) {
  let result: ExperimentalValidation[] | undefined = cache.get(
    'experimental-validation-' + ensg
  );

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
}
