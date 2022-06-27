// -------------------------------------------------------------------------- //
// External
// -------------------------------------------------------------------------- //
import { Schema, InferSchemaType } from 'mongoose';

// -------------------------------------------------------------------------- //
// Schemas
// -------------------------------------------------------------------------- //

export const TeamMemberSchema = new Schema({
  id: String,
  name: { type: String, required: true },
  isprimaryinvestigator: { type: Boolean, required: true },
  url: String,
  imgUrl: String,
});

export const TeamsSchema = new Schema(
  {
    team: { type: String, required: true },
    team_full: { type: String, required: true },
    program: { type: String, required: true },
    description: { type: String, required: true },
    members: TeamMemberSchema,
  },
  { collection: 'teaminfo' }
);

// -------------------------------------------------------------------------- //
// Types
// -------------------------------------------------------------------------- //

export type Team = InferSchemaType<typeof TeamsSchema>;

export type TeamMember = InferSchemaType<typeof TeamMemberSchema>;

export type TeamMemberImage = {
  _id: string;
  length: number;
  chunkSize: number;
  uploadDate: Date;
  filename: string;
  metadata: object;
};

// -------------------------------------------------------------------------- //
// API Responses
// -------------------------------------------------------------------------- //

export type TeamsResponse = {
  items: Team[];
};
