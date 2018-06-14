import { Gene } from '../models';

export const mockGene1: Gene = {
    _id: '5afa0be1310e7e82fde5112c',
    hgnc_symbol: 'PIAS2',
    ensembl_gene_id: 'ENSG00000078043',
    logfc: -0.446,
    ci_l: -0.5474,
    ci_r: -0.3437,
    adj_p_val: Math.pow(10, 2.0532e-12),
    study: 'MayoRNAseq',
    tissue: 'cerebellum',
    model: 'Diagnosis (ALL)'
};

export const mockGene2: Gene = {
    _id: '5afa0be1310e7e82fde5112d',
    hgnc_symbol: 'MPV17',
    ensembl_gene_id: 'ENSG00000115204',
    logfc: -0.343,
    ci_l: -0.4257,
    ci_r: -0.2595,
    adj_p_val: Math.pow(10, 1.5351e-11),
    study: 'MayoRNAseq',
    tissue: 'cerebellum',
    model: 'Diagnosis (ALL)'
};
