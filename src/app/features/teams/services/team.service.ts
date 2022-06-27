// -------------------------------------------------------------------------- //
// External
// -------------------------------------------------------------------------- //
import { Injectable } from '@angular/core';
import { Observable, of, map } from 'rxjs';
import { tap } from 'rxjs/operators';

// -------------------------------------------------------------------------- //
// Internal
// -------------------------------------------------------------------------- //
import { Team, TeamsResponse } from '../../../../models';
import { ApiService } from '../../../core/services';

// -------------------------------------------------------------------------- //
// Service
// -------------------------------------------------------------------------- //
@Injectable()
export class TeamService {
  teams: Team[] = [] as Team[];
  teamsObservable: Observable<TeamsResponse> | undefined;

  constructor(private apiService: ApiService) {}

  getTeams(): Observable<TeamsResponse> {
    if (this.teams.length > 0) {
      return of({ items: this.teams });
    } else if (this.teamsObservable) {
      return this.teamsObservable;
    } else {
      return (this.teamsObservable = this.apiService.getTeams().pipe(
        tap((res: TeamsResponse) => {
          this.teams = res.items;
        })
      ));
    }
  }

  getTeam(name: string): Observable<Team | undefined> {
    return this.getTeams().pipe(
      map((res: TeamsResponse) => res.items.find((t: Team) => t.team === name))
    );
  }

  getTeamMemberImage(name: string): Observable<ArrayBuffer | undefined> {
    return this.apiService.getTeamMemberImage(name);
  }

  getTeamMemberImageUrl(name: string): Observable<string | undefined> {
    return this.apiService.getTeamMemberImage(name).pipe(
      map((buffer: ArrayBuffer) => {
        if (!buffer || buffer.byteLength < 1) {
          return;
        }
        return URL.createObjectURL(
          new Blob([new Object(buffer) as Blob], {
            type: 'image/jpg, image/png, image/jpeg',
          })
        );
      })
    );
  }
}
