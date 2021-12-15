import { Schema, Model, model } from 'mongoose';
import { GeneOverallScoresDocument } from '../models';

export let GenesOverallScoresSchema: Schema = new Schema({}, { collection: 'genesoverallscores' });

export const GenesOverallScores: Model<GeneOverallScoresDocument> =
    model<GeneOverallScoresDocument>('genesoverallscores', GenesOverallScoresSchema);
