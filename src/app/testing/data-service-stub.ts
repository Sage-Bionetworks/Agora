import { Injectable } from '@angular/core';

import { mockGene1, mockGene2 } from './gene-mocks';

import { Observable } from 'rxjs/Observable';

@Injectable()
export class DataServiceStub {
    getGene(id?: string): Observable<object> {
        return Observable.of(mockGene1);
    }

    getTableData(): Observable<object> {
        return Observable.of([mockGene1, mockGene2]);
    }
}
