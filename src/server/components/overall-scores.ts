// -------------------------------------------------------------------------- //
// Internal
// -------------------------------------------------------------------------- //
import { cache } from '../cache';
import {
  OverallScores,
  OverallScoresCollection,
  OverallScoresDistributionCollection,
} from '../models';

// -------------------------------------------------------------------------- //
// Functions
// -------------------------------------------------------------------------- //

export async function getOverallScores(ensg: string) {
  const cacheKey = ensg + 'ranking-scores';
  let result: OverallScores | null | undefined = cache.get(cacheKey);

  if (result) {
    return result;
  }

  result = await OverallScoresCollection.findOne(
    {
      ENSG: ensg,
    },
    { _id: 0, Logsdon: 1, GeneticsScore: 1, OmicsScore: 1, LiteratureScore: 1 }
  )
    .lean()
    .exec();

  cache.set(cacheKey, result);
  return result;
}

export async function getOverallScoresDistribution() {
  const cacheKey = 'overall-scores-distribution';
  let result: any = cache.get(cacheKey);

  if (result) {
    return result;
  }

  result = await OverallScoresDistributionCollection.find(
    {},
    {
      _id: 0,
      distribution: 1,
      bins: 1,
      name: 1,
      syn_id: 1,
      wiki_id: 1,
    }
  )
    .sort('name')
    .lean()
    .exec();

  // Handle old format
  if (result.length === 1) {
    result = Object.values(result[0]).filter(
      (d: any) => d.distribution?.length
    );
  }

  cache.set(cacheKey, result);
  return result;
}
