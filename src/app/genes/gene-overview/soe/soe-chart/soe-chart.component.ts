import { Component, Input, OnInit, ViewEncapsulation } from "@angular/core";
import { DistributionData } from "app/models";

export type SOEChartProps = {
    title: string,
    distributionData: DistributionData
    geneScore: number
    wikiInfo: {
        ownerId: string
        wikiId: string
    }
}

type ChartData = {
  data: Plotly.Data[];
  layout?: Plotly.Layout;
  config?: Plotly.Config;
  ownerId?: string;
  wikiId?: string;
};

@Component({
  selector: "soechart",
  templateUrl: "./soe-chart.component.html",
  styleUrls: ["./soe-chart.component.scss"],
  encapsulation: ViewEncapsulation.None,
})
export class SOEChartComponent implements OnInit {
  @Input() title: string;
  @Input() distributionData: DistributionData;
  @Input() geneScore: number | undefined;
  @Input() wikiInfo: SOEChartProps['wikiInfo'];

  private chartData: ChartData;

  ngOnInit() {
    this.chartData = this.initChartData();
  }

  initChartData(): ChartData {
    const annotationTextColor = "rgba(166, 132, 238, 1)";
    if (this.distributionData && this.geneScore) {
      const barColors = this.distributionData.distribution.map(
        (item) => "rgba(166, 132, 238, 0.25)"
      );
      let annotations = [];
      if (this.geneScore) {
        const annotationObj = this.getBarChartAnnotation();
        annotations = [
          {
            x: annotationObj.scoreX,
            y: annotationObj.scoreY,
            text: `${this.geneScore.toFixed(2)}`,
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
            x: this.distributionData.bins.map((num) =>
              parseFloat(num[0]).toFixed(2)
            ),
            customdata: this.distributionData.bins.map((num) =>
              parseFloat(num[1]).toFixed(2)
            ),
            y: this.distributionData.distribution,
            hovertemplate:
              "<br>  Score Range: [%{x:.2f}, %{customdata:.2f}]  <br>  Gene Count: %{y:.0f}<extra></extra>  <br>",
            type: "bar",
            marker: {
              color: barColors,
            },
          },
        ] as Plotly.Data[],
        layout: {
          ...this.commonBarSettings.layout,
          xaxis: {
            ...this.commonBarSettings.layout.xaxis,
            // AG-240: Label only 0 and the max whole number on the x-axis
            tick0: 0,
            dtick: Math.ceil(
              parseFloat(
                this.distributionData.bins[
                  this.distributionData.bins.length - 1
                ][1]
              )
            ),
            range: [
              -0.1,
              Math.ceil(
                parseFloat(
                  this.distributionData.bins[
                    this.distributionData.bins.length - 1
                  ][1]
                )
              ),
            ],
          },
          annotations: annotations,
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

    if (
      this.geneScore > parseFloat(this.distributionData.bins[lastBarIndex][0])
    ) {
      scoreX = this.distributionData.bins[lastBarIndex][0];
      scoreY =
        this.distributionData.distribution[
          this.distributionData.distribution.length - 1
        ];
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

  commonBarSettings: any = {
    config: {
      displayModeBar: false,
    },
    layout: {
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
        title: "GENE SCORE",
        titlefont: {
          size: 12,
        },
      },
      yaxis: {
        title: "NUMBER OF GENES",
        titlefont: {
          size: 12,
        },
        tickformat: ".1s",
      },
      plot_bgcolor: "rgba(236, 236, 236, 0.25)",
      hovermode: "closest",
      hoverlabel: {
        bgcolor: "#000", // opacity is set in CSS,
        font: {
          color: "white",
        },
      },
    },
  };
}
