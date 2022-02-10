import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';

import {
    Gene,
    GeneInfo,
    GenesResponse,
    LinksListResponse,
    TeamMember,
    TeamInfo,
    GeneInfosResponse,
    GeneScoreDistribution,
} from '../../models';

import { LazyLoadEvent, Message } from 'primeng/api';

import { Observable, empty, throwError, forkJoin } from 'rxjs';
import { catchError, share } from 'rxjs/operators';

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
        const headers = new HttpHeaders({
            'Content-Type': 'application/json',
            'Cache-Control':  'no-cache, no-store, must-revalidate, post-check=0, pre-check=0',
            'Pragma': 'no-cache',
            'Expires': '0'
        });

        return this.http.get<LinksListResponse>(`/api/genelist/${sgene.ensembl_gene_id}`,
            { headers });
    }

    // Get all the genes
    getGenes(id: string): Observable<GenesResponse> {
        const headers = new HttpHeaders({
            'Content-Type': 'application/json',
            'Cache-Control':  'no-cache, no-store, must-revalidate, post-check=0, pre-check=0',
            'Pragma': 'no-cache',
            'Expires': '0'
        });
        const params = new HttpParams().set(
            'id', id
        );

        // Get all the genes to render the charts
        return this.http.get<GenesResponse>('/api/genes', { headers, params });
    }

    getTableData(): Observable<GeneInfosResponse> {
        const headers = new HttpHeaders({
            'Content-Type': 'application/json',
            'Cache-Control':  'no-cache, no-store, must-revalidate, post-check=0, pre-check=0',
            'Pragma': 'no-cache',
            'Expires': '0'
        });
        const params = new HttpParams();

        return this.http.get<GeneInfosResponse>('/api/genes/table', { headers, params });
    }

    getInfosMatchId(id: string): Observable<GeneInfosResponse> {
        const headers = new HttpHeaders({
            'Content-Type': 'application/json',
            'Cache-Control':  'no-cache, no-store, must-revalidate, post-check=0, pre-check=0',
            'Pragma': 'no-cache',
            'Expires': '0'
        });

        return this.http.get<GeneInfosResponse>('/api/gene/infos/' + id, { headers });
    }

    getInfosMatchIds(ids: string[]): Observable<GeneInfosResponse> {
        const headers = new HttpHeaders({
            'Content-Type': 'application/json',
            'Cache-Control':  'no-cache, no-store, must-revalidate, post-check=0, pre-check=0',
            'Pragma': 'no-cache',
            'Expires': '0'
        });
        const params = new HttpParams().set(
            'ids', ids.map((e) => e).join(',')
        );
        return this.http.get<GeneInfosResponse>('/api/mgenes/infos', { headers, params });
    }

    getGene(id: string, tissue?: string, model?: string): Observable<object> {
        const headers = new HttpHeaders({
            'Content-Type': 'application/json',
            'Cache-Control':  'no-cache, no-store, must-revalidate, post-check=0, pre-check=0',
            'Pragma': 'no-cache',
            'Expires': '0'
        });
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
        const headers = new HttpHeaders({
            'Content-Type': 'application/json',
            'Cache-Control':  'no-cache, no-store, must-revalidate, post-check=0, pre-check=0',
            'Pragma': 'no-cache',
            'Expires': '0'
        });
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
        const headers = new HttpHeaders({
            'Content-Type': 'application/json',
            'Cache-Control':  'no-cache, no-store, must-revalidate, post-check=0, pre-check=0',
            'Pragma': 'no-cache',
            'Expires': '0'
        });
        const params = new HttpParams().set(
            'id', id
        );

        return this.http.get('/api/metabolomics', { headers, params });
    }

    refreshChartsData(filter: any, id: string, type: string = 'RNA'): Observable<any> {
        const headers = new HttpHeaders({
            'Content-Type': 'application/json',
            'Cache-Control':  'no-cache, no-store, must-revalidate, post-check=0, pre-check=0',
            'Pragma': 'no-cache',
            'Expires': '0'
        });

        const params = new HttpParams().set(
            'id', id
        );

        let baseUrl = '/api/refresh' + ((type === 'Proteomics') ? 'p' : '');
        baseUrl += ((filter) ? '?filter=' + JSON.stringify(filter) : '');

        return this.http.get(baseUrl, { headers, params });
    }
}
