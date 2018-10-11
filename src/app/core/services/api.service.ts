import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';

import {
    Gene,
    GeneInfo,
    GenesResponse,
    LinksListResponse,
    TeamMember,
    TeamInfo,
    GeneInfosResponse
} from '../../models';

import { LazyLoadEvent } from 'primeng/api';

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
        return this.http.get<LinksListResponse>(`/api/genelist/${sgene.ensembl_gene_id}`);
    }

    // Get all the genes
    getGenes(): Observable<GenesResponse> {
        const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
        const params = new HttpParams();

        // Get all the genes to render the charts
        return this.http.get<GenesResponse>('/api/genes', { headers, params });
    }

    getPageData(paramsObj?: LazyLoadEvent): Observable<object> {
        const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
        let params = new HttpParams();

        for (const key in paramsObj) {
            if (paramsObj.hasOwnProperty(key)) {
                params = params.append(key, paramsObj[key]);
            }
        }

        return this.http.get('/api/genes/page', { headers, params });
    }

    getTableData(): Observable<object> {
        const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
        const params = new HttpParams();

        return this.http.get('/api/genes/table', { headers, params });
    }

    getInfosMatchId(id: string): Observable<GeneInfosResponse> {
        const headers = new HttpHeaders({ 'Content-Type': 'application/json' });

        return this.http.get<GeneInfosResponse>('/api/gene/infos/' + id, { headers });
    }

    getInfosMatchIds(ids: string[]): Observable<GeneInfosResponse> {
        const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
        const params = new HttpParams().set(
            'ids', ids.map((e) => e).join(',')
        );
        return this.http.get<GeneInfosResponse>('/api/mgenes/infos', { headers, params });
    }

    getGene(id: string, tissue?: string, model?: string): Observable<object> {
        const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
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

    getTeams(info: GeneInfo): Observable<object> {
        const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
        const params = new HttpParams().set(
            'teams', info.nominatedtarget.map((e) => e.team).join(', ')
        );

        return this.http.get('/api/teams', { headers, params });
    }

    getAllTeams(): Observable<TeamInfo[]> {
        const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
        const params = new HttpParams();

        return this.http.get('/api/teams/all', { headers, params }) as Observable<TeamInfo[]>;
    }

    getTeamMemberImage(name: string): Observable<object> {
        const headers = new HttpHeaders({ 'Content-Type': 'image/jpg',
            'Accept': 'image/jpg',
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
        const headers = new HttpHeaders({ 'Content-Type': 'image/jpg',
            'Accept': 'image/jpg',
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

    getTissues(): Observable<any> {
        const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
        return this.http.get('/api/tissues', { headers });
    }

    getGeneTissues(): Observable<any> {
        const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
        return this.http.get('/api/tissues/gene', { headers });
    }

    getModels(): Observable<any> {
        const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
        return this.http.get('/api/models', { headers });
    }

    getGeneModels(): Observable<any> {
        const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
        return this.http.get('/api/models/gene', { headers });
    }
}
