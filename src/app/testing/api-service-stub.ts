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
  mockGene1,
  mockGene2,
  mockGCTGene1,
  mockNominatedGene1,
  mockTeamsResponse,
} from './';

@Injectable()
export class ApiServiceStub {
  getGene(id: string): Observable<Gene> {
    return of(mockGene1);
  }

  getGenes(ids: string | string[]): Observable<GenesResponse> {
    return of({ items: [mockGene1, mockGene2] });
  }

  searchGene(id: string): Observable<GenesResponse> {
    return of({ items: [mockGene1, mockGene2] });
  }

  getComparisonGenes(
    category: string,
    subCategory: string
  ): Observable<GCTGeneResponse> {
    return of({ items: [mockGCTGene1] });
  }

  getNominatedGenes(): Observable<GenesResponse> {
    return of({ items: [mockNominatedGene1] });
  }

  getDistribution(): Observable<Distribution> {
    return of({} as Distribution);
  }

  getTeams(): Observable<TeamsResponse> {
    return of(mockTeamsResponse);
  }

  getTeamMemberImage(name: string): Observable<ArrayBuffer> {
    return of(new ArrayBuffer(0));
  }
}
