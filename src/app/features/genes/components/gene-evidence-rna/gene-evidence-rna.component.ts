import { Component, Input } from '@angular/core';

import { GeneInfo } from '../../models';
import { GeneService } from '../../services';

@Component({
  selector: 'gene-evidence-rna',
  templateUrl: './gene-evidence-rna.component.html',
  styleUrls: ['./gene-evidence-rna.component.scss'],
})
export class GeneEvidenceRnaComponent {
  _gene: GeneInfo = {} as GeneInfo;
  get gene(): GeneInfo {
    return this._gene;
  }
  @Input() set gene(gene: GeneInfo) {
    this._gene = gene;
    this.init();
  }

  statisticalModels: string[] = [];
  selectedStatisticalModel = '';
  differentialExpression: [] = [];
  differentialExpressionChartData: any = null;
  consistencyOfChangeChartData: any = null;

  constructor(private geneService: GeneService) {}

  init() {
    if (!this._gene?.rna_differential_expression) {
      return;
    }

    this.statisticalModels = this.geneService.getStatisticalModels(this._gene);
    if (!this.selectedStatisticalModel) {
      this.selectedStatisticalModel = this.statisticalModels[0];
    }

    this.initDifferentialExpression();
    this.initConsistencyOfChange();
  }

  initDifferentialExpression() {
    this.differentialExpression = this._gene.rna_differential_expression.filter(
      (g: any) => {
        return g.model === this.selectedStatisticalModel;
      }
    );

    this.geneService.getDistribution().subscribe((data: any) => {
      const distribution = data.rna.filter((data: any) => {
        return data.model === this.selectedStatisticalModel;
      });

      const differentialExpressionChartData: any = [];

      this.differentialExpression.forEach((item: any) => {
        const data: any = distribution.find((d: any) => {
          return d.tissue === item.tissue;
        });

        if (data) {
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
                item.logfc +
                ' and an adjusted p-value of ' +
                item.adj_p_val +
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
