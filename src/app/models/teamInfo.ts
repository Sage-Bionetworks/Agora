import { Document } from 'mongoose';

export interface TeamMember {
    id?: string;
    name: string;
    isprimaryinvestigator: boolean;
    url?: string;
    imgUrl?: string;
}

export interface TeamInfo {
    team: string;
    description: string;
    members: TeamMember[];
}

export type TeamInfoDocument = TeamInfo & Document;
