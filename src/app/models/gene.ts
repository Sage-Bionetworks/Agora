import { Document } from 'mongoose';

export interface Gene {
    comparison_model_sex: string;
    Model: string;
    tissue_study: string;
    Tissue: string;
    Comparison: string;
    ensembl_gene_id: string;
    logfc: number;
    ci_l: number;
    ci_r: number;
    aveexpr: number;
    t: number;
    P_Value: string;
    adj_p_val: string;
    B: number;
    Direction: string;
    hgnc_symbol: string;
    percentage_gc_content: number;
    gene_length: number;
    Sex: string;
    Study: string;
    neg_log10_adj_p_val: number;
    tissue_study_pretty: string;
    model_sex_pretty: string;
}

export type GeneDocument = Gene & Document;
