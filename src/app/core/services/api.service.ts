// -------------------------------------------------------------------------- //
// External
// -------------------------------------------------------------------------- //
import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';

// -------------------------------------------------------------------------- //
// Models
// -------------------------------------------------------------------------- //
import {
  Gene,
  GCTGeneResponse,
  GenesResponse,
  DistributionResponse,
} from '../../models';

import { TeamsResponse } from '../../models';

// -------------------------------------------------------------------------- //
// Constants
// -------------------------------------------------------------------------- //
const defaultHeaders = {
  'Content-Type': 'application/json',
  'Cache-Control':
    'no-cache, no-store, must-revalidate, post-check=0, pre-check=0',
  Pragma: 'no-cache',
  Expires: '0',
};

// -------------------------------------------------------------------------- //
// Service
// -------------------------------------------------------------------------- //
@Injectable()
export class ApiService {
  constructor(private http: HttpClient) {}

  getGene(id: string): Observable<Gene> {
    return this.http.get<Gene>('/api/genes/' + id, {
      headers: new HttpHeaders(defaultHeaders),
    });
  }

  getGenes(ids: any = null): Observable<Gene[]> {
    return this.http.get<Gene[]>('/api/genes/', {
      headers: new HttpHeaders(defaultHeaders),
      params: new HttpParams().set('ids', ids),
    });
  }

  searchGene(id: string): Observable<GenesResponse> {
    return this.http.get<GenesResponse>('/api/genes/search', {
      headers: new HttpHeaders(defaultHeaders),
      params: new HttpParams().set('id', id),
    });
  }

  getComparisonGenes(
    category: string,
    subCategory: string
  ): Observable<GCTGeneResponse> {
    const params = new HttpParams()
      .set('category', category)
      .set('subCategory', subCategory);

    return this.http.get<GCTGeneResponse>('/api/genes/comparison', {
      headers: new HttpHeaders(defaultHeaders),
      params,
    });
  }

  getDistribution(): Observable<DistributionResponse> {
    return this.http.get<DistributionResponse>('/api/distribution', {
      headers: new HttpHeaders(defaultHeaders),
    });
  }

  getTeams(): Observable<TeamsResponse> {
    return this.http.get<TeamsResponse>('/api/teams', {
      headers: new HttpHeaders(defaultHeaders),
    });
  }

  getTeamMemberImage(name: string) {
    name = name.toLowerCase().replace(/[- ]/g, '-');
    return this.http.get('/api/team-member/' + name + '/image', {
      headers: new HttpHeaders({
        'Content-Type': 'image/jpg, image/png, image/jpeg',
        Accept: 'image/jpg, image/png, image/jpeg',
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET',
        'Access-Control-Allow-Headers': 'Content-Type',
      }),
      responseType: 'arraybuffer',
    });
  }

  getTableData(): Observable<Gene[]> {
    const headers = new HttpHeaders(defaultHeaders);
    const params = new HttpParams();

    return this.http.get<Gene[]>('/api/genes/table', {
      headers,
      params,
    });
  }
}
