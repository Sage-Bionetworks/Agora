import { Injectable } from '@angular/core';

import { mockGene1, mockGene2 } from './gene-mocks';
import { mockTeam1 } from './team-info-mocks';

import { Observable, of } from 'rxjs';

@Injectable()
export class ApiServiceStub {
    getGene(id?: string): Observable<object> {
        return of(mockGene1);
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
