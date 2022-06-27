import { Gene, GeneInfo, GeneExperimentalValidation, OverallScore } from '.';

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
  experimentalValidation: GeneExperimentalValidation[] | undefined;
  overallScores: OverallScore | undefined;
}

export interface TissuesResponse {
  items: string[];
}

export interface ModelsResponse {
  items: string[];
}
