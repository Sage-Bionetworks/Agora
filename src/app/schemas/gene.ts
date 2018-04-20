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
    }
}, {
    timestamps: true
});

// Add methods here, if needed e.g.
/*GeneSchema.methods.fullName = () => {
  return (this.firstName.trim() + " " + this.lastName.trim());
};*/

// Mongoose forces a lowcase name for collections when using the queries
export const Genes: Model<GeneDocument> = model<GeneDocument>("genes", GeneSchema);
