import { Schema, Model, model } from 'mongoose';
import { ProteomicsDocument } from '../models';

export let ProteomicsSchema: Schema = new Schema({}, { collection: 'genesproteomics' });

// Mongoose forces a lowcase name for collections when using the queries
export const GenesProteomics: Model<ProteomicsDocument> =
                model<ProteomicsDocument>('genesproteomics', ProteomicsSchema);
