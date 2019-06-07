import { Schema, Model, model } from 'mongoose';
import { ProteomicsDocument } from '../models';

export let ProteomicsSchema: Schema = new Schema (
    {
        UniqID: {
            required: true,
            type: String
        },
        GeneName: {
            required: true,
            type: String
        },
        UniProtID: {
            required: true,
            type: String
        },
        id: {
            required: true,
            type: String
        },
        ENSG: {
            required: true,
            type: Number
        },
        Tissue: {
            required: true,
            type: String
        },
        Log2FC: {
            required: false,
            type: Number
        },
        PVal: {
            required: false,
            type: Number
        },
        Cor_PVal: {
            required: false,
            type: Number
        }
    }, {
        timestamps: true
    }
);

ProteomicsSchema.set('autoIndex', false);
ProteomicsSchema.index(
    {
        GeneName: 'text',
        ENSG: 'text',
        Tissue: 'text',
        UniProtID: 'text'
    }
);

// Mongoose forces a lowcase name for collections when using the queries
export const GenesProteomics: Model<ProteomicsDocument> =
                model<ProteomicsDocument>('genesproteomics', ProteomicsSchema);
