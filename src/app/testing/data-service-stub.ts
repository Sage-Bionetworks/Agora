import { Injectable } from '@angular/core';

import { mockGene1, mockGene2, mockDataLink1, mockDataLink2 } from './gene-mocks';

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
}
