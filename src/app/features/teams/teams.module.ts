// -------------------------------------------------------------------------- //
// External
// -------------------------------------------------------------------------- //
import { NgModule } from '@angular/core';

// -------------------------------------------------------------------------- //
// Internal
// -------------------------------------------------------------------------- //
import { SharedModule } from '../../shared';
import { TeamService } from './services';
import { TeamListComponent, TeamMemberListComponent } from './components';

// -------------------------------------------------------------------------- //
// Module
// -------------------------------------------------------------------------- //
@NgModule({
  declarations: [TeamListComponent, TeamMemberListComponent],
  imports: [SharedModule],
  exports: [TeamListComponent, TeamMemberListComponent],
  providers: [TeamService],
})
export class TeamsModule {}
