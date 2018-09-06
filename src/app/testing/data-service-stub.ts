import { Injectable } from '@angular/core';

import { mockGene1, mockGene2, mockDataLink1, mockDataLink2 } from './gene-mocks';
import { mockTeam1 } from './team-info-mocks';

import { Observable, of } from 'rxjs';
import { Gene } from '../models';

@Injectable()
export class DataServiceStub {
    data: any;

    loadNodes(sgene?: Gene): Promise<any> {
        return new Promise((resolve, reject) => {
            resolve([mockDataLink1, mockDataLink2]);
        });
    }

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

    getAllTeams(): Observable<object> {
        return of([mockTeam1]);
    }
}
