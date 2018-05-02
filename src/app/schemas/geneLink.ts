import { Document, Schema, Model, model } from 'mongoose';
import { GeneLink, GeneLinkDocument } from '../models';

export let GeneLinkSchema: Schema = new Schema({
    geneA_ensembl_gene_id: {
        required: true,
        type: String,
    }
}, {
        timestamps: true
    });

// Mongoose forces a lowcase name for collections when using the queries
export const GenesLinks: Model<GeneLinkDocument> = model<GeneLinkDocument>('geneslinks', GeneLinkSchema);
