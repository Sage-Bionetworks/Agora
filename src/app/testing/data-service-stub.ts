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

import * as crossfilter from 'crossfilter2';

@Injectable()
export class DataServiceStub {
    data: any;
    ndx: any;

    loadData(gene: Gene): Observable<any[]> {
        return forkJoin([
            of([mockGene1, mockGene2]),
            of({ items: [mockDataLink1, mockDataLink2] }),
            of([mockTissues]),
            of([mockModels])
        ]);
    }

    loadNodes(sgene?: Gene): Promise<any> {
        return new Promise((resolve, reject) => {
            resolve(mockNetwork1);
        });
    }

    loadSelectedNodes(sList: LinksListResponse, sNode: Gene) {
        //
    }

    loadGenes(data: GenesResponse) {
        this.data = [mockGene1, mockGene2];
    }

    // Charts crossfilter handling part
    getDimension(info: any, filterGene?: Gene, auxNdx?: boolean): crossfilter.Dimension<any, any> {
        return crossfilter([mockGene1, mockGene2]).dimension(() => '');
    }

    getGroup(info: any, auxDim?: any): crossfilter.Group<any, any, any> {
        return crossfilter([mockGene1, mockGene2]).dimension(() => '').group();
    }

    getGeneEntries(): Gene[] {
        return [mockGene1, mockGene2];
    }

    getSignificantValue(value: number, compare?: boolean): number {
        return 0.011;
    }

    getNdx(auxNdx?: boolean): any {
        return crossfilter([mockGene1, mockGene2]);
    }
}
