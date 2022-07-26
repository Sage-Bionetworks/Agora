// -------------------------------------------------------------------------- //
// External
// -------------------------------------------------------------------------- //
import { Schema, model } from 'mongoose';

// -------------------------------------------------------------------------- //
// Internal
// -------------------------------------------------------------------------- //
import { OverallScores, OverallScoresDistribution } from '../../app/models';
export { OverallScores, OverallScoresDistribution } from '../../app/models';

// -------------------------------------------------------------------------- //
// Schemas
// -------------------------------------------------------------------------- //

const OverallScoresSchema = new Schema<OverallScores>(
  {
    ENSG: { type: String, required: true },
    Logsdon: { type: Number, required: true },
    GeneticsScore: { type: Number, required: true },
    OmicsScore: { type: Number, required: true },
    LiteratureScore: { type: Number, required: true },
  },
  { collection: 'genesoverallscores' }
);

const OverallScoresDistributionSchema = new Schema(
  {
    distribution: [{ type: Number, required: true }],
    bins: [[{ type: Number, required: true }]],
    name: { type: String, required: true },
    syn_id: { type: String, required: true },
    wiki_id: { type: String, required: true },
  },
  { collection: 'genescoredistribution' }
);

// -------------------------------------------------------------------------- //
// Models
// -------------------------------------------------------------------------- //

export const OverallScoresCollection = model<OverallScores>(
  'OverallScoresCollection',
  OverallScoresSchema
);

export const OverallScoresDistributionCollection =
  model<OverallScoresDistribution>(
    'OverallScoresDistributionCollection',
    OverallScoresDistributionSchema
  );
