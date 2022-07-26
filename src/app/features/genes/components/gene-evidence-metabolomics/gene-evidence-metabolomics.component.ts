import { Component, Input } from '@angular/core';

import { Gene } from '../../../../models';
import { HelperService } from '../../../../core/services';

@Component({
  selector: 'gene-evidence-metabolomics',
  templateUrl: './gene-evidence-metabolomics.component.html',
  styleUrls: ['./gene-evidence-metabolomics.component.scss'],
})
export class GeneEvidenceMetabolomicsComponent {
  _gene: Gene | undefined;
  get gene(): Gene | undefined {
    return this._gene;
  }
  @Input() set gene(gene: Gene | undefined) {
    this._gene = gene;
    this.init();
  }

  boxPlotData: any = [];

  constructor(private helperService: HelperService) {}

  reset() {
    this.boxPlotData = [];
  }

  init() {
    this.reset();

    if (!this._gene?.metabolomics?.transposed_boxplot_stats) {
      this.boxPlotData = [];
      return;
    }

    const boxPlotData: any = [];

    this._gene.metabolomics.transposed_boxplot_stats.forEach(
      (item: string, index: number) => {
        boxPlotData.push({
          key: this._gene?.metabolomics.boxplot_group_names[index],
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
