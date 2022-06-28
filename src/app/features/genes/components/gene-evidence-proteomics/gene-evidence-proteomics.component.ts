import { Component, Input } from '@angular/core';

import { Gene } from '../../../../models';
import { GeneService } from '../../services';

@Component({
  selector: 'gene-evidence-proteomics',
  templateUrl: './gene-evidence-proteomics.component.html',
  styleUrls: ['./gene-evidence-proteomics.component.scss'],
})
export class GeneEvidenceProteomicsComponent {
  _gene: Gene = {} as Gene;
  get gene(): Gene {
    return this._gene;
  }
  @Input() set gene(gene: Gene) {
    this._gene = gene;
    this.init();
  }

  uniProtIds: string[] = [];
  selectedUniProtId = '';

  differentialExpressionChartData: any = null;

  constructor(private geneService: GeneService) {}

  init() {
    if (!this._gene?.protein_differential_expression) {
      return;
    }

    this.uniProtIds = [];

    this._gene.protein_differential_expression.forEach((item: any) => {
      if (!this.uniProtIds.includes(item.uniprotid)) {
        this.uniProtIds.push(item.uniprotid);
      }
    });

    this.uniProtIds.sort();
    if (!this.selectedUniProtId) {
      this.selectedUniProtId = this.uniProtIds[0];
    }

    this.initDifferentialExpression();
  }

  initDifferentialExpression() {
    this.geneService.getDistribution().subscribe((data: any) => {
      const distribution = data.proteomics;

      const differentialExpression =
        this._gene.protein_differential_expression?.filter((item: any) => {
          return item.uniprotid === this.selectedUniProtId;
        }) || [];

      const differentialExpressionChartData: any = [];

      differentialExpression.forEach((item: any) => {
        const data: any = distribution.find((d: any) => {
          return d.tissue === item.tissue;
        });

        if (data) {
          differentialExpressionChartData.push({
            key: data.tissue,
            value: [data.min, data.median, data.max],
            circle: {
              value: item.log2_fc,
              tooltip:
                (item.hgnc_symbol || item.ensembl_gene_id) +
                ' is ' +
                (item.cor_pval <= 0.05 ? ' ' : 'not ') +
                'significantly differentially expressed in ' +
                item.tissue +
                ' with a log fold change value of ' +
                item.log2_fc +
                ' and an adjusted p-value of ' +
                item.cor_pval +
                '.',
            },
            quartiles:
              data.first_quartile > data.third_quartile
                ? [data.third_quartile, data.median, data.first_quartile]
                : [data.first_quartile, data.median, data.third_quartile],
          });
        }
      });

      this.differentialExpressionChartData = differentialExpressionChartData;
    });
  }

  onProteinChange(event: any) {
    if (!this._gene?.protein_differential_expression) {
      return;
    }
    this.selectedUniProtId = event.value;
    this.initDifferentialExpression();
  }
}
