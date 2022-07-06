import {
  Team,
  RnaDifferentialExpression,
  ProteinDifferentialExpression,
  ExperimentalValidation,
  OverallScores,
  NeuropathologicCorrelation,
} from './';

export interface NominatedTarget {
  source: string;
  team: string;
  rank: string;
  ensembl_gene_id: string;
  hgnc_symbol: string;
  target_choice_justification: string;
  predicted_therapeutic_direction: string;
  data_used_to_support_target_selection: string;
  data_synapseid: string;
  study: string;
  input_data: string;
  validation_study_details: string;
  initial_nomination: number;
  //
  team_data?: Team;
}

export interface MedianExpression {
  ensembl_gene_id: string;
  minimumlogcpm?: number;
  quartile1logcpm?: number;
  medianlogcpm?: number;
  meanlogcpm?: number;
  quartile3logcpm?: number;
  maximumlogcpm?: number;
  tissue: string;
}

export interface Druggability {
  geneid: string;
  sm_druggability_bucket: number;
  safety_bucket: number;
  abability_bucket: number;
  pharos_class: string;
  // classification should really be named sm_druggability_bucket_definition
  classification: string;
  safety_bucket_definition: string;
  abability_bucket_definition: string;
}

export interface Gene {
  _id: string;
  ensembl_gene_id: string;
  name: string;
  summary: string;
  hgnc_symbol: string;
  alias: string[];
  isIGAP: boolean;
  haseqtl: boolean;
  isAnyRNAChangedInADBrain: boolean;
  rna_brain_change_studied: boolean;
  isAnyProteinChangedInADBrain: boolean;
  protein_brain_change_studied: boolean;
  nominatedtarget: NominatedTarget[];
  medianexpression: MedianExpression[];
  druggability: Druggability[];
  nominations: number;

  // Added by API (not in mongo document)
  rna_differential_expression?: RnaDifferentialExpression[];
  protein_differential_expression?: ProteinDifferentialExpression[];
  metabolomics?: any; // TODO change;
  overall_scores?: OverallScores;
  neuropathologic_correlations?: NeuropathologicCorrelation[];
  experimental_validation?: ExperimentalValidation[];
  links?: { [key: string]: any };
  network?: { [key: string]: any };

  // Similar table (not in mongo document)
  ab_modality_display_value?: string;
  safety_rating_display_value?: string;
  sm_druggability_display_value?: string;
  pharos_class_display_value?: string;
  is_any_rna_changed_in_ad_brain_display_value?: string;
  is_any_protein_changed_in_ad_brain_display_value?: string;
  nominated_target_display_value?: boolean;
  initial_nomination_display_value?: number;
  validations_display_value?: string;

  // Nominated table (not in mongo document)
  input_data_display_value?: string;
  study_display_value?: string;
  teams_display_value?: string;
}

export interface GenesResponse {
  items: Gene[];
}
