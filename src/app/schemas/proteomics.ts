import { Schema, Model, model } from 'mongoose';
import { ProteomicsDocument } from '../models';

export let ProteomicsSchema: Schema = new Schema (
    {
        uniqid: {
            required: true,
            type: String
        },
        hgnc_symbol: {
            required: true,
            type: String
        },
        uniprotid: {
            required: true,
            type: String
        },
        id: {
            required: true,
            type: String
        },
        ensembl_gene_id: {
            required: true,
            type: Number
        },
        tissue: {
            required: true,
            type: String
        },
        log2_fc: {
            required: true,
            type: Number
        },
        ci_upr: {
            required: true,
            type: Number
        },
        ci_lwr: {
            required: true,
            type: Number
        },
        pval: {
            required: true,
            type: Number
        },
        cor_pval: {
            required: true,
            type: Number
        }
    }, {
        timestamps: true
    }
);

ProteomicsSchema.set('autoIndex', false);
ProteomicsSchema.index(
    {
        hgnc_symbol: 'text',
        ensembl_gene_id: 'text',
        tissue: 'text',
        uniprotid: 'text'
    }
);

// Mongoose forces a lowcase name for collections when using the queries
export const GenesProteomics: Model<ProteomicsDocument> =
                model<ProteomicsDocument>('genesproteomics', ProteomicsSchema);
