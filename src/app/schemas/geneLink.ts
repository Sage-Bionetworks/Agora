import { Schema, Model, model } from 'mongoose';
import { GeneLinkDocument } from '../models';

export let GeneLinkSchema: Schema = new Schema(
    {
        geneA_ensembl_gene_id: {
            required: true,
            type: String,
            index: true
        },
        geneB_ensembl_gene_id: {
            required: true,
            type: String,
            index: true
        },
        geneA_external_gene_name: {
            required: false,
            type: String
        },
        geneB_external_gene_name: {
            required: false,
            type: String
        },
        brainRegion: {
            required: false,
            type: String
        }
    }, {
        timestamps: true
    }
);

// Mongoose forces a lowcase name for collections when using the queries
export const GenesLinks: Model<GeneLinkDocument> =
                model<GeneLinkDocument>('geneslinks', GeneLinkSchema);
