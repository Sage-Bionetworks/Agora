import { Component, OnInit, Input } from '@angular/core';
import { Router } from '@angular/router';
import { cloneDeep } from 'lodash';

import { Gene, GeneNetwork, GeneNode } from '../../../../models';
import { GeneService } from '../../services';

@Component({
  selector: 'gene-network',
  templateUrl: './gene-network.component.html',
  styleUrls: ['./gene-network.component.scss'],
})
export class GeneNetworkComponent implements OnInit {
  _gene: Gene = {} as Gene;
  get gene(): Gene {
    return this._gene;
  }
  @Input() set gene(gene: Gene) {
    this._gene = gene;
    this.init();
  }

  originalData: GeneNetwork = {} as GeneNetwork;
  filteredData: GeneNetwork = {} as GeneNetwork;
  selectedData: GeneNetwork = {} as GeneNetwork;

  filters: number[] = [];
  selectedFilter = 1;
  pathbox: GeneNode[] = [];

  constructor(private router: Router, private geneService: GeneService) {}

  ngOnInit() {}

  init() {
    if (!this._gene?.links) {
      return;
    }

    this.originalData = this.geneService.getNetwork(this._gene);
    this.filteredData = cloneDeep(this.originalData);
    this.selectedData = cloneDeep(this.originalData);
    this.setPathbox();
    this.filters = [...Array(this.filteredData.maxEdges).keys()].map((n) => {
      return ++n;
    });
  }

  setPathbox() {
    this.pathbox = cloneDeep(this.selectedData.nodes)
      .filter(
        (node: any) =>
          node.ensembl_gene_id !== this.selectedData.origin.ensembl_gene_id
      )
      .sort((a: any, b: any) => {
        if (a == null) {
          a = 0;
        }
        if (b == null) {
          b = 0;
        }
        if (a['brainregions'].length < b['brainregions'].length) {
          return 1;
        } else if (a['brainregions'].length > b['brainregions'].length) {
          return -1;
        } else {
          return 0;
        }
      });
  }

  filter(n: number) {
    this.selectedFilter = n;

    if (n > 1) {
      this.filteredData = this.geneService.filterNetwork(
        cloneDeep(this.originalData),
        n
      );
    } else {
      this.filteredData = this.geneService.getNetwork(this._gene);
    }
  }

  // If the 'state' value can be modified by another boolean value, pass the modifying value as 'isStateApplicable'
  // Example: rna_brain_change_studied: false indicates that isAnyRNAChangedInADBrain is
  // undefined, so calling:
  //     getText(isAnyRNACHangedInADBrain, rna_brain_change_studied)
  // will return the desired 'No data' text, regardless of the isAnyRNAChangedInAdBrain value
  getText(state?: boolean, isStateApplicable = true): string {
    let text = '';

    if (!isStateApplicable) {
      text = 'No data';
    } else {
      if (state) {
        text = 'True';
      } else {
        if (state === undefined) {
          text = 'No data';
        } else {
          text = 'False';
        }
      }
    }
    return text;
  }

  getNominationText(nominations: number): string {
    return this.getText(nominations === undefined ? false : nominations > 0);
  }

  // Use black text if 'isStateApplicable' is false ('No data')
  // Otherwise, use green text when 'state' is true, use red text when 'state' is false
  getTextColorClass(state: boolean, isStateApplicable = true): any {
    const colorClassObj = {} as any;
    if (state && isStateApplicable) {
      colorClassObj['text-success'] = true;
    } else if (!state && isStateApplicable) {
      colorClassObj['text-danger'] = true;
    }
    return colorClassObj;
  }

  onNodeClick(gene: any) {
    this.geneService.getGene(gene.ensembl_gene_id).subscribe((gene: any) => {
      this.selectedData = this.geneService.getNetwork(gene);
      this.setPathbox();
    });
  }

  onNavigate() {
    // console.log('onNavigate', path);
  }

  navigateToSimilarGenes() {
    this.router.navigate(['/genes/' + this._gene.ensembl_gene_id + '/similar']);
  }
}
