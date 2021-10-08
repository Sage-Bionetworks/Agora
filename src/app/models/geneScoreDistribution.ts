import { Document } from 'mongoose';

export interface DistributionData {
    distribution: number[];
    bins: number[];
    min: number;
    max: number;
    mean: number;
    first_quartile: number;
    third_quartile: number;
}

export interface GeneScoreDistribution {
    _id: string;
    logsdon: DistributionData;
    geneticsscore: DistributionData;
    omicsscore: DistributionData;
    literaturescore: DistributionData;
    flyneuropathscore: DistributionData;
}

export type GeneScoreDistributionDocument = GeneScoreDistribution & Document;
