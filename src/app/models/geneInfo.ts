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
    isChangedInADBrain: boolean;
    medianexpression: MedianExpression[];
    nominatedtarget: NominatedTarget[];
    nominations: number;
    // Extra field for the genes list table. This will be
    // all the teams in a single string separated by commas
    teams?: string;
    study?: string;
    input_data?: string;
    validation_study_details?: string;
    initial_nomination?: number;
    sm_druggability_bucket?: string;
    safety_bucket?: string;
    feasibility_bucket?: string;
    abability_bucket?: string;
    new_modality_bucket?: string;
    tissue_engagement_bucket?: string;
    pharos_class?: string;
    classification?: string;
    safety_bucket_definition?: string;
    feasibility_bucket_definition?: string;
    abability_bucket_definition?: string;
    new_modality_bucket_definition?: string;
    brain_regions?: string;
    num_brain_regions?: string;
    isAnyRNAChangedInADBrain?: boolean;
    isAnyProteinChangedInADBrain?: boolean;
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
