// -------------------------------------------------------------------------- //
// External
// -------------------------------------------------------------------------- //
import { Schema, InferSchemaType } from 'mongoose';

// -------------------------------------------------------------------------- //
// Schemas
// -------------------------------------------------------------------------- //

export const RnaDifferentialExpressionSchema = new Schema(
  {
    ensembl_gene_id: { type: String, required: true },
    hgnc_symbol: { type: String, required: true },
    logfc: { type: Number, required: true },
    fc: { type: Number, required: true },
    ci_l: { type: Number, required: true },
    ci_r: { type: Number, required: true },
    adj_p_val: { type: Number, required: true },
    tissue: String,
    study: String,
    model: String,
  },
  { collection: 'genes' }
);

// -------------------------------------------------------------------------- //
// Types
// -------------------------------------------------------------------------- //

export type RnaDifferentialExpression = InferSchemaType<
  typeof RnaDifferentialExpressionSchema
>;
