import { Schema, Model, model } from 'mongoose';
import { NeuropathCorrDocument } from '../models';

export let NeuropathCorrSchema: Schema = new Schema({}, { collection: 'genesneuropathcorr' });

export const NeuropathCorrs: Model<NeuropathCorrDocument> =
    model<NeuropathCorrDocument>('genesneuropathcorr', NeuropathCorrSchema);
