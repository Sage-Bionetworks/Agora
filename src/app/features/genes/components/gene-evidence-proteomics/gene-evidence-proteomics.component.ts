import { Component, Input } from '@angular/core';

import { Gene } from '../../../../models';
import { GeneService } from '../../services';
import { HelperService } from '../../../../core/services';
import { ChartRange } from '../../../../models/ChartRange';

@Component({
  selector: 'gene-evidence-proteomics',
  templateUrl: './gene-evidence-proteomics.component.html',
  styleUrls: ['./gene-evidence-proteomics.component.scss'],
})
export class GeneEvidenceProteomicsComponent {
  _gene: Gene | undefined;
  get gene(): Gene | undefined {
    return this._gene;
  }
  @Input() set gene(gene: Gene | undefined) {
    this._gene = gene;
    this.init();
  }

  uniProtIds: string[] = [];
  selectedUniProtId = '';

  LFQData: any = undefined;
  LFQRange: ChartRange | undefined;

  SRMData: any = undefined;
  SRMRange: ChartRange | undefined;

  TMTData: any = undefined;
  TMTRange: ChartRange | undefined;

  constructor(
    private helperService: HelperService,
    private geneService: GeneService
  ) {}

  reset() {
    this.uniProtIds = [];
    this.selectedUniProtId = '';

    this.SRMData = undefined;
    this.SRMRange = undefined;

    this.LFQData = undefined;
    this.LFQRange = undefined;

    this.TMTData = undefined;
    this.TMTRange = undefined;
  }

  init() {
    this.reset();

    if (!this._gene?.proteomics_LFQ && this._gene?.proteomics_TMT) {
      return;
    }

    this.uniProtIds = [];

    this._gene?.proteomics_LFQ?.forEach((item: any) => {
      if (!this.uniProtIds.includes(item.uniprotid)) {
        this.uniProtIds.push(item.uniprotid);
      }
    });

    this._gene?.proteomics_TMT?.forEach((item: any) => {
      if (!this.uniProtIds.includes(item.uniprotid)) {
        this.uniProtIds.push(item.uniprotid);
      }
    });

    this.uniProtIds.sort();
    if (!this.selectedUniProtId) {
      this.selectedUniProtId = this.uniProtIds[0];
    }

    this.initSRM();
    this.initLFQ();
    this.initTMT();
  }

  processDifferentialExpressionData(item: any, data: any, range: ChartRange, proteomicData: any) {
    const yAxisMin = item.log2_fc < data.min ? item.log2_fc : data.min;
    const yAxisMax = item.log2_fc > data.max ? item.log2_fc : data.max;

    if (yAxisMin < range.Min) {
      range.Min = yAxisMin;
    }

    if (yAxisMax > range.Max) {
      range.Max = yAxisMax;
    }

    proteomicData.push({
      key: data.tissue,
      value: [data.min, data.median, data.max],
      circle: {
        value: item.log2_fc,
        tooltip: this.getTooltipText(item)
      },
      quartiles:
        data.first_quartile > data.third_quartile
          ? [data.third_quartile, data.median, data.first_quartile]
          : [data.first_quartile, data.median, data.third_quartile],
    });
  }

  initSRM() {
    this.geneService.getDistribution().subscribe((data: any) => {
      const distribution = data.proteomics_SRM;
      const differentialExpression = this._gene?.proteomics_SRM || [];
      const proteomicData: any = [];

      differentialExpression.forEach((item: any) => {
        const data: any = distribution.find((d: any) => {
          return d.tissue === item.tissue;
        });

        if (data) {
          if (!this.SRMRange)
            this.SRMRange = new ChartRange(data.min, data.max);
          this.processDifferentialExpressionData(item, data, this.SRMRange, proteomicData);
        }
      });

      this.SRMData = proteomicData;
    });
  }

  initLFQ() {
    this.geneService.getDistribution().subscribe((data: any) => {
      const distribution = data.proteomics_LFQ;
      const differentialExpression =
        this._gene?.proteomics_LFQ?.filter((item: any) => {
          return item.uniprotid === this.selectedUniProtId;
        }) || [];
      const proteomicData: any = [];

      differentialExpression.forEach((item: any) => {
        const data: any = distribution.find((d: any) => {
          return d.tissue === item.tissue;
        });

        if (data) {
          if (!this.LFQRange)
            this.LFQRange = new ChartRange(data.min, data.max);
          this.processDifferentialExpressionData(item, data, this.LFQRange, proteomicData);
        }
      });

      this.LFQData = proteomicData;
    });
  }

  initTMT() {
    this.geneService.getDistribution().subscribe((data: any) => {
      const distribution = data.proteomics_TMT;
      const differentialExpression =
        this._gene?.proteomics_TMT?.filter((item: any) => {
          return item.uniprotid === this.selectedUniProtId;
        }) || [];
      const proteomicData: any = [];

      differentialExpression.forEach((item: any) => {
        const data: any = distribution.find((d: any) => {
          return d.tissue === item.tissue;
        });

        if (data) {
          if (!this.TMTRange)
            this.TMTRange = new ChartRange(data.min, data.max);
          this.processDifferentialExpressionData(item, data, this.TMTRange, proteomicData);
        }
      });

      this.TMTData = proteomicData;
    });
  }

  onProteinChange(event: any) {
    if (!this._gene?.proteomics_LFQ) {
      return;
    }
    this.selectedUniProtId = event.value;
    this.initLFQ();
    this.initTMT();
  }

  getTooltipText(item: any) {
    const tooltipText = `${ item.hgnc_symbol || item.ensembl_gene_id } is${ item.cor_pval <= 0.05 ? '' : ' not' } significantly differentially expressed in ${ item.tissue } with a log fold change value of ${ this.helperService.getSignificantFigures(item.log2_fc, 3) } and an adjusted p-value of ${ this.helperService.getSignificantFigures(item.cor_pval, 3) }.`;
    return tooltipText;
  }
}
