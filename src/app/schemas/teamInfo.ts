import { Schema, Model, model } from 'mongoose';
import { TeamInfoDocument } from '../models';

export let TeamInfoSchema: Schema = new Schema({}, { collection: 'teaminfo' });

// Mongoose forces a lowcase name for collections when using the queries
export const TeamsInfo: Model<TeamInfoDocument> =
                model<TeamInfoDocument>('teaminfo', TeamInfoSchema);
