// -------------------------------------------------------------------------- //
// Internal
// -------------------------------------------------------------------------- //
import { cache } from '../cache';
import {
  ProteinDifferentialExpression,
  ProteinLFQCollection,
  ProteinTMTCollection,
} from '../models';

// -------------------------------------------------------------------------- //
// Functions
// -------------------------------------------------------------------------- //

export async function getProteinLFQ(ensg: string) {
  const cacheKey = ensg + 'protein-differential-expression';
  let result: ProteinDifferentialExpression[] | undefined = cache.get(cacheKey);

  if (result) {
    return result;
  }

  result = await ProteinLFQCollection.find({
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

export async function getProteinTMT(ensg: string) {
  const cacheKey = ensg + 'protein-TMT';
  let result: ProteinDifferentialExpression[] | undefined = cache.get(cacheKey);

  if (result) {
    return result;
  }

  result = await ProteinTMTCollection.find({
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
