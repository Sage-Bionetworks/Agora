import { Document } from 'mongoose';

export interface GeneLink {
    geneA_ensembl_gene_id: string;
    geneB_ensembl_gene_id: string;
    geneA_external_gene_name: string;
    geneB_external_gene_name: string;
    brainRegion: string;
}

export type GeneLinkDocument = GeneLink & Document;
