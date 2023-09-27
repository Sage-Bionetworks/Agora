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
      const teams: Team[] = res.items;
      this.sortNominations(teams);
    });
  }

  sortNominations(teams: Team[]) {
    if (this._gene && this._gene.target_nominations && this._gene.target_nominations.length > 0) {
      const targetNominations = this._gene.target_nominations;
      targetNominations.sort((a: TargetNomination, b: TargetNomination) => {
        //primary sort on team name
        const nameComparison = a.team.localeCompare(b.team, 'en');
        if (nameComparison !== 0)
          return nameComparison;
      
        //secondary sort on initial nomination year (descending)
        return b.initial_nomination - a.initial_nomination;
      });

      targetNominations.forEach((targetNomination) => {
        const teamIndex = teams.findIndex((t) => t.team === targetNomination.team);
        targetNomination.team_data = teams[teamIndex];
      });

      this.nominations = targetNominations;
    }
  }

  getFullDisplayName(nomination: TargetNomination): string {
    const team: Team = nomination.team_data as Team;
    return (team.program ? team.program + ': ' : '') + team.team_full;
  }
}
