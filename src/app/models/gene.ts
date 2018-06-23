import { Document } from 'mongoose';

export interface Gene {
    _id: string;
    adj_p_val: number;
    b?: number;
    brainregions?: string[];
    ci_l: number;
    ci_r: number;
    direction?: string;
    ensembl_gene_id: string;
    gene_length?: number;
    hgnc_symbol: string;
    logfc: number;
    fc: number;
    model?: string;
    percentage_gc_content?: number;
    p_value?: string;
    sex?: string;
    study?: string;
    t?: number;
    tissue?: string;
}

export type GeneDocument = Gene & Document;
