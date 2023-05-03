// -------------------------------------------------------------------------- //
// Internal
// -------------------------------------------------------------------------- //
import { cache } from '../helpers';
import { BioDomains, BioDomainsCollection } from '../models';

// -------------------------------------------------------------------------- //
// Functions
// -------------------------------------------------------------------------- //
export async function getBioDomains(ensg: string) {
  const cacheKey = ensg + '-biodomains';
  let result: BioDomains | null | undefined = cache.get(cacheKey);

  if (result) {
    return result;
  }

  result = await BioDomainsCollection.findOne({
    ensembl_gene_id: ensg,
  })
    .lean()
    .exec();

  cache.set(cacheKey, result);
  return result || undefined;
}
