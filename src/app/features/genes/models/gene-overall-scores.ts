import { Document } from 'mongoose';

export interface OverallScore {
  _id: string;
  ensg: string;
  genename: string;
  logsdon: number;
  geneticsscore: number;
  omicsscore: number;
  literaturescore: number;
}

export type OverallScoreDocument = OverallScore & Document;
