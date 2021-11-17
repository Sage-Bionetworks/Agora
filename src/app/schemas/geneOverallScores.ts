import { Schema, Model, model } from 'mongoose';
import { GeneOverallScoresDocument } from '../models';

export let GenesOverallScoresSchema: Schema = new Schema(
    {
        ENSG: {
            required: true,
            type: String
        },
        GeneName: {
            required: false,
            type: String
        },
        Logsdon: {
            required: false,
            type: Number
        },
        GeneticsScore: {
            required: false,
            type: Number
        },
        OmicsScore: {
            required: false,
            type: Number
        },
        LiteratureScore: {
            required: false,
            type: Number
        }
    }, {
        collection: 'genesoverallscores',
        timestamps: true
    }
);

GenesOverallScoresSchema.set('autoIndex', false);
GenesOverallScoresSchema.index(
    {
        GeneName: 'text'
    }
);

export const GenesOverallScores: Model<GeneOverallScoresDocument> =
    model<GeneOverallScoresDocument>('genesoverallscores', GenesOverallScoresSchema);
