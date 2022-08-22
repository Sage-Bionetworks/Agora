/* eslint-disable */

import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';

import { ApiService } from '../core/services';
import { GeneService } from '../features/genes/services';

import {
  Gene,
  GenesResponse,
  GCTGeneResponse,
  Distribution,
  TeamsResponse,
} from '../models';
import {
  geneMock1,
  geneMock2,
  gctGeneMock1,
  nominatedGeneMock1,
  teamsResponseMock,
  ApiServiceStub,
} from './';

@Injectable()
export class GeneServiceStub {
  geneService: GeneService;

  constructor() {
    this.geneService = new GeneService(new ApiServiceStub() as ApiService);
  }

  getGene(id: string): Observable<Gene> {
    return this.geneService.getGene(id);
  }

  getStatisticalModels(gene: Gene) {
    return this.geneService.getStatisticalModels(gene);
  }

  getDistribution(): Observable<Distribution> {
    return this.geneService.getDistribution();
  }
}
