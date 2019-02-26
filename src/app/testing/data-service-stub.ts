import { Injectable } from '@angular/core';

import {
    mockGene1,
    mockGene2,
    mockNetwork1,
    mockDataLink1,
    mockDataLink2,
    mockTissues,
    mockModels,
    mockGeneStatistics,
    mockGenesResponse,
    mockLinksListResponse
} from './gene-mocks';

import {
    Gene,
    LinksListResponse,
    GenesResponse,
    GeneNetwork,
    GeneResponse,
} from '../models';

import { forkJoin, of, Observable } from 'rxjs';

import * as crossfilter from 'crossfilter2';

@Injectable()
export class DataServiceStub {
    data: any;
    ndx: any;

    loadData(gene: Gene): Observable<any[]> {
        return forkJoin([
            of(mockGenesResponse),
            of(mockLinksListResponse)
        ]);
    }

    loadTissuesModels(gene: Gene): Observable<any[]> {
        return forkJoin([
            of(mockTissues),
            of(mockModels)
        ]);
    }

    loadNodes(sgene?: Gene): Promise<any> {
        return new Promise((resolve, reject) => {
            resolve(mockNetwork1);
        });
    }

    loadGenes(data: GenesResponse) {
        this.data = [mockGene1, mockGene2];
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
}
