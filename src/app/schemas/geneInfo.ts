import { Schema, Model, model } from 'mongoose';
import { GeneInfoDocument } from '../models';

export let GeneInfoSchema: Schema = new Schema({}, { collection: 'geneinfo' });

// Mongoose forces a lowcase name for collections when using the queries
export const GenesInfo: Model<GeneInfoDocument> = model<GeneInfoDocument>('geneinfo', GeneInfoSchema);
