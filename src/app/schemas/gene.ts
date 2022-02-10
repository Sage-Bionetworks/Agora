import { Schema, Model, model } from 'mongoose';
import { GeneDocument } from '../models';

export let GeneSchema: Schema = new Schema({}, { collection: 'genes' });

// Mongoose forces a lowcase name for collections when using the queries
export const Genes: Model<GeneDocument> = model<GeneDocument>('genes', GeneSchema);
