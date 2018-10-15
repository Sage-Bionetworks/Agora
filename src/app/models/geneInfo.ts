import { Document } from 'mongoose';

export interface GoMF {
    category: string;
    MF?: string;
    evidence: string;
    id: string;
    pubmed: number[] | any;
    term: string;
}

export interface GeneInfo {
    _id: string;
    ensembl_gene_id: string;
    alias?: string[];
    druggability?: object[];
    name: string;
    summary?: string;
    hgnc_symbol: string;
    type_of_gene: string;
    'go.MF': GoMF[];
    isIGAP: boolean;
    haseqtl: boolean;
    medianexpression: MedianExpression[];
    nominatedtarget: NominatedTarget[];
    nominations: number;
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
}

export type GeneInfoDocument = GeneInfo & Document;
