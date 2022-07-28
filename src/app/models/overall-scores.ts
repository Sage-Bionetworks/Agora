export interface OverallScores {
  // _id: string; // Not used
  ENSG: string;
  // GeneName: string; // Not used
  Logsdon: number;
  GeneticsScore: number;
  OmicsScore: number;
  LiteratureScore: number;
}

export interface OverallScoresDistribution {
  // _id: string; // Not used
  distribution: number[];
  bins: number[][]; // Array of [binStart, binEnd]
  // min: number; // Not used
  // max: number; // Not used
  // mean: number; // Not used
  // first_quartile: number; // Not used
  // third_quartile: number; // Not used
  name: string;
  syn_id: string; // Wiki's ownerId
  wiki_id: string;
}
