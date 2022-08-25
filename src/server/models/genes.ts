// -------------------------------------------------------------------------- //
// External
// -------------------------------------------------------------------------- //
import { Schema, model } from 'mongoose';

// -------------------------------------------------------------------------- //
// Internal
// -------------------------------------------------------------------------- //
import {
  Gene,
  MedianExpression,
  NominatedTarget,
  Druggability,
} from '../../app/models';
export { Gene } from '../../app/models';

// -------------------------------------------------------------------------- //
// Schemas
// -------------------------------------------------------------------------- //
const NominatedTargetSchema = new Schema<NominatedTarget>({
  source: { type: String, required: true },
  team: { type: String, required: true },
  rank: { type: String, required: true },
  ensembl_gene_id: { type: String, required: true },
  hgnc_symbol: { type: String, required: true },
  target_choice_justification: { type: String, required: true },
  predicted_therapeutic_direction: { type: String, required: true },
  data_used_to_support_target_selection: { type: String, required: true },
  data_synapseid: { type: String, required: true },
  study: { type: String, required: true },
  input_data: { type: String, required: true },
  validation_study_details: { type: String, required: true },
  initial_nomination: { type: Number, required: true },
});

const MedianExpressionSchema = new Schema<MedianExpression>({
  ensembl_gene_id: { type: String, required: true },
  minimumlogcpm: Number,
  quartile1logcpm: Number,
  medianlogcpm: Number,
  meanlogcpm: Number,
  quartile3logcpm: Number,
  maximumlogcpm: Number,
  tissue: { type: String, required: true },
});

const DruggabilitySchema = new Schema<Druggability>({
  geneid: { type: String, required: true },
  sm_druggability_bucket: { type: Number, required: true },
  safety_bucket: { type: Number, required: true },
  abability_bucket: { type: Number, required: true },
  pharos_class: { type: String, required: true },
  classification: { type: String, required: true },
  safety_bucket_definition: { type: String, required: true },
  abability_bucket_definition: { type: String, required: true },
});

const GeneSchema = new Schema<Gene>(
  {
    _id: { type: String, required: true },
    ensembl_gene_id: { type: String, required: true },
    name: { type: String, required: true },
    summary: { type: String, required: true },
    hgnc_symbol: { type: String, required: true },
    alias: [{ type: String, required: true }],
    isIGAP: { type: Boolean, required: true },
    haseqtl: { type: Boolean, required: true },
    isAnyRNAChangedInADBrain: { type: Boolean, required: true },
    rna_brain_change_studied: { type: Boolean, required: true },
    isAnyProteinChangedInADBrain: { type: Boolean, required: true },
    protein_brain_change_studied: { type: Boolean, required: true },
    nominatedtarget: { type: [NominatedTargetSchema], required: true },
    medianexpression: { type: [MedianExpressionSchema], required: true },
    druggability: { type: [DruggabilitySchema], required: true },
    nominations: { type: Number, required: true },
  },
  { collection: 'geneinfo' }
);

// -------------------------------------------------------------------------- //
// Models
// -------------------------------------------------------------------------- //
export const GeneCollection = model<Gene>('GeneCollection', GeneSchema);
