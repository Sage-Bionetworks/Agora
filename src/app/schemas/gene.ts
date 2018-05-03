import { Document, Schema, Model, model} from "mongoose";
import { Gene, GeneDocument } from "../models";

export var GeneSchema: Schema = new Schema({
    ensembl_gene_id: {
        required: true,
        type: String,
    },
    hgnc_symbol: {
        required: true,
        type: String,
    },
    logfc: {
        required: false,
        type: Number
    },
    aveexpr: {
        required: false,
        type: Number
    },
    ci_l: {
        required: false,
        type: Number
    },
    ci_r: {
        required: false,
        type: Number
    },
    adj_p_val: {
        required: false,
        type: Number
    },
    neg_log10_adj_p_val: {
        required: false,
        type: Number
    },
    tissue_study_pretty: {
        required: false,
        type: String
    },
    comparison_model_sex_pretty: {
        required: false,
        type: String
    }
}, {
    timestamps: true
});

// Add methods here, if needed e.g.
/*GeneSchema.methods.fullName = () => {
    return (this.firstName.trim() + " " + this.lastName.trim());
};*/

// Handler **must** take 3 parameters: the error that occurred, the document
// in question, and the `next()` function
GeneSchema.post('save', function(error, doc, next) {
    if (error.name === 'MongoError' && error.code === 11000) {
        next(new Error('There was a duplicate key error'));
    } else {
        next(error);
    }
});

// Mongoose forces a lowcase name for collections when using the queries
export const Genes: Model<GeneDocument> = model<GeneDocument>('genes', GeneSchema);
