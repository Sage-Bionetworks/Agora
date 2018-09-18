import { Injectable } from '@angular/core';

import { mockGene1, mockGene2, mockDataLink1, mockDataLink2 } from './gene-mocks';
import { mockTeam1 } from './team-info-mocks';

import { Gene, LinksListResponse, GenesResponse } from '../models';

import { Observable, of } from 'rxjs';

@Injectable()
export class ApiServiceStub {
    getLinksList(sgene?: Gene): Observable<LinksListResponse> {
        return of({ items: [mockDataLink1, mockDataLink2] });
    }

    getGene(id?: string): Observable<object> {
        return of(mockGene1);
    }

    getGenes(): Observable<GenesResponse> {
        return of({ items: [mockGene1], geneEntries: [mockGene1, mockGene2] });
    }

    getTableData(): Observable<object> {
        return of([mockGene1, mockGene2]);
    }

    getGenesMatchId(id?: string): Observable<object> {
        return of([mockGene1]);
    }

    getAllTeams(): Observable<object> {
        return of([mockTeam1]);
    }
}
