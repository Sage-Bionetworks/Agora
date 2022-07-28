// -------------------------------------------------------------------------- //
// External
// -------------------------------------------------------------------------- //
import { NgModule } from '@angular/core';

// -------------------------------------------------------------------------- //
// Internal
// -------------------------------------------------------------------------- //
import { SharedModule } from '../../shared';
import { TeamService } from './services';
import {
  TeamListComponent,
  TeamMemberListComponent,
  TeamsPageComponent,
} from './components';

// -------------------------------------------------------------------------- //
// Module
// -------------------------------------------------------------------------- //
@NgModule({
  declarations: [
    TeamListComponent,
    TeamMemberListComponent,
    TeamsPageComponent,
  ],
  imports: [SharedModule],
  exports: [TeamListComponent, TeamMemberListComponent, TeamsPageComponent],
  providers: [TeamService],
})
export class TeamsModule {}
