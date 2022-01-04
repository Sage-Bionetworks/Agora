import { Schema, Model, model } from 'mongoose';
import { GeneScoreDistributionDocument } from '../models';

export let GeneScoreDistributionSchema: Schema = new Schema({}, { collection: 'genescoredistribution' });

export const GenesScoreDistribution: Model<GeneScoreDistributionDocument> =
    model<GeneScoreDistributionDocument>('genescoredistribution', GeneScoreDistributionSchema);
