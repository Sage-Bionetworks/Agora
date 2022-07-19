import { Component, Input } from '@angular/core';

import {
  Gene,
  MedianExpression,
  RnaDifferentialExpression,
} from '../../../../models';
import { GeneService } from '../../services';
import { HelperService } from '../../../../core/services';

@Component({
  selector: 'gene-evidence-rna',
  templateUrl: './gene-evidence-rna.component.html',
  styleUrls: ['./gene-evidence-rna.component.scss'],
})
export class GeneEvidenceRnaComponent {
  _gene: Gene = {} as Gene;
  get gene(): Gene {
    return this._gene;
  }
  @Input() set gene(gene: Gene) {
    this._gene = gene;
    this.init();
  }

  statisticalModels: string[] = [];
  selectedStatisticalModel = '';

  medianExpression: MedianExpression[] = [];
  differentialExpression: RnaDifferentialExpression[] = [];

  differentialExpressionChartData: any | undefined;
  differentialExpressionYAxisMin: number | undefined;
  differentialExpressionYAxisMax: number | undefined;

  consistencyOfChangeChartData: any = null;

  constructor(
    private helperService: HelperService,
    private geneService: GeneService
  ) {}

  init() {
    if (!this._gene?.rna_differential_expression) {
      return;
    }

    this.statisticalModels = this.geneService.getStatisticalModels(this._gene);
    if (!this.selectedStatisticalModel) {
      this.selectedStatisticalModel = this.statisticalModels[0];
    }

    this.initMedianExpression();
    this.initDifferentialExpression();
    this.initConsistencyOfChange();
  }

  initMedianExpression() {
    if (!this._gene.medianexpression?.length) {
      this.medianExpression = [];
      return;
    }

    this.medianExpression = this._gene.medianexpression.filter(
      (d) => d.medianlogcpm && d.medianlogcpm > 0
    );
  }

  initDifferentialExpression() {
    if (!this._gene.rna_differential_expression?.length) {
      this.differentialExpression = [];
      return;
    }

    this.differentialExpression = this._gene.rna_differential_expression.filter(
      (g: any) => {
        return g.model === this.selectedStatisticalModel;
      }
    );

    this.geneService.getDistribution().subscribe((data: any) => {
      const distribution = data.rna_differential_expression.filter(
        (data: any) => {
          return data.model === this.selectedStatisticalModel;
        }
      );

      const differentialExpressionChartData: any = [];

      this.differentialExpression.forEach((item: any) => {
        const data: any = distribution.find((d: any) => {
          return d.tissue === item.tissue;
        });

        if (data) {
          const yAxisMin = item.logfc < data.min ? item.logfc : data.min;
          const yAxisMax = item.logfc > data.max ? item.logfc : data.max;

          if (
            this.differentialExpressionYAxisMin === undefined ||
            yAxisMin < this.differentialExpressionYAxisMin
          ) {
            this.differentialExpressionYAxisMin = yAxisMin;
          }

          if (
            this.differentialExpressionYAxisMax === undefined ||
            yAxisMax > this.differentialExpressionYAxisMax
          ) {
            this.differentialExpressionYAxisMax = yAxisMax;
          }

          differentialExpressionChartData.push({
            key: data.tissue,
            value: [data.min, data.median, data.max],
            circle: {
              value: item.logfc,
              tooltip:
                (item.hgnc_symbol || item.ensembl_gene_id) +
                ' is ' +
                (item.adj_p_val <= 0.05 ? ' ' : 'not ') +
                'significantly differentially expressed in ' +
                item.tissue +
                ' with a log fold change value of ' +
                this.helperService.getSignificantFigures(item.logfc, 3) +
                ' and an adjusted p-value of ' +
                this.helperService.getSignificantFigures(item.adj_p_val, 3) +
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

  initConsistencyOfChange() {
    this.consistencyOfChangeChartData = this.differentialExpression.map(
      (item: any) => {
        return {
          key: [item.tissue, item.ensembl_gene_id, item.model],
          value: {
            adj_p_val: item.adj_p_val,
            fc: item.fc,
            logfc: item.logfc,
          },
          tissue: item.tissue,
          ci_l: item.ci_l,
          ci_r: item.ci_r,
        };
      }
    );
  }

  onStatisticalModelChange(event: any) {
    if (!this._gene?.rna_differential_expression) {
      return;
    }
    this.selectedStatisticalModel = event.value;
    this.initDifferentialExpression();
    this.initConsistencyOfChange();
  }
}
