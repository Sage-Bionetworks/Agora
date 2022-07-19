import { Component, Input } from '@angular/core';

import { Gene } from '../../../../models';
import { GeneService } from '../../services';
import { HelperService } from '../../../../core/services';

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

  differentialExpressionChartData: any = undefined;
  differentialExpressionYAxisMin: number | undefined;
  differentialExpressionYAxisMax: number | undefined;

  constructor(
    private helperService: HelperService,
    private geneService: GeneService
  ) {}

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
          const yAxisMin = item.log2_fc < data.min ? item.log2_fc : data.min;
          const yAxisMax = item.log2_fc > data.max ? item.log2_fc : data.max;

          if (
            this.differentialExpressionYAxisMin == undefined ||
            yAxisMin < this.differentialExpressionYAxisMin
          ) {
            this.differentialExpressionYAxisMin = yAxisMin;
          }

          if (
            this.differentialExpressionYAxisMax == undefined ||
            yAxisMax > this.differentialExpressionYAxisMax
          ) {
            this.differentialExpressionYAxisMax = yAxisMax;
          }

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
                this.helperService.getSignificantFigures(item.log2_fc, 3) +
                ' and an adjusted p-value of ' +
                this.helperService.getSignificantFigures(item.cor_pval, 3) +
                '.',
            },
            quartiles:
              data.first_quartile > data.third_quartile
                ? [data.third_quartile, data.median, data.first_quartile]
                : [data.first_quartile, data.median, data.third_quartile],
          });
        }
      });

      if (this.differentialExpressionYAxisMin) {
        this.differentialExpressionYAxisMin -= 0.2;
      }

      if (this.differentialExpressionYAxisMax) {
        this.differentialExpressionYAxisMax += 0.2;
      }

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
