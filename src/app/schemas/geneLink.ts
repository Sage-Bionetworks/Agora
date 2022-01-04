import { Schema, Model, model } from 'mongoose';
import { GeneLinkDocument } from '../models';

export let GeneLinkSchema: Schema = new Schema({}, { collection: 'geneslinks' });

// Mongoose forces a lowcase name for collections when using the queries
export const GenesLinks: Model<GeneLinkDocument> =
                model<GeneLinkDocument>('geneslinks', GeneLinkSchema);
