import { Schema, Model, model } from 'mongoose';
import { GeneExpValidationDocument } from '../models';

export let GeneExpValidationSchema: Schema = new Schema({}, { collection: 'geneexpvalidation' });

export const GenesExperimentalValidation: Model<GeneExpValidationDocument> =
    model<GeneExpValidationDocument>('geneexpvalidation', GeneExpValidationSchema);
