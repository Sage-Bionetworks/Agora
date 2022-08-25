// -------------------------------------------------------------------------- //
// External
// -------------------------------------------------------------------------- //
import { Schema, model } from 'mongoose';

// -------------------------------------------------------------------------- //
// Internal
// -------------------------------------------------------------------------- //
import { OverallScores } from '../../app/models';
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

// -------------------------------------------------------------------------- //
// Models
// -------------------------------------------------------------------------- //
export const OverallScoresCollection = model<OverallScores>(
  'OverallScoresCollection',
  OverallScoresSchema
);
