import { Injectable } from '@angular/core';

import {
    mockGene1,
    mockGene2,
    mockDataLink1,
    mockDataLink2,
    mockInfo1,
    mockTeam1,
    mockTeam4,
    mockMetabolomics,
    mockExpValidation,
    mockGeneScoreDistribution
} from '../testing';

import {
    Gene,
    LinksListResponse,
    GenesResponse,
    GeneInfosResponse,
    TeamMember,
    GeneResponse,
    GeneInfo,
    GeneScoreDistribution
} from '../models';

import { Observable, of } from 'rxjs';
import { mockGenesResponse, mockTissues, mockModels, mockEvidenceDataResponse } from './gene-mocks';

@Injectable()
export class ApiServiceStub {
    getLinksList(sgene?: Gene): Observable<LinksListResponse> {
        return of({ items: [mockDataLink1, mockDataLink2] });
    }

    getGene(id?: string): Observable<object> {
        return of({
            item: mockGene1,
            info: mockInfo1,
            expValidation: mockExpValidation
        } as GeneResponse);
    }

    getGenes(id: string): Observable<GenesResponse> {
        return of(mockGenesResponse);
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

    getAllGeneScores(): Observable<object> {
        return of([mockGeneScoreDistribution]);
    }

    getTeams(teamNames?: string[]): Observable<object> {
        return of([mockTeam4]);
    }

    getAllTeams(): Observable<object> {
        return of([mockTeam1, mockTeam4]);
    }

    getTeamMemberImages(members: TeamMember[]): Observable<object[]> {
        return of([]);
    }

    refreshChartsData(filter: any, id: string): Observable<any> {
        return of({
            smGroup: {
                values: [],
                top: {}
            }
        });
    }

    getGeneMetabolomics(id: string): Observable<object> {
        return of(mockMetabolomics);
    }

    getEvidencenData(id: string): Observable<object> {
        return of(mockEvidenceDataResponse);
    }

    getComparisonData(): Observable<object> {
        return of({ items: [mockGene1] });
    }

    getInfos(): Observable<object> {
        return of({ items: [mockInfo1] });
    }
}
