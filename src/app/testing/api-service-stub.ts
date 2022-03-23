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

    getComparisonData(): Observable<object> {
        const genes = [mockGene1];
        const _genes = {};

        for (const gene of genes) {
            if (!_genes.hasOwnProperty(gene.ensembl_gene_id)) {
                _genes[gene.ensembl_gene_id] = {
                    ensembl_gene_id : gene.ensembl_gene_id,
                    hgnc_symbol     : gene.hgnc_symbol,
                    tissues         : []
                }
            }

            _genes[gene.ensembl_gene_id].tissues.push({
                name        : gene.tissue,
                logfc       : gene.logfc,
                adj_p_val   : gene.adj_p_val,
                ci_l        : gene.ci_l,
                ci_r        : gene.ci_r,
            });
        }

        return of({ items: Object.values(_genes) });
    }

    getInfos(): Observable<object> {
        return of({ items: [mockInfo1], isEnsembl: false });
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
}
