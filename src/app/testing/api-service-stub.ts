import { Injectable } from '@angular/core';

import {
    mockGene1,
    mockGene2,
    mockGeneStatistics,
    mockDataLink1,
    mockDataLink2,
    mockInfo1,
    mockTeam1
} from '../testing';

import { Gene, LinksListResponse, GenesResponse, GeneInfosResponse, TeamMember } from '../models';

import { Observable, of, empty } from 'rxjs';

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

    getInfosMatchIds(ids: string[]): Observable<GeneInfosResponse> {
        return of({ items: [mockInfo1], isEnsembl: false });
    }

    getAllTeams(): Observable<object> {
        return of([mockTeam1]);
    }

    getTeamMemberImages(members: TeamMember[]): Observable<object[]> {
        return of([]);
    }

    refreshChart(filter: any, id: string): Observable<any> {
        return of({
            smGroup: {
                values: [],
                top: {}
            }
        });
    }
}
