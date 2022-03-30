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
    RnaDistribution
} from '../models';

import { forkJoin, of, Observable } from 'rxjs';

import * as crossfilter from 'crossfilter2';

@Injectable()
export class DataServiceStub {
    data: any;
    ndx: any;
    rnaDistributionData: any;

    loadData(gene: Gene): Observable<any[]> {
        return forkJoin([
            of(mockGenesResponse),
            of(mockLinksListResponse)
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

    getGeneEntries(): Gene[] {
        return [mockGene1, mockGene2];
    }

    getSignificantFigures(n: number, sig: number = 2) {
        return 0.011;
    }

    // Assuming the rows are already properly formatted
    exportToCsv(filename: string, rows: string[]) {
        //
    }

    setRnaDistributionData(data) {
        this.rnaDistributionData = data;
    }

    loadRnaDistributionData(data) {
        if (data) {
            this.setRnaDistributionData(data);
        }
    }

    getRnaDistributionData(): RnaDistribution[] {
        return this.rnaDistributionData;
    }
}
