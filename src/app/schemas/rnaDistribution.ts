import { Schema, Model, model } from 'mongoose';
import { RnaDistributionDocument } from '../models';

export let RnaDistributionSchema: Schema = new Schema({}, { collection: 'rnaboxdistribution' });

// Mongoose forces a lowcase name for collections when using the queries
export const RnaDistribution: Model<RnaDistributionDocument> = model<RnaDistributionDocument>(
    'rnaboxdistribution',
    RnaDistributionSchema
);
