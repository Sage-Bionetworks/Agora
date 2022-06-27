import { Component, Input } from '@angular/core';

import { GeneInfo } from '../../models';
import { HelperService } from '../../../../core/services';

@Component({
  selector: 'gene-evidence-metabolomics',
  templateUrl: './gene-evidence-metabolomics.component.html',
  styleUrls: ['./gene-evidence-metabolomics.component.scss'],
})
export class GeneEvidenceMetabolomicsComponent {
  _gene: GeneInfo = {} as GeneInfo;
  get gene(): GeneInfo {
    return this._gene;
  }
  @Input() set gene(gene: GeneInfo) {
    this._gene = gene;
    this.init();
  }

  boxPlotData: any = [];

  constructor(private helperService: HelperService) {}

  init() {
    if (!this._gene?.metabolomics?.transposed_boxplot_stats) {
      return;
    }

    const boxPlotData: any = [];

    this._gene.metabolomics.transposed_boxplot_stats.forEach(
      (item: string, index: number) => {
        boxPlotData.push({
          key: this._gene.metabolomics.boxplot_group_names[index],
          value: item,
        });
      }
    );

    this.boxPlotData = boxPlotData;
  }

  getSignificantFigures(n: any, b: any) {
    return this.helperService.getSignificantFigures(n, b);
  }

  getSignificantText(pval: number): string {
    return pval <= 0.05 ? ' is ' : ' is not ';
  }
}
