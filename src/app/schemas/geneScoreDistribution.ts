import { Schema, Model, model } from 'mongoose';
import { GeneScoreDistributionDocument } from '../models';

export let GeneScoreDistributionSchema: Schema = new Schema(
    {
        ensg: {
            required: true,
            type: String
        },
        gname: {
            required: true,
            type: String
        },
        logsdon: {
            required: true,
            type: Object
        },
        geneticsscore: {
            required: true,
            type: Object
        },
        omicsscore: {
            required: true,
            type: Object
        },
        literaturescore: {
            required: true,
            type: Object
        },
    }, {
        collection: 'genescoredistribution',
        timestamps: true
    }
);

GeneScoreDistributionSchema.set('autoIndex', false);
GeneScoreDistributionSchema.index(
    {
        ensg: 'text',
        gname: 'text',
    }
);

export const GenesScoreDistribution: Model<GeneScoreDistributionDocument> =
    model<GeneScoreDistributionDocument>('genescoredistribution', GeneScoreDistributionSchema);
