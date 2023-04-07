import { Component, Input, OnInit, ViewEncapsulation } from '@angular/core';

import {
  Gene,
  OverallScores,
  OverallScoresDistribution,
} from '../../../../models';
import { GeneService } from '../../services';

export interface SOEChartProps {
  title: string;
  distributionData: OverallScoresDistribution;
  geneScore: number;
  wikiInfo: {
    ownerId: string;
    wikiId: string;
  };
}

@Component({
  selector: 'gene-soe-charts',
  templateUrl: './gene-soe-charts.component.html',
  styleUrls: ['./gene-soe-charts.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class GeneSoeChartsComponent implements OnInit {
  _gene: Gene | undefined;
  get gene(): Gene | undefined {
    return this._gene;
  }
  @Input() set gene(gene: Gene | undefined) {
    this._gene = gene;
    this.init();
  }

  @Input() wikiId = '';
  charts: any[] = [];

  barPrimaryColor = '#8b8ad1';
  barAlternativeColor = '#42C7BB';

  constructor(private geneService: GeneService) {}

  ngOnInit() {}

  init() {
    this.geneService.getDistribution().subscribe((data: any) => {
      let overallScoreDistribution = data.overall_scores;

      overallScoreDistribution.sort((a: any, b: any) =>
        a.name > b.name ? 1 : -1
      );

      //remove literature score
      overallScoreDistribution = overallScoreDistribution.filter((item: any) => (item.name !== 'Literature Score'));

      this.charts = overallScoreDistribution.map((item: any) => {
        const distribution: any = [];

        item.bins.forEach((bin: string, i: number) => {
          distribution.push({
            key: parseFloat(bin[0]).toFixed(2),
            value: item.distribution[i],
            range: [parseFloat(bin[0]), parseFloat(bin[1])],
          });
        });

        return {
          name: item.name,
          barColor: this.getBarColor(item.name),
          score: this.getGeneOverallScores(item.name),
          ownerId: item.syn_id,
          wikiId: item.wiki_id,
          distribution,
        };
      });
    });
  }

  getBarColor(chartName: string) {
    if (chartName === 'Target Risk Score') {
      return this.barAlternativeColor;
    }
    return this.barPrimaryColor;
  }

  getGeneOverallScores(name: string) {
    const scores: OverallScores =
      this._gene?.overall_scores || ({} as OverallScores);

    if ('Genetic Risk Score' === name) {
      return scores['genetics_score'] || 0;
    } else if ('Multi-omic Risk Score' === name) {
      return scores['multi_omics_score'] || 0;
    } else if ('Literature Score' === name) {
      return scores['literature_score'] || 0;
    } else if ('Target Risk Score' === name) {
      return scores['target_risk_score'] || 0;
    }

    return 0;
  }
}
