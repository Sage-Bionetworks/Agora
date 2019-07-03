import { Schema, Model, model } from 'mongoose';
import { MetabolomicsDocument } from '../models';

export let MetabolomicsSchema: Schema = new Schema (
    {
        associated_gene_name: {
            required: true,
            type: String
        },
        ensembl_gene_id: {
            required: true,
            type: String
        },
        metabolite_id: {
            required: true,
            type: String
        },
        metabolite_full_name: {
            required: true,
            type: String
        },
        association_p: {
            required: true,
            type: Number
        },
        gene_wide_p_threshold_1kgp: {
            required: true,
            type: Number
        },
        n_per_group: {
            required: false,
            type: [Number]
        },
        boxplot_group_names: {
            required: false,
            type: [String]
        },
        ad_diagnosis_p_value: {
            required: false,
            type: [Number]
        },
        transposed_boxplot_stats: {
            required: false,
            type: [[Number]]
        }
    }, {
        timestamps: true
    }
);

MetabolomicsSchema.set('autoIndex', false);
MetabolomicsSchema.index(
    {
        metabolite_id: 'text',
        ensembl_gene_id: 'text',
        associated_gene_name: 'text'
    }
);

// Mongoose forces a lowcase name for collections when using the queries
export const GenesMetabolomics: Model<MetabolomicsDocument> =
                model<MetabolomicsDocument>('genesmetabolomics', MetabolomicsSchema);
