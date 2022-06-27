import { Component, Input } from '@angular/core';

import { GeneInfo, NominatedTarget } from '../../models';

import { Team, TeamsResponse } from '../../../../../models';
import { TeamService } from '../../../teams/services';

@Component({
  selector: 'gene-nominations',
  templateUrl: './gene-nominations.component.html',
  styleUrls: ['./gene-nominations.component.scss'],
})
export class GeneNominationsComponent {
  _gene: GeneInfo = {} as GeneInfo;
  get gene(): GeneInfo {
    return this._gene;
  }
  @Input() set gene(gene: GeneInfo) {
    this._gene = gene;
    this.init();
  }
  nominations: NominatedTarget[] = [] as NominatedTarget[];
  loading = true;

  constructor(private teamService: TeamService) {}

  init() {
    if (!this._gene?.nominatedtarget?.length) {
      return;
    }

    this.teamService.getTeams().subscribe((res: TeamsResponse) => {
      const teams: Team[] = res.items;
      const teamNames = this._gene.nominatedtarget.map((n) => n.team);
      const nominations: NominatedTarget[] = [] as NominatedTarget[];

      // Loop teams to keep order
      teams.forEach((team: Team) => {
        const index = teamNames.indexOf(team.team);

        if (index > -1) {
          const nomination = this._gene.nominatedtarget[index];
          nomination.team_data = team;
          nominations.push(nomination);
        }
      });

      this.nominations = nominations;
    });
  }

  getFullDisplayName(nomination: NominatedTarget): string {
    const team: Team = nomination.team_data as Team;
    return (team.program ? team.program + ': ' : '') + team.team_full;
  }
}
