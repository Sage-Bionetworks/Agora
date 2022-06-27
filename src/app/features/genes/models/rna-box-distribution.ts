import { Document } from 'mongoose';

export interface RnaBoxDistribution {
  _id: string;
  model: string;
  tissue: string;
  min: number;
  max: number;
  first_quartile: number;
  median: number;
  third_quartile: number;
}

export type RnaDistributionDocument = RnaBoxDistribution & Document;
