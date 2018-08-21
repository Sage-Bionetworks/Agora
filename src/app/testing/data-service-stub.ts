import { Injectable } from '@angular/core';

import { mockGene1, mockGene2 } from './gene-mocks';

import { Observable, of } from 'rxjs';
import { EmptyObservable } from 'rxjs/observable/EmptyObservable';

@Injectable()
export class DataServiceStub {
    data: any;

    loadGenes(): Promise<boolean> {
        return new Promise((resolve, reject) => {
            this.data = [mockGene1, mockGene2];
            resolve(true);
        });
    }

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
