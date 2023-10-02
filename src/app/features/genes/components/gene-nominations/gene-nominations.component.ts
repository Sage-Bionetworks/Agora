import { Component, Input } from '@angular/core';

import { Gene, TargetNomination } from '../../../../models';

import { Team, TeamsResponse } from '../../../../models';
import { TeamService } from '../../../teams/services';

@Component({
  selector: 'gene-nominations',
  templateUrl: './gene-nominations.component.html',
  styleUrls: ['./gene-nominations.component.scss'],
})
export class GeneNominationsComponent {
  _gene: Gene | undefined;
  get gene(): Gene | undefined {
    return this._gene;
  }
  @Input() set gene(gene: Gene | undefined) {
    this._gene = gene;
    this.init();
  }
  nominations: TargetNomination[] = [] as TargetNomination[];
  loading = true;

  constructor(private teamService: TeamService) {}

  reset() {
    this.nominations = [];
  }

  init() {
    this.reset();

    if (!this._gene?.target_nominations?.length) {
      return;
    }

    this.teamService.getTeams().subscribe((res: TeamsResponse) => {
      this.nominations = this.sortNominations(res.items);
    });
  }

  sortNominations(teams: Team[]) {
    const result: TargetNomination[] = [];
    if (!this.gene || !this.gene.target_nominations)
      return result;

    // add team_data to nominations
    this.gene.target_nominations.forEach((targetNomination) => {
      const teamIndex = teams.findIndex((t) => t.team === targetNomination.team); 
      targetNomination.team_data = teams[teamIndex];
    });
    
    return this.gene.target_nominations.sort((a: TargetNomination, b: TargetNomination) => {
      //primary sort on displayed team name
      const teamA = this.getFullDisplayName(a);
      const teamB = this.getFullDisplayName(b);
      
      const nameComparison = teamA.localeCompare(teamB, 'en');
      if (nameComparison !== 0)
        return nameComparison;
    
      //secondary sort on initial nomination year (descending)
      return b.initial_nomination - a.initial_nomination;
    });
  }

  getFullDisplayName(nomination: TargetNomination): string {
    const team = nomination.team_data;
    if (!team)
      return '';
    
    return (team.program ? team.program + ': ' : '') + team.team_full;
  }
}
