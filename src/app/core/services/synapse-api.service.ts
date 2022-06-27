// -------------------------------------------------------------------------- //
// External
// -------------------------------------------------------------------------- //
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { tap } from 'rxjs/operators';
import { of } from 'rxjs';

// -------------------------------------------------------------------------- //
// Service
// -------------------------------------------------------------------------- //
@Injectable()
export class SynapseApiService {
  wikis: { [key: string]: any } = {};

  constructor(private http: HttpClient) {}

  getWiki(ownerId: string, wikiId: string) {
    const key = ownerId + wikiId;
    if (this.wikis[key]) {
      return of(this.wikis[key]);
    } else {
      return this.http
        .get(
          'https://repo-prod.prod.sagebase.org/repo/v1/entity/' +
            ownerId +
            '/wiki/' +
            wikiId
        )
        .pipe(
          tap((wiki: any) => {
            this.wikis[key] = wiki;
          })
        );
    }
  }
}
