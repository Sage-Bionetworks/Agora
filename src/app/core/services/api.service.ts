import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';

import {
    Gene,
    GeneInfo,
    GenesResponse,
    GeneListResponse
} from '../../models';

import { LazyLoadEvent } from 'primeng/primeng';

import { Observable } from 'rxjs';

@Injectable()
export class ApiService {
    apiUrl: string = '/api/';

    constructor(
        private http: HttpClient
    ) {
        //
    }

    // Get a list of links related to a gene
    getGeneList(sgene: Gene): Observable<GeneListResponse> {
        return this.http.get<GeneListResponse>(`/api/genelist/${sgene.ensembl_gene_id}`);
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

    getGenesMatchId(id: string): Observable<object> {
        const headers = new HttpHeaders({ 'Content-Type': 'application/json' });

        return this.http.get('/api/genes/' + id, { headers });
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

    getAllTeams(): Observable<object> {
        const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
        const params = new HttpParams();

        return this.http.get('/api/teams/all', { headers, params });
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
}
