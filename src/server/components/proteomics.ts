// -------------------------------------------------------------------------- //
// Internal
// -------------------------------------------------------------------------- //
import { cache } from '../cache';
import {
  ProteinDifferentialExpression,
  ProteinDifferentialExpressionCollection,
} from '../models';

// -------------------------------------------------------------------------- //
// Functions
// -------------------------------------------------------------------------- //

export async function getProteinDifferentialExpression(ensg: string) {
  const cacheKey = ensg + 'protein-differential-expression';
  let result: ProteinDifferentialExpression[] | undefined = cache.get(cacheKey);

  if (result) {
    return result;
  }

  result = await ProteinDifferentialExpressionCollection.find({
    ensembl_gene_id: ensg,
  })
    .lean()
    .exec();

  if (result) {
    result = result.filter((item: any) => {
      return item.log2_fc /*&& p.uniprotid === filter*/;
    });
  }

  cache.set(cacheKey, result);
  return result;
}
