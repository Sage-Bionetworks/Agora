import { Document } from 'mongoose';

export interface Proteomics {
    _id: string;
    uniqid: string;
    hgnc_symbol: string;
    uniprotid: string;
    ensembl_gene_id: string;
    tissue: string;
}

export type ProteomicsDocument = Proteomics & Document;
