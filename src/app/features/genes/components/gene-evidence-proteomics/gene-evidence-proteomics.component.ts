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
  LFQYAxisMin: number | undefined;
  LFQYAxisMax: number | undefined;

  SRMData: any = undefined;
  SRMYAxisMin: number | undefined;
  SRMYAxisMax: number | undefined;

  TMTData: any = undefined;
  TMTYAxisMin: number | undefined;
  TMTYAxisMax: number | undefined;

  constructor(
    private helperService: HelperService,
    private geneService: GeneService
  ) {}

  reset() {
    this.uniProtIds = [];
    this.selectedUniProtId = '';

    this.LFQData = undefined;
    this.LFQYAxisMin = undefined;
    this.LFQYAxisMax = undefined;

    this.TMTData = undefined;
    this.TMTYAxisMin = undefined;
    this.TMTYAxisMax = undefined;
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

  processDifferentialExpressionData(item: any, data: any, dataYAxisMin: number | undefined, dataYAxisMax: number | undefined, proteomicData: any) {
    const yAxisMin = item.log2_fc < data.min ? item.log2_fc : data.min;
    const yAxisMax = item.log2_fc > data.max ? item.log2_fc : data.max;

    if (dataYAxisMin === undefined || yAxisMin < dataYAxisMin) {
      dataYAxisMin = yAxisMin;
    }

    if (dataYAxisMax == undefined || yAxisMax > dataYAxisMax) {
      dataYAxisMax = yAxisMax;
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

      const differentialExpression =
        this._gene?.proteomics_SRM?.filter((item: any) => {
          return item.uniprotid === this.selectedUniProtId;
        }) || [];

      const proteomicData: any = [];

      differentialExpression.forEach((item: any) => {
        const data: any = distribution.find((d: any) => {
          return d.tissue === item.tissue;
        });

        if (data) {
          this.processDifferentialExpressionData(item, data, this.SRMYAxisMin, this.SRMYAxisMax, proteomicData);
        }
      });

      if (this.SRMYAxisMin) {
        this.SRMYAxisMin -= 0.2;
      }

      if (this.SRMYAxisMax) {
        this.SRMYAxisMax += 0.2;
      }

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
          this.processDifferentialExpressionData(item, data, this.LFQYAxisMin, this.LFQYAxisMax, proteomicData);
        }
      });

      if (this.LFQYAxisMin) {
        this.LFQYAxisMin -= 0.2;
      }

      if (this.LFQYAxisMax) {
        this.LFQYAxisMax += 0.2;
      }

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
          this.processDifferentialExpressionData(item, data, this.TMTYAxisMin, this.TMTYAxisMax, proteomicData);
        }
      });

      if (this.TMTYAxisMin) {
        this.TMTYAxisMin -= 0.2;
      }

      if (this.TMTYAxisMax) {
        this.TMTYAxisMax += 0.2;
      }

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
