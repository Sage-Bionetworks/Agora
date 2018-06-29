import { Schema, Model, model } from 'mongoose';
import { TeamInfoDocument } from '../models';

export let TeamMemberSchema: Schema = new Schema(
    {
        name: {
            required: true,
            type: String
        },
        isprimaryinvestigator: {
            required: true,
            type: Boolean
        },
        url: {
            required: false,
            type: String
        }
    }
);

export let TeamInfoSchema: Schema = new Schema(
    {
        team: {
            required: true,
            type: String,
        },
        description: {
            required: true,
            type: String,
        },
        members: {
            required: true,
            type: [TeamMemberSchema]
        }
    }, {
        collection: 'teaminfo',
        timestamps: true
    }
);

// Handler **must** take 3 parameters: the error that occurred, the document
// in question, and the `next()` function
TeamInfoSchema.post('save', function(error, doc, next) {
    if (error.name === 'MongoError' && error.code === 11000) {
        next(new Error('There was a duplicate key error'));
    } else {
        next(error);
    }
});

// Mongoose forces a lowcase name for collections when using the queries
export const TeamsInfo: Model<TeamInfoDocument> =
                model<TeamInfoDocument>('teaminfo', TeamInfoSchema);
