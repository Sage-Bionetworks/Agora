// -------------------------------------------------------------------------- //
// External
// -------------------------------------------------------------------------- //
import { Component, OnInit } from '@angular/core';

// -------------------------------------------------------------------------- //
// Internal
// -------------------------------------------------------------------------- //
import { Team, TeamsResponse } from '../../../models';
import { TeamService } from '../../../features/teams/services';
import { HelperService } from '../../../core/services';

// -------------------------------------------------------------------------- //
// Component
// -------------------------------------------------------------------------- //
@Component({
  selector: 'teams-page',
  templateUrl: './teams.component.html',
  styleUrls: ['./teams.component.scss'],
})
export class TeamsPageComponent implements OnInit {
  teams: Team[] = [];

  constructor(
    private helperService: HelperService,
    private teamService: TeamService
  ) {}

  ngOnInit() {
    this.helperService.setLoading(true);
    this.teamService.getTeams().subscribe(
      (res: TeamsResponse) => {
        this.teams = res.items;
      },
      (err: Error) => {
        console.log('Error loading teams: ' + err.message);
      },
      () => {
        this.helperService.setLoading(false);
      }
    );
  }
}
