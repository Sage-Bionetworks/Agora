// -------------------------------------------------------------------------- //
// External
// -------------------------------------------------------------------------- //
import { Component, Input } from '@angular/core';

// -------------------------------------------------------------------------- //
// Internal
// -------------------------------------------------------------------------- //
import { Team } from '../../../../models';

// -------------------------------------------------------------------------- //
// Component
// -------------------------------------------------------------------------- //
@Component({
  selector: 'team-list',
  templateUrl: './team-list.component.html',
  styleUrls: ['./team-list.component.scss'],
})
export class TeamListComponent {
  _teams: Team[] = [];
  get teams(): Team[] {
    return this._teams;
  }
  @Input() set teams(teams: Team[]) {
    this._teams = teams;
  }

  getFullName(team: Team): string {
    return team.program ? team.program + ': ' + team.team_full : team.team_full;
  }

  getDescription(team: Team): string {
    return team.description ? team.description.replace('‚Äô', '&quot;') : '';
  }
}
