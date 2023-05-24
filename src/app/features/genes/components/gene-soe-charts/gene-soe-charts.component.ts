import { Component, Input, OnInit } from '@angular/core';

import {
  Distribution,
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
  styleUrls: ['./gene-soe-charts.component.scss']
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

  barPrimaryColor = '#8b8ad1';
  barAlternativeColor = '#42C7BB';

  scoreDistributions: OverallScoresDistribution[] = [];

  constructor(private geneService: GeneService) {}

  ngOnInit() {}

  sortScoreDistributions(distributions: OverallScoresDistribution[]) {
    distributions.sort((a: OverallScoresDistribution, b: OverallScoresDistribution) => {
      if (a.name === 'Target Risk Score') {
        return -1;
      } else if (b.name === 'Target Risk Score') {
        return 1;
      } else if (a.name === 'Genetic Risk Score') {
        return -1;
      } else if (b.name === 'Genetic Risk Score') {
        return 1;
      } else if (a.name === 'Multi-omic Risk Score') {
        return -1;
      } else if (b.name === 'Multi-omic Risk Score') {
        return 1;
      } else {
        return a.name.localeCompare(b.name);  // if there are more scores columns in the future, default to alphabetical
      }
    });
  }

  init() {
    this.geneService.getDistribution().subscribe((data: Distribution) => {
      this.scoreDistributions = data.overall_scores;
      this.sortScoreDistributions(this.scoreDistributions);
      // remove literature score
      this.scoreDistributions = this.scoreDistributions.filter((item: any) => (item.name !== 'Literature Score'));
      // sort charts so Target Risk Score appears first
      this.sortScoreCharts(this.scoreDistributions);
    });
  }

  sortScoreCharts(charts: OverallScoresDistribution[]) {
    // sort charts alphabetically on name property
    charts.sort((a, b) => {
      if (a.name === 'Target Risk Score') {
        return -1;
      } else if (b.name === 'Target Risk Score') {
        return 1;
      } else {
        return a.name.localeCompare(b.name);
      }
    });
  }

  getBarColor(chartName: string | undefined) {
    if (!chartName)
      return this.barPrimaryColor;
    if (chartName === 'Target Risk Score') {
      return this.barAlternativeColor;
    }
    return this.barPrimaryColor;
  }

  getGeneOverallScores(name: string) {
    const scores: OverallScores =
      this._gene?.overall_scores || ({} as OverallScores);

    if ('Genetic Risk Score' === name) {
      return scores['genetics_score'];
    } else if ('Multi-omic Risk Score' === name) {
      return scores['multi_omics_score'];
    } else if ('Literature Score' === name) {
      return scores['literature_score'];
    } else if ('Target Risk Score' === name) {
      return scores['target_risk_score'];
    }

    return 0;
  }
}
