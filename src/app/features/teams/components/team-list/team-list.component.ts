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
    this.sort(teams);
    this._teams = teams;
  }

  sort(teams: Team[]) {
    teams.sort((a, b) => {
      if (!a.program) {
        return 1;
      } else if (!b.program) {
        return -1;
      } else {
        return (a.program + a.team_full).localeCompare(b.program + b.team_full);
      }
    });
  }

  getFullName(team: Team): string {
    return team.program ? team.program + ': ' + team.team_full : team.team_full;
  }

  getDescription(team: Team): string {
    return team.description ? team.description.replace('‚Äô', '&quot;') : '';
  }
}
