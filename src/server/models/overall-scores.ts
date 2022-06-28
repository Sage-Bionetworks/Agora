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
    // _id: { type: String, required: true }, // Not used
    ENSG: { type: String, required: true },
    // GeneName: { type: String, required: true }, // Not used
    Logsdon: { type: Number, required: true },
    GeneticsScore: { type: Number, required: true },
    OmicsScore: { type: Number, required: true },
    LiteratureScore: { type: Number, required: true },
  },
  { collection: 'genesoverallscores' }
);

const OverallScoresDistributionSchema = new Schema(
  {
    // _id: { type: String, required: true }, // Not used
    distribution: [{ type: Number, required: true }],
    bins: [[{ type: Number, required: true }]], // Array of [binStart, binEnd]
    // min: { type: Number, required: true }, // Not used
    // max: { type: Number, required: true }, // Not used
    // mean: { type: Number, required: true }, // Not used
    // first_quartile: { type: Number, required: true }, // Not used
    // third_quartile: { type: Number, required: true }, // Not used
    name: { type: String, required: true },
    syn_id: { type: String, required: true }, // Wiki's ownerId
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
