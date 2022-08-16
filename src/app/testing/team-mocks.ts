/* eslint quotes: off */

import { Team, TeamsResponse, TeamMember } from '../models';

export const mockTeamMember: TeamMember = {
  isprimaryinvestigator: true,
  name: 'Philip De Jager',
  url: 'http://www.cumc.columbia.edu/dept/taub/faculty-dejager.html',
};

export const mockTeam: Team = {
  team: 'Columbia-Rush',
  team_full: 'Columbia University - Rush University',
  program: 'AMP-AD',
  description:
    "The Columbia-Rush AMP-AD team, led by Philip De Jager and David Bennett, focuses on taking a systems biology approach to mine a unique set of deep clinical, paraclinical, pathologic, genomic, epigenomic, transcriptomic, proteomic, metabolic and single cell brain and blood data from more than 1000 subjects from two prospective cohort studies of aging and dementia. They use these data to identify genes, proteins, and pathways with critical roles in a range of traits that influence the function of the aging brain, including susceptibility Alzheimer's disease, the accumulation of aging-related neuropathologies, cognitive decline in older age, as well as resilience to the brain pathologies. Finally, the team then interrogates those genes in ex vivo and in vitro systems to determine their therapeutic potential.",
  members: [mockTeamMember],
};

export const teamsResponseMock: TeamsResponse = {
  items: [mockTeam],
};
