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
  _gene: Gene = {} as Gene;
  get gene(): Gene {
    return this._gene;
  }
  @Input() set gene(gene: Gene) {
    this._gene = gene;
    this.init();
  }

  @Input() wikiId = '';
  charts: any[] = [];

  constructor(private geneService: GeneService) {}

  ngOnInit() {}

  init() {
    this.geneService.getDistribution().subscribe((data: any) => {
      const overallScoreDistribution = data.overall_scores;

      overallScoreDistribution.sort((a: any, b: any) =>
        a.name > b.name ? 1 : -1
      );

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
          score: this.getGeneOverallScores(item.name),
          ownerId: item.syn_id,
          wikiId: item.wiki_id,
          distribution,
        };
      });
    });
  }

  getGeneOverallScores(name: string) {
    const scores: OverallScores =
      this._gene.overall_scores || ({} as OverallScores);

    if ('Genetics Score' === name) {
      return scores['GeneticsScore'] || 0;
    } else if ('Genomics Score' === name) {
      return scores['OmicsScore'] || 0;
    } else if ('Literature Score' === name) {
      return scores['LiteratureScore'] || 0;
    } else if ('Overall Score' === name) {
      return scores['Logsdon'] || 0;
    }

    return 0;
  }
}
