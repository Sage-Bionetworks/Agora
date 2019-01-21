import { Gene, GeneNetworkLinks, GeneInfo } from '.';

export interface LinksListResponse {
    items: GeneNetworkLinks[];
}

export interface GenesResponse {
    items?: Gene[];
    geneEntries: Gene[];
    maxFC: number;
    minFC: number;
    minLogFC: number;
    maxLogFC: number;
    minAdjPValue: number;
    maxAdjPValue: number;
    geneTissues: string[];
    geneModels: string[];
}

export interface GenesSameIdResponse {
    geneEntries: Gene[];
}

export interface GeneResponse {
    item: Gene;
    info: GeneInfo;
}

export interface GeneInfosResponse {
    items: GeneInfo[];
    totalRecords?: number;
    isEnsembl?: boolean;
}

export interface TissuesResponse {
    items: string[];
}

export interface ModelsResponse {
    items: string[];
}
