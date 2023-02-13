// -------------------------------------------------------------------------- //
// Internal
// -------------------------------------------------------------------------- //
import { cache } from '../helpers';
import { Scores, ScoresCollection } from '../models';

// -------------------------------------------------------------------------- //
// Functions
// -------------------------------------------------------------------------- //

export async function getAllScores() {
  let scores: Scores[] | undefined = cache.get('scores');

  if (scores) {
    return scores;
  }

  scores = await ScoresCollection.find().lean().exec();

  cache.set('scores', scores);
  return scores;
}

export async function getTargetRiskScore(ensg: string) {
  const cacheKey = ensg + '-scores';
  let result: Scores | null | undefined = cache.get(cacheKey);

  if (result) {
    return result.target_risk_score;
  }

  result = await ScoresCollection.findOne(
    {
      ensembl_gene_id: ensg,
    },
    { _id: 0, Logsdon: 1, GeneticsScore: 1, OmicsScore: 1, LiteratureScore: 1 }
  )
    .lean()
    .exec();

  cache.set(cacheKey, result);
  return result?.target_risk_score || null;
}

export async function getGeneticsScore(ensg: string) {
  const cacheKey = ensg + '-scores';
  let result: Scores | null | undefined = cache.get(cacheKey);

  if (result) {
    return result.target_risk_score;
  }

  result = await ScoresCollection.findOne(
    {
      ensembl_gene_id: ensg,
    },
    { _id: 0, Logsdon: 1, GeneticsScore: 1, OmicsScore: 1, LiteratureScore: 1 }
  )
    .lean()
    .exec();

  cache.set(cacheKey, result);
  return result?.target_risk_score || null;
}

export async function getMultiomicsScore(ensg: string) {
  const cacheKey = ensg + '-scores';
  let result: Scores | null | undefined = cache.get(cacheKey);

  if (result) {
    return result.target_risk_score;
  }

  result = await ScoresCollection.findOne(
    {
      ensembl_gene_id: ensg,
    },
    { _id: 0, Logsdon: 1, GeneticsScore: 1, OmicsScore: 1, LiteratureScore: 1 }
  )
    .lean()
    .exec();

  cache.set(cacheKey, result);
  return result?.target_risk_score || null;
}