import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';

import {
    Gene,
    GenesResponse,
    LinksListResponse,
    TeamMember,
    TeamInfo,
    GeneInfosResponse,
    GeneScoreDistribution,
    RnaDistribution
} from '../../models';

import { Observable, empty, throwError, forkJoin } from 'rxjs';
import { catchError, share } from 'rxjs/operators';

const defaultHeaders = {
    'Content-Type': 'application/json',
    'Cache-Control':  'no-cache, no-store, must-revalidate, post-check=0, pre-check=0',
    'Pragma': 'no-cache',
    'Expires': '0'
};

@Injectable()
export class ApiService {
    apiUrl: string = '/api/';

    constructor(
        private http: HttpClient
    ) {
        //
    }

    // Get a list of links related to a gene
    getLinksList(sgene: Gene): Observable<LinksListResponse> {
        const headers = new HttpHeaders(defaultHeaders);

        return this.http.get<LinksListResponse>(`/api/genelist/${sgene.ensembl_gene_id}`,
            { headers });
    }

    // Get all the genes
    getGenes(id: string): Observable<GenesResponse> {
        const headers = new HttpHeaders(defaultHeaders);
        const params = new HttpParams().set(
            'id', id
        );

        // Get all the genes to render the charts
        return this.http.get<GenesResponse>('/api/genes', { headers, params });
    }

    getTableData(): Observable<GeneInfosResponse> {
        const headers = new HttpHeaders(defaultHeaders);
        const params = new HttpParams();

        return this.http.get<GeneInfosResponse>('/api/genes/table', { headers, params });
    }

    getComparisonData(options?: {}): Observable<GenesResponse> {
        const headers = new HttpHeaders(defaultHeaders);
        return this.http.get<GenesResponse>('/api/genes/comparison', { headers, params: options });
    }

    getInfos() {
        const headers = new HttpHeaders(defaultHeaders);
        return this.http.get<GeneInfosResponse>('/api/gene/infos', { headers });
    }

    getInfosMatchId(id: string): Observable<GeneInfosResponse> {
        const headers = new HttpHeaders(defaultHeaders);

        return this.http.get<GeneInfosResponse>('/api/gene/infos/' + id, { headers });
    }

    getInfosMatchIds(ids: string[]): Observable<GeneInfosResponse> {
        const headers = new HttpHeaders(defaultHeaders);
        const params = new HttpParams().set(
            'ids', ids.map((e) => e).join(',')
        );
        return this.http.get<GeneInfosResponse>('/api/mgenes/infos', { headers, params });
    }

    getGene(id: string, tissue?: string, model?: string): Observable<object> {
        const headers = new HttpHeaders(defaultHeaders);
        let params = new HttpParams().set(
            'id', id
        );
        if (tissue) {
            params = params.set(
                'tissue', tissue
            );
        }
        if (model) {
            params = params.set(
                'model', model
            );
        }

        return this.http.get('/api/gene/', { headers, params });
    }

    getAllGeneScores(): Observable<GeneScoreDistribution> {
        const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
        const params = new HttpParams();

        return this.http.get('/api/genescores', { headers, params }) as Observable<GeneScoreDistribution>;
    }

    getTeams(teamNames: string[]): Observable<object> {
        const headers = new HttpHeaders(defaultHeaders);
        const uniqTeams = Array.from(new Set(teamNames));
        const params = new HttpParams().set(
            'teams', uniqTeams.join(',')
        );

        return this.http.get('/api/teams', { headers, params });
    }

    getAllTeams(): Observable<TeamInfo[]> {
        const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
        const params = new HttpParams();

        return this.http.get('/api/teams/all', { headers, params }) as Observable<TeamInfo[]>;
    }

    getTeamMemberImage(name: string): Observable<object> {
        const headers = new HttpHeaders({ 'Content-Type': 'image/jpg, image/png, image/jpeg',
            'Accept': 'image/jpg, image/png, image/jpeg',
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Methods': 'GET,PUT,POST,DELETE',
            'Access-Control-Allow-Headers': 'Content-Type'
        });
        const params = new HttpParams().set(
            'name', name
        );

        return this.http.get('/api/team/image', { headers, params, responseType: 'arraybuffer' });
    }

    getTeamMemberImages(members: TeamMember[]): Observable<object[]> {
        const headers = new HttpHeaders({ 'Content-Type': 'image/jpg, image/png, image/jpeg',
            'Accept': 'image/jpg, image/png, image/jpeg',
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Methods': 'GET,PUT,POST,DELETE',
            'Access-Control-Allow-Headers': 'Content-Type'
        });

        return forkJoin(
            members.map((member, index) => {
                const params = new HttpParams().set(
                    'name', member.name
                );

                return this.http.get(
                    `/api/team/image`, {
                        headers,
                        params,
                        responseType: 'arraybuffer'
                    }
                ).pipe(
                    catchError((err) => {
                        console.log('Caught merge mapping error and rethrowing', err);
                        return throwError(err);
                    }),
                    catchError((err) => {
                        console.log('Caught rethrown error, providing fallback value');
                        return empty();
                    })
                ) as Observable<object>;
            })
        ).pipe(share());
    }

    getGeneMetabolomics(id: string): Observable<object> {
        const headers = new HttpHeaders(defaultHeaders);
        const params = new HttpParams().set(
            'id', id
        );

        return this.http.get('/api/metabolomics', { headers, params });
    }

    refreshChartsData(filter: any, id: string): Observable<any> {
        const headers = new HttpHeaders(defaultHeaders);
        const params = new HttpParams().set('id', id);
        const baseUrl = '/api/refreshp' + ((filter) ? '?filter=' + JSON.stringify(filter) : '');
        return this.http.get(baseUrl, { headers, params });
    }

    getEvidencenData(id: string): Observable<any> {
        const headers = new HttpHeaders(defaultHeaders);
        const params = new HttpParams().set('id', id);
        return this.http.get<any>('/api/evidence', { headers, params });
    }

    getRnaDistributionData(): Observable<RnaDistribution[]> {
        const headers = new HttpHeaders(defaultHeaders);
        // Get all the genes to render the charts
        return this.http.get<any>('/api/rnadistribution', { headers });
    }
}
