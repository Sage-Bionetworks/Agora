import { Injectable } from '@angular/core';

import {
    mockGene1,
    mockGene2,
    mockNetwork1,
    mockGenesResponse,
    mockLinksListResponse,
    mockEvidenceData,
    mockRnaDistributionData
} from './gene-mocks';

import {
    Gene,
    GenesResponse,
    RnaDistribution
} from '../models';

import { forkJoin, of, Observable } from 'rxjs';

@Injectable()
export class DataServiceStub {
    data: any;
    ndx: any;
    evidenceData: Gene[];
    rnaDistributionData: RnaDistribution[];

    loadData(gene: Gene): Observable<any[]> {
        return forkJoin([
            of(mockGenesResponse),
            of(mockLinksListResponse),
            of(mockEvidenceData)
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

    setEvidenceData(data: any) {
        this.evidenceData = mockEvidenceData;
    }

    getEvidenceData(): Gene[] {
        return mockEvidenceData;
    }

    setRnaDistributionData(data) {
        this.rnaDistributionData = mockRnaDistributionData;
    }

    getRnaDistributionData(): RnaDistribution[] {
        return mockRnaDistributionData;
    }
}
