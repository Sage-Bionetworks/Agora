import { Injectable } from '@angular/core';

import {
    mockGene1,
    mockGene2,
    mockNetwork1,
    mockDataLink1,
    mockDataLink2,
    mockTissues,
    mockModels
} from './gene-mocks';

import { Gene, LinksListResponse, GenesResponse, GeneNetwork } from '../models';

import { forkJoin, of, Observable } from 'rxjs';

@Injectable()
export class DataServiceStub {
    data: any;

    loadData(gene: Gene): Observable<any[]> {
        return forkJoin([
            of([mockGene1, mockGene2]),
            of({ items: [mockDataLink1, mockDataLink2] }),
            of([mockTissues]),
            of([mockModels])
        ]);
    }

    loadNodes(sgene?: Gene): Promise<GeneNetwork> {
        return new Promise((resolve, reject) => {
            resolve(mockNetwork1);
        });
    }

    loadGenes(data: GenesResponse) {
        this.data = [mockGene1, mockGene2];
    }
}
