import { Document } from 'mongoose';

export interface GeneOverallScores {
    _id: string;
    GeneName: string;
    Logsdon: number;
    GeneticsScore: number;
    OmicsScore: number;
    LiteratureScore: number;
}

export type GeneOverallScoresDocument = GeneOverallScores & Document;
