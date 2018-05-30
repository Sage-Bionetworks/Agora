import { Document } from 'mongoose';

export interface Gene {
    _id: string;
    comparison_model_sex?: string;
    comparison_model_sex_pretty: string;
    model?: string;
    tissue_study?: string;
    tissue?: string;
    comparison?: string;
    ensembl_gene_id: string;
    logfc: number;
    ci_l: number;
    ci_r: number;
    aveexpr: number;
    t?: number;
    p_value?: string;
    adj_p_val: string;
    b?: number;
    direction?: string;
    hgnc_symbol: string;
    percentage_gc_content?: number;
    gene_length?: number;
    sex?: string;
    study?: string;
    neg_log10_adj_p_val: number;
    tissue_study_pretty: string;
    model_sex_pretty?: string;
}

export type GeneDocument = Gene & Document;
