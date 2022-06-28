// -------------------------------------------------------------------------- //
// External
// -------------------------------------------------------------------------- //
import { Schema, model } from 'mongoose';

// -------------------------------------------------------------------------- //
// Internal
// -------------------------------------------------------------------------- //
import {
  RnaDifferentialExpression,
  RnaDifferentialExpressionDistribution,
} from '../../app/models';
export {
  RnaDifferentialExpression,
  RnaDifferentialExpressionDistribution,
} from '../../app/models';

// -------------------------------------------------------------------------- //
// Schemas
// -------------------------------------------------------------------------- //

const RnaDifferentialExpressionSchema = new Schema<RnaDifferentialExpression>(
  {
    _id: { type: String, required: true },
    ensembl_gene_id: { type: String, required: true },
    hgnc_symbol: { type: String, required: true },
    logfc: { type: Number, required: true },
    fc: { type: Number, required: true },
    ci_l: { type: Number, required: true },
    ci_r: { type: Number, required: true },
    adj_p_val: { type: Number, required: true },
    tissue: { type: String, required: true },
    study: { type: String, required: true },
    model: { type: String, required: true },
  },
  { collection: 'genes' }
);

const RnaDifferentialExpressionDistributionSchema =
  new Schema<RnaDifferentialExpressionDistribution>(
    {
      _id: { type: String, required: true },
      model: { type: String, required: true },
      tissue: { type: String, required: true },
      min: { type: Number, required: true },
      max: { type: Number, required: true },
      first_quartile: { type: Number, required: true },
      median: { type: Number, required: true },
      third_quartile: { type: Number, required: true },
    },
    { collection: 'rnaboxdistribution' }
  );

// -------------------------------------------------------------------------- //
// Models
// -------------------------------------------------------------------------- //

export const RnaDifferentialExpressionCollection =
  model<RnaDifferentialExpression>(
    'RnaDifferentialExpressionCollection',
    RnaDifferentialExpressionSchema
  );

export const RnaDifferentialExpressionDistributionCollection =
  model<RnaDifferentialExpressionDistribution>(
    'RnaDifferentialExpressionDistributionCollection',
    RnaDifferentialExpressionDistributionSchema
  );
