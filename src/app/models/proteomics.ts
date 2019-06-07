import { Document } from 'mongoose';

export interface Proteomics {
    _id: string;
    UniqID: string;
    GeneName: string;
    UniProtID: string;
    ENSG: string;
    Tissue: string;
    Log2FC?: number;
    PVal?: number;
    Cor_PVal?: number;
}

export type ProteomicsDocument = Proteomics & Document;
