import { Component, Input } from '@angular/core';
import * as d3 from 'd3';

import { BaseChartComponent } from '../base-chart';
import { HelperService } from '../../../../core/services';
import { agoraBoxPlot } from './box-plot';

@Component({
  selector: 'box-plot',
  templateUrl: './box-plot.component.html',
  styleUrls: ['./box-plot.component.scss'],
})
export class BoxPlotComponent extends BaseChartComponent {
  _data: [] = [];
  get data(): [] {
    return this._data;
  }
  @Input() set data(data: []) {
    this._data = data;
    this.init();
  }

  @Input() xAxisLabel = '';
  @Input() yAxisLabel = 'LOG 2 FOLD CHANGE';
  @Input() rcBigRadius = 12.5;
  @Input() rcSmallRadius = 9;
  @Input() rcRadius = 12.5;

  @Input() yAxisMin: number | undefined;
  @Input() yAxisMax: number | undefined;

  override name = 'box-plot';
  dimension: any;
  group: any;
  min = 0;
  max = 0;

  constructor(private helperService: HelperService) {
    super();
  }

  override init() {
    if (!this._data?.length || !this.chartContainer?.nativeElement) {
      return;
    }

    this.initData();

    if (!this.chart) {
      this.initChart();
    } else {
      this.chart.redraw();
    }

    this.isInitialized = true;
  }

  initData() {
    const self = this;

    this.group = {
      all: () => {
        return self._data;
      },
      order: () => {},
      top: () => {},
    };

    this.dimension = {
      filter: () => {},
      filterAll: () => {},
    };
  }

  initChart() {
    const self = this;

    this.chart = agoraBoxPlot(this.chartContainer.nativeElement, null, {
      yAxisMin: this.yAxisMin,
      yAxisMax: this.yAxisMax,
    });

    this.chart.group(this.group).dimension(this.dimension);

    this.chart.elasticX(true);

    this.chart
      .elasticY(true)
      .yAxisLabel(this.yAxisLabel, 20)
      .yRangePadding(this.rcRadius * 1.5)
      .yAxis()
      .ticks(8);

    this.chart
      .renderTitle(false)
      .showOutliers(0)
      .dataWidthPortion(0.1)
      .dataOpacity(0)
      .colors('transparent')
      .tickFormat(() => '');

    this.chart.margins({
      left: 90,
      right: 0,
      bottom: 50,
      top: 10,
    });

    this.chart.on('renderlet', function () {
      self.renderCircles();
      self.addXAxisTooltips();
    });

    this.chart.filter = () => '';
    this.chart.render();
  }

  // updateCircleRadius() {
  //   if (window.innerWidth < 768) {
  //     this.rcRadius = this.rcSmallRadius;
  //   } else {
  //     this.rcRadius = this.rcBigRadius;
  //   }
  // }

  renderCircles() {
    const self = this;
    const tooltip = this.getTooltip(
      'value',
      'chart-value-tooltip box-plot-value-tooltip'
    );
    const lineCenter = this.chart.selectAll('line.center');
    const yDomainLength = Math.abs(
      this.chart.yAxisMax() - this.chart.yAxisMin()
    );
    const mult =
      (this.chartContainer.nativeElement.offsetHeight - 60) / yDomainLength;
    const circles = this.chart.selectAll('circle');

    if (!circles.empty()) {
      circles.remove();
    }

    this.chart
      .selectAll('g.box')
      .each(function (this: any, el: any, i: number) {
        if (!self.data[i]['circle']) {
          return;
        }

        const circle = d3.select(this).insert('circle', ':last-child');

        circle
          .attr('fill', '#F47E6C')
          .style('stroke-width', 0)
          .attr('r', self.rcRadius)
          .attr('opacity', 0)
          .style('transition', '.3s');

        circle
          .on('mouseover', function () {
            if (!self.data[i]['circle']['tooltip']) {
              return;
            }

            const offset = self.helperService.getOffset(this);

            tooltip
              .html(self.data[i]['circle']['tooltip'])
              .style('left', (offset?.left || 0) + 'px')
              .style('top', (offset?.top || 0) + 40 + 'px');

            self.showTooltip('value');
          })
          .on('mouseout', function () {
            self.hideTooltip('value');
          });
      });

    this.chart
      .selectAll('circle')
      .each(function (this: any, el: any, i: number) {
        if (!self.data[i]['circle']) {
          return;
        }

        const cy =
          Math.abs(
            self.chart.y().domain()[1] - self.data[i]['circle']['value']
          ) * mult;
        const fcy = isNaN(cy) ? 0.0 : cy;

        d3.select(this)
          .attr('cx', lineCenter.attr('x1'))
          .attr('cy', fcy)
          .attr('opacity', 1);
      });
  }

  override getXAxisTooltipText(text: string) {
    return this.helperService.getTissueTooltipText(text);
  }
}
