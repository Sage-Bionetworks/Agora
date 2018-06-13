import { Document } from 'mongoose';

export interface GeneNode {
    id: string;
    hgnc_symbol: string;
    brainregions: string[];
    group: number;
    ensembl_gene_id: string;
}

export interface GeneLink {
    brainRegion: string[];
    source: string;
    target: string;
    value: number;
}

export interface GeneNetwork {
    nodes: GeneNode[];
    links: GeneLink[];
}

export interface GeneNetworkLinks {
    geneA_ensembl_gene_id: string;
    geneB_ensembl_gene_id: string;
    geneA_external_gene_name: string;
    geneB_external_gene_name: string;
    brainRegion: string;
}

export type GeneLinkDocument = GeneNetworkLinks & Document;
