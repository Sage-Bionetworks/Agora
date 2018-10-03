import { Gene, GeneNetworkLinks, GeneInfo } from '.';

export interface LinksListResponse {
    items: GeneNetworkLinks[];
}

export interface GenesResponse {
    items: Gene[];
    geneEntries: Gene[];
}

export interface GeneResponse {
    items: Gene[];
    geneEntries: Gene[];
    info: GeneInfo;
    item: Gene;
    minFC: number;
    minLogFC: number;
    maxLogFC: number;
    minAdjPValue: number;
    maxAdjPValue: number;
}

export interface GeneInfosResponse {
    items: GeneInfo[];
}

export interface TissuesResponse {
    items: string[];
}

export interface ModelsResponse {
    items: string[];
}
