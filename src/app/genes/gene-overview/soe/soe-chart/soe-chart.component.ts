import { Component, Input, OnInit, ViewEncapsulation } from '@angular/core';
import { DistributionData } from 'app/models';
import { format } from 'd3-format';

export interface SOEChartProps {
  title: string;
  distributionData: DistributionData;
  geneScore: number;
  wikiInfo: {
    ownerId: string;
    wikiId: string;
  };
}

export interface ChartData {
  data: Plotly.Data[];
  layout?: Plotly.Layout;
  config?: Plotly.Config;
  ownerId?: string;
  wikiId?: string;
}

@Component({
  selector: 'soechart',
  templateUrl: './soe-chart.component.html',
  styleUrls: ['./soe-chart.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class SOEChartComponent implements OnInit {
  @Input() title: string;
  @Input() distributionData: DistributionData;
  @Input() geneScore: number | undefined;
  @Input() wikiInfo: SOEChartProps['wikiInfo'];

  showModal: boolean = false;
  chartData: ChartData;
  commonBarSettings: any = {
    config: {
      displayModeBar: false,
    },
    layout: {
      autosize: true,
      height: 400,
      width: 350,
      // The title is not rendered in the plot area, so we adjust the margin to remove the space for the title
      margin: {
        l: 50,
        r: 10,
        b: 40,
        t: 10,
        pad: 4,
      },
      xaxis: {
        title: 'GENE SCORE',
        titlefont: {
          size: 12,
        },
      },
      yaxis: {
        title: 'NUMBER OF GENES',
        titlefont: {
          size: 12,
        },
        tickformat: '.1s',
      },
      plot_bgcolor: 'rgba(236, 236, 236, 0.25)',
      hovermode: 'x', // note: axistext (tooltip that is applied on the axis) is hidden via CSS
      hoverlabel: {
        bgcolor: '#000', // opacity is set in CSS,
        font: {
          color: 'white',
        },
      },
    },
  };

  onHideModal = () => {
    this.showModal = false;
  }

  ngOnInit() {
    this.chartData = this.initChartData();
  }

  initChartData(): ChartData {
    const annotationTextColor = 'rgba(166, 132, 238, 1)';
    if (this.distributionData && this.geneScore) {
      const barColors = this.distributionData.distribution.map(
        (item) => 'rgba(166, 132, 238, 0.25)'
      );
      let annotations = [];
      if (this.geneScore) {
        const annotationObj = this.getBarChartAnnotation();
        annotations = [
          {
            x: annotationObj.scoreX,
            y: annotationObj.scoreY,
            // We truncate the gene score instead of rounding,
            // because a rounded score may end up conflicting with the displayed bin ranges
            // See comments on AG-260
            text: truncateToFixed(this.geneScore, 2),
            ax: 0,
            ay: -10,
            font: {
              color: annotationTextColor,
            },
          },
        ];
        barColors[annotationObj.binNumber] = annotationTextColor;
      }

      return {
        data: [
          {
            x: this.distributionData.bins.map((num) => parseFloat(num[0]).toFixed(2)),
            // We will set customdata to be the bin range, so we can show it in the tooltip.
            customdata: this.distributionData.bins.map((range, index) => {
              const lowerBound = parseFloat(range[0]);
              const upperBound = parseFloat(range[1]);

              // We use d3-format since plotly also uses it
              const formatter = format('.2f');

              // The last bin's upper bound is inclusive ']', rather than exclusive ')'.
              const isLastBin = index === this.distributionData.bins.length - 1;
              return `[${formatter(lowerBound)}, ${formatter(upperBound)}${isLastBin ? ']' : ')'}`;
            }),
            y: this.distributionData.distribution,
            hovertemplate:
              '<br>  Score Range: %{customdata}  <br>  Gene Count: %{y:.0f}<extra></extra>  <br>',
            type: 'bar',
            marker: {
              color: barColors,
            },
          },
        ] as Plotly.Data[],
        layout: {
          ...this.commonBarSettings.layout,
          ...{annotations: annotations},
          xaxis: {
            ...this.commonBarSettings.layout.xaxis,
            // AG-240: Label only 0 and the max whole number on the x-axis
            tick0: 0,
            dtick: Math.ceil(
              parseFloat(this.distributionData.bins[this.distributionData.bins.length - 1][1])
            ),
            range: [
              -0.1,
              Math.ceil(
                parseFloat(this.distributionData.bins[this.distributionData.bins.length - 1][1])
              ),
            ],
          },
        } as Plotly.Layout,
        config: this.commonBarSettings.config,
        ownerId: this.distributionData.syn_id,
        wikiId: this.distributionData.wiki_id,
      };
    } else {
      return {
        data: [],
      };
    }
  }

  getBarChartAnnotation() {
    let scoreX = null;
    let scoreY = null;
    let binNumber = null;
    const lastBarIndex = this.distributionData.bins.length - 1;

    // rawData[category].min and rawData[category].bin[0] don't have the same min values
    if (this.geneScore <= parseFloat(this.distributionData.bins[0][0])) {
      scoreX = parseFloat(this.distributionData.bins[0][0]);
      scoreY = this.distributionData.distribution[0];
      binNumber = 0;
    }

    if (this.geneScore > parseFloat(this.distributionData.bins[lastBarIndex][0])) {
      scoreX = this.distributionData.bins[lastBarIndex][0];
      scoreY = this.distributionData.distribution[this.distributionData.distribution.length - 1];
      binNumber = lastBarIndex;
    }

    if (!scoreX) {
      this.distributionData.bins.every((bin, i) => {
        if (this.geneScore > parseFloat(bin[1])) {
          return true;
        }
        scoreX = this.distributionData.bins[i][0];
        scoreY = this.distributionData.distribution[i];
        binNumber = i;
        return false;
      });
    }
    return {
      scoreX,
      scoreY,
      binNumber,
    };
  }

  onExpand() {
    this.showModal = true;
  }
}

/**
 * Truncates a number to a certain number of decimal places without rounding
 */
function truncateToFixed(num: number, fixed: number): string {
  /*
   * You might think that truncating a number to a certain number
   * of decimal places in JavaScript would be simple, but then you would be wrong.
   * See https://stackoverflow.com/a/11818658/9723359
   */
  const re = new RegExp('^-?\\d+(?:.\\d{0,' + (fixed || -1) + '})?');
  return num.toString().match(re)[0];
}
