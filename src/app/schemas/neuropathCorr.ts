import { Schema, Model, model } from 'mongoose';
import { NeuropathCorrDocument } from '../models';

export let NeuropathCorrSchema: Schema = new Schema(
    {
        ensg: {
            required: true,
            type: String
        },
        gname: {
            required: true,
            type: String
        },
        oddsratio: {
            required: true,
            type: Number
        },
        ci_lower: {
            required: true,
            type: Number
        },
        ci_upper: {
            required: true,
            type: Number
        },
        pval: {
            required: true,
            type: Number
        },
        pval_adj: {
            required: true,
            type: Number
        },
        neuropath_type: {
            required: true,
            type: String
        }
    }, {
        collection: 'genesneuropathcorr',
        timestamps: true
    }
);

NeuropathCorrSchema.set('autoIndex', false);
NeuropathCorrSchema.index(
    {
        ensg: 'text',
        gname: 'text',
        neuropath_type: 'text'
    }
);

export const NeuropathCorrs: Model<NeuropathCorrDocument> =
    model<NeuropathCorrDocument>('genesneuropathcorr', NeuropathCorrSchema);
