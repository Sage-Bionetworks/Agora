import { SimulationNodeDatum, SimulationLinkDatum } from 'd3';

export interface GeneNode extends SimulationNodeDatum {
  id: string;
  value: number;
  ensembl_gene_id: string;
  hgnc_symbol: string;
  brain_regions: string[];
}

export interface GeneLink extends SimulationLinkDatum<SimulationNodeDatum> {
  value: number;
  source: GeneNode;
  target: GeneNode;
  source_hgnc_symbol: string;
  target_hgnc_symbol: string;
  brain_regions: string[];
}

export interface GeneNetwork {
  nodes: GeneNode[];
  links: GeneLink[];
  origin: any;
  maxEdges: number;
}

export interface GeneNetworkLinks {
  geneA_ensembl_gene_id: string;
  geneB_ensembl_gene_id: string;
  geneA_external_gene_name: string;
  geneB_external_gene_name: string;
  brainRegion: string;
}

export interface LinksListResponse {
  items: GeneNetworkLinks[];
}
