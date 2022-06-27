import { Component, Input } from '@angular/core';

import { GeneInfo } from '../../models';

interface SummaryProperty {
  title: string;
  description: string;
  link?: string;
  anchorText?: string;
}

interface Summary {
  property: SummaryProperty;
  state: boolean;
  isStateApplicable: boolean;
}

@Component({
  selector: 'gene-soe-list',
  templateUrl: './gene-soe-list.component.html',
  styleUrls: ['./gene-soe-list.component.scss'],
})
export class GeneSoeListComponent {
  _gene: GeneInfo = {} as GeneInfo;
  get gene(): GeneInfo {
    return this._gene;
  }
  @Input() set gene(gene: GeneInfo) {
    this._gene = gene;
    this.init();
  }
  summaries: Summary[] = [];

  constructor() {}

  init() {
    if (!this._gene.ensembl_gene_id) {
      return;
    }

    this.summaries = [
      {
        property: {
          title: 'Genetic Association with LOAD',
          description:
            'Indicates whether or not this gene shows significant genetic association with Late Onset AD (LOAD) based on the',
          link: 'https://doi.org/10.1038/s41588-019-0358-2',
          anchorText:
            'International Genomics of Alzheimer&quot;s Project (IGAP) genome-wide association study',
        },
        state: this._gene.isIGAP === undefined ? false : this._gene.isIGAP,
        isStateApplicable: true,
      },
      {
        property: {
          title: 'Brain eQTL',
          description:
            'Indicates whether or not this gene locus has a significant expression Quantitative Trait Locus (eQTL) based on an',
          link: 'https://www.nature.com/articles/s41597-020-00642-8',
          anchorText: 'AMP-AD consortium study',
        },
        state: this._gene.haseqtl === undefined ? false : this._gene.haseqtl,
        isStateApplicable: true,
      },
      {
        property: {
          title: 'RNA Expression Change in AD Brain',
          description:
            'Indicates whether or not this gene shows significant differential expression in at least one brain region based on AMP-AD consortium work. See &quot;EVIDENCE&quot; tab.',
        },
        state:
          this._gene.isAnyRNAChangedInADBrain === undefined
            ? false
            : this._gene.isAnyRNAChangedInADBrain,
        isStateApplicable: this._gene.rna_brain_change_studied,
      },
      {
        property: {
          title: 'Protein Expression Change in AD Brain',
          description:
            'Indicates whether or not this gene shows significant differential protein expression in at least one brain region based on AMP-AD consortium work. See &quot;EVIDENCE&quot; tab.',
        },
        state:
          this._gene.isAnyProteinChangedInADBrain === undefined
            ? false
            : this._gene.isAnyProteinChangedInADBrain,
        isStateApplicable: this._gene.protein_brain_change_studied,
      },
      {
        property: {
          title: 'Nominated Target',
          description:
            'Indicates whether or not this gene has been submitted as a nominated target to Agora.',
        },
        state:
          this._gene.nominations && this._gene.nominations > 0 ? true : false,
        isStateApplicable: true,
      },
    ];
  }

  // If the 'state' value can be modified by another boolean value, pass the modifying value as 'isStateApplicable'
  // Example: rna_brain_change_studied: false indicates that isAnyRNAChangedInADBrain is
  // undefined, so calling: getText(isAnyRNACHangedInADBrain, rna_brain_change_studied)
  // will return the desired 'No data' text, regardless of the isAnyRNAChangedInAdBrain value
  getStateText(summary: Summary): string {
    if (summary.isStateApplicable) {
      if (summary.state === true) {
        return 'True';
      } else if (summary.state === false) {
        return 'False';
      }
    }

    return 'No data';
  }

  getStateClass(summary: Summary): string {
    if (summary.state && summary.isStateApplicable) {
      return 'text-success';
    } else if (!summary.state && summary.isStateApplicable) {
      return 'text-danger';
    }
    return '';
  }
}
