import { Component, Input, OnInit, ViewEncapsulation } from '@angular/core';

import { GeneInfo, ScoreDistribution } from '../../models';
import { GeneService } from '../../services';

export interface SOEChartProps {
  title: string;
  distributionData: ScoreDistribution;
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
  _gene: GeneInfo = {} as GeneInfo;
  get gene(): GeneInfo {
    return this._gene;
  }
  @Input() set gene(gene: GeneInfo) {
    this._gene = gene;
    this.init();
  }

  @Input() wikiId = '';
  charts: any[] = [];

  constructor(private geneService: GeneService) {}

  ngOnInit() {}

  init() {
    this.geneService.getDistribution().subscribe((data: any) => {
      const scoreDistribution = data.score;

      scoreDistribution.sort((a: any, b: any) => (a.name > b.name ? 1 : -1));

      this.charts = scoreDistribution.map((item: any) => {
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
          score: this.getGeneOverallScore(item.name),
          wikiId: item.wiki_id,
          distribution,
        };
      });
    });
  }

  getGeneOverallScore(name: string) {
    if (this._gene.overall_scores) {
      let key = 'logsdon';

      if ('Genetics Score' === name) {
        key = 'geneticsscore';
      } else if ('Genomics Score' === name) {
        key = 'omicsscore';
      } else if ('Literature Score' === name) {
        key = 'literaturescore';
      }

      return this._gene.overall_scores[key];
    }

    return 0;
  }
}
