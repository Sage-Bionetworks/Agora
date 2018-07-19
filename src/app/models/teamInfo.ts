import { Document } from 'mongoose';

export interface TeamMember {
    name: string;
    isprimaryinvestigator: boolean;
    url?: string;
}

export interface TeamInfo {
    team: string;
    description: string;
    members: TeamMember[];
}

export type TeamInfoDocument = TeamInfo & Document;
