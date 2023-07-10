import { Injectable } from '@angular/core';
import { of, Observable } from 'rxjs';
import { map, tap, share, finalize } from 'rxjs/operators';

import {
  Gene,
  SimilarGenesNetwork,
  SimilarGenesNetworkNode,
  SimilarGenesNetworkLink,
  Distribution,
  BioDomainInfo,
  BioDomain,
} from '../../../models';
import { ApiService } from '../../../core/services';

@Injectable()
export class GeneService {
  genes: { [key: string]: Gene } = {};
  distribution: Distribution | undefined = undefined;
  distributionObservable: Observable<Distribution> | undefined;
  comparisonData: any = {};

  biodomains: { [key: string]: BioDomain[] } = {};
  allBiodomains: BioDomainInfo[] = [];

  constructor(private apiService: ApiService) {}

  // ------------------------------------------------------------------------ //

  getGene(id: string): Observable<Gene> {
    if (this.genes[id]) {
      return of(this.genes[id]);
    }

    return this.apiService.getGene(id).pipe(
      map((gene: Gene) => {
        gene.similar_genes_network = this.getSimilarGenesNetwork(gene);
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

  getSimilarGenesNetwork(gene: Gene): SimilarGenesNetwork {
    const nodes: { [key: string]: SimilarGenesNetworkNode } = {};
    const links: { [key: string]: SimilarGenesNetworkLink } = {};
    const response: SimilarGenesNetwork = {
      nodes: [],
      links: [],
      min: 0,
      max: 0,
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

      ['source', 'target'].forEach((key: any) => {
        if (!nodes[link[key]]) {
          nodes[link[key]] = {
            ensembl_gene_id: link[key],
            hgnc_symbol: link[key + '_hgnc_symbol'],
            brain_regions: link.brain_regions,
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

      if (node.brain_regions.length < response.min) {
        response.min = node.brain_regions.length;
      }

      if (node.brain_regions.length > response.max) {
        response.max = node.brain_regions.length;
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

  getBiodomains(ensg: string): Observable<BioDomain[]> {
    if (this.biodomains[ensg]) {
      return of(this.biodomains[ensg]);
    }

    return this.apiService.getBiodomain(ensg).pipe(
      map((data: BioDomain[]) => {
        return (this.biodomains[ensg] = data);
      })
    );
  }

  // ------------------------------------------------------------------------ //

  getAllBiodomains(): Observable<BioDomainInfo[]> {
    if (this.allBiodomains.length > 0) {
      return of(this.allBiodomains);
    }

    return this.apiService.getBiodomains();
  }
  
  // ------------------------------------------------------------------------ //

  getDistribution(): Observable<Distribution> {
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
        tap((data) => {
          this.comparisonData[key] = data;
        })
      );
    }
  }
}
