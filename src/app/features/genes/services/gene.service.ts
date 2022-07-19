import { Injectable } from '@angular/core';
import { of, Observable } from 'rxjs';
import { map, tap, share, finalize } from 'rxjs/operators';

import {
  Gene,
  GeneNetwork,
  GeneNode,
  GeneLink,
  DistributionResponse,
} from '../../../models';
import { ApiService } from '../../../core/services';

@Injectable()
export class GeneService {
  genes: { [key: string]: Gene } = {};
  distribution: DistributionResponse | undefined = undefined;
  distributionObservable: Observable<DistributionResponse> | undefined;
  comparisonData: any = {};

  constructor(private apiService: ApiService) {}

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

  getNetwork(gene: Gene): GeneNetwork {
    const nodes: { [key: string]: GeneNode } = {};
    const links: { [key: string]: GeneLink } = {};
    const response: GeneNetwork = {
      origin: gene,
      nodes: [],
      links: [],
      maxEdges: 0,
    };

    gene?.links?.forEach((link: any) => {
      const a = link.geneA_ensembl_gene_id;
      const b = link.geneB_ensembl_gene_id;
      const key = a + b;
      const rKey = b + a;

      // Check if a reverse link already exists
      if (
        links[rKey] &&
        !links[rKey].brain_regions.includes(link.brainRegion)
      ) {
        links[rKey].brain_regions.push(link.brainRegion);
        return;
      }

      if (!links[key]) {
        links[key] = {
          source: a,
          target: b,
          source_hgnc_symbol: link?.geneA_external_gene_name,
          target_hgnc_symbol: link?.geneB_external_gene_name,
          brain_regions: [link.brainRegion],
          value: 0,
        };
      } else if (!links[key].brain_regions.includes(link.brainRegion)) {
        links[key].brain_regions.push(link.brainRegion);
      }
    });

    response.links = Object.values(links).sort((a: any, b: any) => {
      return a.brain_regions?.length - b.brain_regions?.length;
    });

    response.links.forEach((link: any) => {
      link.brain_regions.sort();
      link.value = link.brain_regions.length;

      ['source', 'target'].forEach((key: any) => {
        if (!nodes[link[key]]) {
          nodes[link[key]] = {
            id: link[key],
            ensembl_gene_id: link[key],
            hgnc_symbol: link[key + '_hgnc_symbol'],
            brain_regions: link.brain_regions,
            value: 0,
          };
        } else {
          link.brain_regions.forEach((brainRegion: any) => {
            if (!nodes[link[key]].brain_regions.includes(brainRegion)) {
              nodes[link[key]].brain_regions.push(brainRegion);
            }
          });
        }
      });
    });

    response.nodes = Object.values(nodes)
      .sort((a: any, b: any) => {
        return a.brain_regions?.length - b.brain_regions?.length;
      })
      .reverse();

    response.nodes.forEach((node: any, i: number) => {
      node.brain_regions.sort();
      node.value = node.brain_regions.length;
      if (node.value > response.maxEdges) {
        response.maxEdges = node.value;
      }

      // Insert current node to the beginning of the array
      if (node.ensembl_gene_id === gene.ensembl_gene_id) {
        const currentNode = node;
        response.nodes.splice(i, 1);
        response.nodes.unshift(currentNode);
      }
    });

    return response;
  }

  // ------------------------------------------------------------------------ //

  getDistribution(): Observable<DistributionResponse> {
    if (this.distribution) {
      return of(this.distribution);
    } else if (this.distributionObservable) {
      return this.distributionObservable;
    } else {
      this.distributionObservable = this.apiService.getDistribution().pipe(
        tap((data: any) => (this.distribution = data)),
        share(),
        finalize(() => (this.distributionObservable = undefined))
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
