import { Gene, GeneNetworkLinks } from '.';

export interface GeneListResponse {
    items: GeneNetworkLinks[];
}

export interface GenesResponse {
    items: Gene[];
    geneEntries: Gene[];
}
