import { Document } from 'mongoose';
import { Gene } from '.';

export interface GeneNode {
    id: string;
    hgnc_symbol: string;
    brainregions: string[];
    group: number;
    ensembl_gene_id: string;
}

export interface GeneLink {
    value: number;
    source: string;
    target: string;
    brainregions: string[];
    hgnc_symbolA: string;
    hgnc_symbolB: string;
}

export interface GeneLinkP {
    value: number;
    source: GeneLinkDetail;
    target: GeneLinkDetail;
    brainregions: string[];
    hgnc_symbolA: string;
    hgnc_symbolB: string;
}

export interface GeneLinkDetail {
    brainregions: string[];
    ensembl_gene_id: string;
    group: number;
    hgnc_symbol: string;
    id: string;
    index: number;
    vx: number;
    vy: number;
    x: number;
    y: number;
}

export interface GeneNetwork {
    nodes: GeneNode[];
    links: GeneLink[];
    origin: Gene;
    filterLvl: number;
}

export interface GeneNetworkLinks {
    geneA_ensembl_gene_id: string;
    geneB_ensembl_gene_id: string;
    geneA_external_gene_name: string;
    geneB_external_gene_name: string;
    brainRegion: string;
}

export type GeneLinkDocument = GeneNetworkLinks & Document;
