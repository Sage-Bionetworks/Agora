// -------------------------------------------------------------------------- //
// External
// -------------------------------------------------------------------------- //
import { Component, Input } from '@angular/core';
import * as d3 from 'd3';
import * as dc from 'dc';
import crossfilter from 'crossfilter2';

// -------------------------------------------------------------------------- //
// Internal
// -------------------------------------------------------------------------- //
import { BaseChartComponent } from '../base-chart';
import { HelperService } from '../../../../core/services';

// -------------------------------------------------------------------------- //
// Component
// -------------------------------------------------------------------------- //
@Component({
  selector: 'score-chart',
  templateUrl: './score-chart.component.html',
  styleUrls: ['./score-chart.component.scss'],
})
export class ScoreChartComponent extends BaseChartComponent {
  _score = 0;
  get score(): number {
    return this._score;
  }
  @Input() set score(score: number) {
    this._score = score;
    this.init();
  }

  @Input() distribution: any = [];
  @Input() xAxisLabel = 'Gene score';
  @Input() yAxisLabel = 'Number of genes';

  override name = 'score-chart';
  dimension: any;
  group: any;
  scoreIndex = 0;
  break: any = {};

  constructor(private helperService: HelperService) {
    super();
  }

  override init() {
    if (
      !this._score ||
      !this.distribution?.length ||
      !this.chartContainer?.nativeElement
    ) {
      return;
    }

    this.initData();
    this.initChart();

    this.chart.render();

    this.isInitialized = true;
  }

  initData() {
    this.distribution.forEach((item: any, i: number) => {
      if (this._score >= item.range[0] && this._score < item.range[1]) {
        this.scoreIndex = i;
      }

      // Introduce a y-axis break if this bar is huge relative to other bars
      const minDiff = this.getMinDiff(item.value, this.distribution);
      if (minDiff > 2000) {
        this.break = {
          index: i,
          upper: Math.floor(item.value / 1000) * 1000,
          lower: Math.ceil((item.value - minDiff) / 1000) * 1000 + 1000,
        };

        this.distribution[i].truncated =
          this.break.lower + (item.value - this.break.upper);
      }
    });

    const ndx = crossfilter(this.distribution);
    this.dimension = ndx.dimension((d: any) => d.key);
    this.group = this.dimension.group().reduceSum((d: any) => {
      return d.truncated || d.value;
    });
  }

  getMinDiff(count: number, distribution: any[]) {
    const min = Math.min(...distribution.map(d => count - d.value).filter(v => v > 0));
    return min === Infinity ? 0 : min;
  }

  initChart() {
    const max: any = d3.max(
      this.distribution.map((d: any) => d.truncated || d.value)
    );
    const yTickCount = Math.ceil(max / 1000);

    // Chart
    this.chart = dc
      .barChart(this.chartContainer.nativeElement)
      .dimension(this.dimension)
      .group(this.group)
      .brushOn(false);

    // X axis
    this.chart
      .x(d3.scaleBand())
      .xAxisLabel(this.xAxisLabel)
      .xUnits(dc.units.ordinal)
      .xAxis()
      .ticks(2)
      .tickFormat(d3.format('d'));

    // Y axis
    this.chart
      .y(d3.scaleLinear().domain([0, this.group.top(1)[0].value]))
      .yAxisLabel(this.yAxisLabel)
      .yAxis()
      .ticks(yTickCount)
      .tickFormat((v: number) =>
        d3.format('.1s')(v == this.break?.lower ? this.break.upper : v)
      );

    // Colors
    this.chart.colors(['#8b8ad1']);

    // Spacing
    this.chart
      .margins({
        left: 50,
        right: 0,
        bottom: 50,
        top: 0,
      })
      .barPadding(0.2);

    // Misc
    this.chart.renderTitle(false).renderHorizontalGridLines(true);

    // On render
    this.chart.on('renderlet', (chart: any) => {
      const bars = chart.selectAll('rect');

      bars.each((d: any, i: number, bars: any) => {
        const barBox = bars[i].getBBox();

        if (i == this.scoreIndex) {
          bars[i].classList.add('score-bar');
          const label = chart.select('g.chart-body').append('text');

          label
            .attr('class', 'score-label')
            .attr('x', barBox.x)
            .attr('y', barBox.y - 6)
            .style('color', 'rgb(166 132 238)')
            .text(this.helperService.truncateNumberToFixed(this._score, 2));

          const labelBox = label.node().getBBox();
          const widthDiff = labelBox.width - barBox.width;
          label.attr(
            'x',
            barBox.x - (widthDiff > 0 ? widthDiff : widthDiff * -1) / 2
          );
        }

        if (i == this.break.index) {
          const topLine = chart.select('.grid-line line:last-child').node();
          const bottomLine = topLine.previousSibling;
          const topY = topLine.getBBox().y;
          const bottomY = bottomLine.getBBox().y;
          const y = bottomY - ((topY - bottomY - 14) / 2) * -1;

          const breakContainer = chart
            .select('.chart-body')
            .append('g')
            .attr('class', 'chart-break')
            .style(
              'transform',
              `translate(${barBox.x - 4}px, ${y}px) skew(0, -15deg)`
            );

          breakContainer
            .append('rect')
            .attr('width', barBox.width + 8)
            .attr('height', 14)
            .attr('fill', '#8b8ad1');

          breakContainer
            .append('rect')
            .attr('width', barBox.width + 10)
            .attr('height', 10)
            .attr('x', -1)
            .attr('y', 2)
            .attr('fill', '#fff');
        }

        this.addTooltip(bars[i], i);
      });
    });

    this.chart.filter = () => '';
  }

  addTooltip(bar: HTMLElement, i: number) {
    const self = this;
    const tooltip = this.getTooltip('internal', 'score-chart-tooltip', true);
    const distribution: any = this.distribution[i];

    d3.select(bar)
      .on('mouseover', function () {
        const barBox = bar.getBoundingClientRect();
        const text =
          'Score Range: [' +
          parseFloat(distribution.range[0]).toFixed(2) +
          ', ' +
          parseFloat(distribution.range[1]).toFixed(2) +
          ']  <br>  Gene Count: ' +
          distribution.value;

        tooltip
          .html(text)
          .style('top', window.pageYOffset + barBox.top - 40 + 'px')
          .style('left', barBox.left + barBox.width - 20 + 'px');

        self.showTooltip('internal');
      })
      .on('mouseout', function () {
        self.hideTooltip('internal');
      });
  }
}
