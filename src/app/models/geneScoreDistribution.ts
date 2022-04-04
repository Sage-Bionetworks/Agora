import { Document } from 'mongoose';

export interface DistributionData {
    distribution: number[];
    /* Array of [binStart, binEnd] */
    bins: string[][];
    min: number;
    max: number;
    mean: number;
    first_quartile: number;
    third_quartile: number;
    name: string;
    /* syn_id is the wiki's ownerId */
    syn_id: string;
    wiki_id: string;
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
