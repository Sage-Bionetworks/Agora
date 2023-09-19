import { Component, Input } from '@angular/core';

import { Gene, NominatedTarget } from '../../../../models';

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
  nominations: NominatedTarget[] = [] as NominatedTarget[];
  loading = true;

  constructor(private teamService: TeamService) {}

  reset() {
    this.nominations = [];
  }

  init() {
    this.reset();

    if (!this._gene?.nominatedtarget?.length) {
      return;
    }

    this.teamService.getTeams().subscribe((res: TeamsResponse) => {
      const teams: Team[] = res.items;
      this.sortNominations(teams);
    });
  }

  sortNominations(teams: Team[]) {
    if (this._gene && this._gene.nominatedtarget && this._gene.nominatedtarget.length > 0) {
      const nominatedTargets = this._gene.nominatedtarget;
      nominatedTargets.sort((a: NominatedTarget, b: NominatedTarget) => {
        //primary sort on team name
        const nameComparison = a.team.localeCompare(b.team, 'en');
        if (nameComparison !== 0)
          return nameComparison;
      
        //secondary sort on initial nomination year (descending)
        return b.initial_nomination - a.initial_nomination;
      });

      nominatedTargets.forEach((nominatedTarget) => {
        const teamIndex = teams.findIndex((t) => t.team === nominatedTarget.team);
        nominatedTarget.team_data = teams[teamIndex];
      });

      this.nominations = nominatedTargets;
    }
  }

  getFullDisplayName(nomination: NominatedTarget): string {
    const team: Team = nomination.team_data as Team;
    return (team.program ? team.program + ': ' : '') + team.team_full;
  }
}
