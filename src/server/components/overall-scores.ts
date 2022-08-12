// -------------------------------------------------------------------------- //
// Internal
// -------------------------------------------------------------------------- //
import { cache } from '../cache';
import { OverallScores, OverallScoresCollection } from '../models';

// -------------------------------------------------------------------------- //
// Functions
// -------------------------------------------------------------------------- //
export async function getOverallScores(ensg: string) {
  const cacheKey = ensg + '-overall-scores';
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
  return result || undefined;
}
