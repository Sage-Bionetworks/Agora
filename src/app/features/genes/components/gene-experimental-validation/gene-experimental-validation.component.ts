import { Component, Input } from '@angular/core';

import { GeneInfo } from '../../models';
import { Team, TeamsResponse } from '../../../../../models';
import { TeamService } from '../../../teams/services';

@Component({
  selector: 'gene-experimental-validation',
  templateUrl: './gene-experimental-validation.component.html',
  styleUrls: ['./gene-experimental-validation.component.scss'],
})
export class GeneExperimentalValidationComponent {
  _gene: GeneInfo = {} as GeneInfo;
  get gene(): GeneInfo {
    return this._gene;
  }
  @Input() set gene(gene: GeneInfo) {
    this._gene = gene;
    this.init();
  }

  constructor(private teamService: TeamService) {}

  init() {
    if (!this._gene.experimentalValidation?.length) {
      return;
    }

    this.teamService.getTeams().subscribe((res: TeamsResponse) => {
      const teams: Team[] = res.items;
      this._gene.experimentalValidation?.map((item: any) => {
        item.team_data = teams.filter((t) => t.team == item.team)[0];
        return item;
      });
    });
  }
}
