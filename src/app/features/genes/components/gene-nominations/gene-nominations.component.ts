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
      const nominations: NominatedTarget[] = [];
      const teams: Team[] = res.items;
      const teamNames = this._gene?.nominatedtarget?.map((n) => n.team);

      if (teamNames) {
        for (let i=0; i<teams.length; i++) {
          const index = teamNames.indexOf(teams[i].team);
          if (index > -1) {
            if (this._gene?.nominatedtarget) {
              const nomination = this._gene?.nominatedtarget[index];
              if (nomination) {
                nomination.team_data = teams[i];
                nominations.push(nomination);
              }
            }
          }
        }
      }
      this.nominations = nominations;
    });
  }

  getFullDisplayName(nomination: NominatedTarget): string {
    const team: Team = nomination.team_data as Team;
    return (team.program ? team.program + ': ' : '') + team.team_full;
  }
}
