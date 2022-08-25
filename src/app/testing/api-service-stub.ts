/* eslint-disable */

import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';

import {
  Gene,
  GenesResponse,
  GCTGeneResponse,
  Distribution,
  TeamsResponse,
} from '../models';
import {
  geneMock1,
  geneMock2,
  gctGeneMock1,
  nominatedGeneMock1,
  teamsResponseMock,
} from './';

@Injectable()
export class ApiServiceStub {
  getGene(id: string): Observable<Gene> {
    return of(geneMock1);
  }

  getGenes(ids: string | string[]): Observable<GenesResponse> {
    return of({ items: [geneMock1, geneMock2] });
  }

  searchGene(id: string): Observable<GenesResponse> {
    return of({ items: [geneMock1, geneMock2] });
  }

  getComparisonGenes(
    category: string,
    subCategory: string
  ): Observable<GCTGeneResponse> {
    return of({ items: [gctGeneMock1] });
  }

  getNominatedGenes(): Observable<GenesResponse> {
    return of({ items: [nominatedGeneMock1] });
  }

  getDistribution(): Observable<Distribution> {
    return of({} as Distribution);
  }

  getTeams(): Observable<TeamsResponse> {
    return of(teamsResponseMock);
  }

  getTeamMemberImage(name: string): Observable<ArrayBuffer> {
    return of(new ArrayBuffer(0));
  }
}
