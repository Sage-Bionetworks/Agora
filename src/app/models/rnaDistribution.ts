import { Document } from 'mongoose';

export interface RnaDistribution {
    _id: string;
    model: string;
    tissue: string;
    min: number;
    max: number;
    first_quartile: number;
    median: number;
    third_quartile: number;
}

export type RnaDistributionDocument = RnaDistribution & Document;
