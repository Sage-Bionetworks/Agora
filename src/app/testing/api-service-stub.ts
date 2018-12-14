import { Injectable } from '@angular/core';

import {
    mockGene1,
    mockGene2,
    mockGeneStatistics,
    mockDataLink1,
    mockDataLink2,
    mockInfo1
} from './gene-mocks';
import { mockTeam1 } from './team-info-mocks';

import { Gene, LinksListResponse, GenesResponse, GeneInfosResponse } from '../models';

import { Observable, of } from 'rxjs';

@Injectable()
export class ApiServiceStub {
    getLinksList(sgene?: Gene): Observable<LinksListResponse> {
        return of({ items: [mockDataLink1, mockDataLink2] });
    }

    getGene(id?: string): Observable<object> {
        return of(mockGene1);
    }

    getGenes(id: string): Observable<GenesResponse> {
        return of({
            items: [mockGene1],
            geneEntries: [mockGene1, mockGene2],
            maxFC: mockGeneStatistics.maxFC,
            minFC: mockGeneStatistics.minFC,
            minLogFC: mockGeneStatistics.minLogFC,
            maxLogFC: mockGeneStatistics.maxLogFC,
            minAdjPValue: mockGeneStatistics.minAdjPValue,
            maxAdjPValue: mockGeneStatistics.maxAdjPValue,
            geneTissues: mockGeneStatistics.geneTissues,
            geneModels: mockGeneStatistics.geneModels
        });
    }

    getTableData(): Observable<object> {
        return of([mockGene1, mockGene2]);
    }

    getInfosMatchId(id?: string): Observable<GeneInfosResponse> {
        return of({ items: [mockInfo1], isEnsembl: false });
    }

    getAllTeams(): Observable<object> {
        return of([mockTeam1]);
    }
}
