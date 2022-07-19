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

  data: GeneNetwork | undefined;
  selectedGene: Gene | undefined;

  filters: number[] = [];
  selectedFilter = 1;

  constructor(private router: Router, private geneService: GeneService) {}

  ngOnInit() {}

  init() {
    if (!this._gene?.links) {
      return;
    }

    if (!this._gene.network) {
      this._gene.network = cloneDeep(this.geneService.getNetwork(this._gene));
    }

    this.data = this._gene.network;
    this.selectedGene = this._gene;

    this.filters = [...Array(this.data.maxEdges).keys()].map((n) => {
      return ++n;
    });
  }

  onNodeClick(node: GeneNode) {
    this.geneService.getGene(node.ensembl_gene_id).subscribe((gene: any) => {
      if (!gene.network) {
        gene.network = this.geneService.getNetwork(gene);
      }
      this.selectedGene = gene;
    });
  }

  navigateToSimilarGenes() {
    this.router.navigate(['/genes/' + this._gene.ensembl_gene_id + '/similar']);
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
}
