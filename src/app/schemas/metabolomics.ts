import { Schema, Model, model } from 'mongoose';
import { MetabolomicsDocument } from '../models';

export let MetabolomicsSchema: Schema = new Schema({}, { collection: 'genesmetabolomics' });

// Mongoose forces a lowcase name for collections when using the queries
export const GenesMetabolomics: Model<MetabolomicsDocument> =
                model<MetabolomicsDocument>('genesmetabolomics', MetabolomicsSchema);
