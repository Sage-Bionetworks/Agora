import { Document } from 'mongoose';

export interface GeneInfo {
    _id: string;
    ensembl_gene_id: string;
    alias?: string[];
    druggability?: Druggability[];
    name: string;
    summary?: string;
    hgnc_symbol: string;
    type_of_gene: string;
    isIGAP: boolean;
    haseqtl: boolean;
    isAnyRNAChangedInADBrain?: boolean;
    isAnyProteinChangedInADBrain?: boolean;
    medianexpression: MedianExpression[];
    nominatedtarget: NominatedTarget[];
    nominations: number;
    // Extra fields for display values
    // NominatedTargets
    teams_display_value?: string;
    study_display_value?: string;
    input_data_display_value?: string;
    validation_study_details_display_value?: string;
    initial_nomination_display_value?: number;
    nominated_target_display_value?: boolean;
    // MedianExpression
    brain_regions_display_value?: string;
    num_brain_regions_display_value?: string;
    // Druggability
    pharos_class_display_value?: string;
    sm_druggability_display_value?: string;
    safety_rating_display_value?: string;
    ab_modality_display_value?: string;
    search_score?: number;
}

export interface MedianExpression {
    medianlogcpm: number;
    tissue: string;
}

export interface NominatedTarget {
    team: string;
    rank: number;
    target_choice_justification: string;
    predicted_therapeutic_direction: string;
    data_used_to_support_target_selection: string;
    data_synapseid: string[];
    study: string;
    input_data: string;
    validation_study_details: string;
    initial_nomination: number;
}

export interface Druggability {
    sm_druggability_bucket: number;
    safety_bucket: number;
    abability_bucket: number;
    pharos_class: string;
    // classification should really be named sm_druggability_bucket_definition
    classification: string;
    safety_bucket_definition: string;
    abability_bucket_definition: string;
}

export type GeneInfoDocument = GeneInfo & Document;
