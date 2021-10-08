import { Injectable } from '@angular/core';

import {
    mockGene1,
    mockGene2,
    mockDataLink1,
    mockDataLink2,
    mockInfo1,
    mockTeam1,
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
import { mockGenesResponse, mockTissues, mockModels } from './gene-mocks';

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

    getTeams(info?: GeneInfo): Observable<object> {
        return of([mockTeam1]);
    }

    getAllTeams(): Observable<object> {
        return of([mockTeam1]);
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

    getGeneTissues(): Observable<any> {
        return of(mockTissues);
    }

    getGeneModels(): Observable<any> {
        return of(mockModels);
    }

    getGeneMetabolomics(id: string): Observable<object> {
        return of(mockMetabolomics);
    }
}
