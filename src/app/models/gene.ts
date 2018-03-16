export interface Gene {
    comparison_model_sex: string;
    Model: string;
    tissue_study: string;
    Tissue: string;
    Comparison: string;
    ensembl_gene_id: string;
    logFC: number;
    CI_L: number;
    CI_R: number;
    AveExpr: number;
    t: number;
    P_Value: string;
    adj_P_Val: string;
    B: number;
    Direction: string;
    hgnc_symbol: string;
    percentage_gc_content: number;
    gene_length: number;
    Sex: string;
    Study: string;
    neg_log10_adj_P_Val: number;
    tissue_study_pretty: string;
    model_sex_pretty: string;
}
