import { Injectable } from '@angular/core';
import { of, Observable } from 'rxjs';
import { map, tap } from 'rxjs/operators';

import { Gene } from '../../../models';
import { ApiService } from '../../../core/services';
import { GeneNetworkService } from '.';

@Injectable()
export class GeneService {
  genes: { [key: string]: Gene } = {};
  distribution: [] = [];
  distributionObservable: any = null;
  comparisonData: any = {};

  constructor(
    private apiService: ApiService,
    private geneNetworkService: GeneNetworkService
  ) {}

  // ------------------------------------------------------------------------ //

  getGene(id: string): Observable<Gene> {
    if (this.genes[id]) {
      return of(this.genes[id]);
    }

    return this.apiService.getGene(id).pipe(
      map((gene: Gene) => {
        return (this.genes[id] = gene);
      })
    );
  }

  // ------------------------------------------------------------------------ //

  getStatisticalModels(gene: Gene) {
    const models: string[] = [];

    gene.rna_differential_expression?.forEach((item: any) => {
      if (!models.includes(item.model)) {
        models.push(item.model);
      }
    });

    return models;
  }

  getNetwork(gene: Gene) {
    return this.geneNetworkService.build(gene);
  }

  filterNetwork(data: any, min: number) {
    return this.geneNetworkService.filterByEdges(data, min);
  }

  // ------------------------------------------------------------------------ //

  getDistribution(): Observable<any> {
    if (this.distribution.length > 0) {
      return of(this.distribution);
    } else if (this.distributionObservable) {
      return this.distributionObservable;
    } else {
      this.distributionObservable = this.apiService.getDistribution().pipe(
        tap((data: any) => {
          this.distribution = data;
        })
      );

      return this.distributionObservable;
    }
  }

  // ------------------------------------------------------------------------ //

  getComparisonGenes(category: string, subCategory: string) {
    const key = category + subCategory;
    if (this.comparisonData[key]) {
      return of(this.comparisonData[key]);
    } else {
      return this.apiService.getComparisonGenes(category, subCategory).pipe(
        tap((data: any) => {
          this.comparisonData[key] = data;
        })
      );
    }
  }
}
