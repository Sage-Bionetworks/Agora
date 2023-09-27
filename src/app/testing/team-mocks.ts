/* eslint quotes: off */

import { Team, TeamsResponse, TeamMember } from '../models';

export const mockTeamMember: TeamMember = {
  isprimaryinvestigator: true,
  name: 'Philip De Jager',
  url: 'http://www.cumc.columbia.edu/dept/taub/faculty-dejager.html',
};

export const mockTeam1: Team = {
  team: 'Chang Lab',
  team_full: 'The Chang Lab at the University of Arizona',
  program: 'Community Contributed',
  description:
  "The Chang Team at the University of Arizona, led by Rui Chang, develops novel computational systems biology models to discover drug targets for in-silico precision medicine for AD. The target nominations are based on work performed by the Chang Team at the Icahn School of Medicine at Mt. Sinai.",
  members: [mockTeamMember],
};

export const mockTeam2: Team = {
  team: 'Emory',
  team_full: 'Emory University',
  program: 'AMP-AD',
  description:
    "The Emory AMP-AD team, led by Allan Levey, focuses on the generation and analysis of proteomic data to understand neurodegenerative disease. Targets nominated by the Emory team have been identified through the analysis of differential protein expression and co-expression network analysis.",
  members: [mockTeamMember],
};

export const mockTeam3: Team = {
  team: 'Emory-Sage-SGC',
  team_full: 'Emory University',
  program: 'TREAT-AD',
  description:
  "Emory University - Sage Bionetworks - Structural Genomics Consortium",
  members: [mockTeamMember],
};

export const mockTeam4: Team = {
  team: 'MSSM',
  team_full: 'Icahn School of Medicine at Mount Sinai',
  program: 'AMP-AD',
  description:
  "The Icahn School of Medicine at Mount Sinai AMP-AD team, led by Eric Schadt, Bin Zhang, Jun Zhu, Michelle Ehrlich, Vahram Haroutunian, Samuel Gandy, Koichi Iijima, and Scott Noggle focuses on developing a multiscale network approach to elucidating the complexity of Alzheimer's disease.",
  members: [mockTeamMember],
};

export const teamsResponseMock: TeamsResponse = {
  items: [mockTeam1, mockTeam2, mockTeam3, mockTeam4],
};
