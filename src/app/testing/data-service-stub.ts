import { Injectable } from '@angular/core';

import { mockGene1, mockGene2 } from './gene-mocks';

import { Observable, of } from 'rxjs';

@Injectable()
export class DataServiceStub {
    getGene(id?: string): Observable<object> {
        return of(mockGene1);
    }

    getTableData(): Observable<object> {
        return of([mockGene1, mockGene2]);
    }

    getGenesMatchId(id?: string): Observable<object> {
        return of([mockGene1]);
    }
}
