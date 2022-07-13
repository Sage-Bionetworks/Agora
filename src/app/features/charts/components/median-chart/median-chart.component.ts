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
import { MedianExpression } from '../../../../models';
import { HelperService } from '../../../../core/services';

// -------------------------------------------------------------------------- //
// Component
// -------------------------------------------------------------------------- //
@Component({
  selector: 'median-chart',
  templateUrl: './median-chart.component.html',
  styleUrls: ['./median-chart.component.scss'],
})
export class MedianChartComponent extends BaseChartComponent {
  _data: MedianExpression[] = [];
  get data() {
    return this._data;
  }
  @Input() set data(data) {
    this._data = data;
    this.init();
  }

  @Input() xAxisLabel = '';
  @Input() yAxisLabel = 'LOG2 CPM';

  dimension: any;
  group: any;

  constructor(private helperService: HelperService) {
    super();
  }

  override init() {
    if (!this._data?.length || !this.chartContainer.nativeElement) {
      return;
    }

    this.initData();
    this.initChart();

    this.isInitialized = true;
  }

  initData() {
    const ndx = crossfilter(this.data);
    this.dimension = ndx.dimension((d: any) => d.tissue);
    this.group = this.dimension
      .group()
      .reduceSum((d: any) =>
        this.helperService.getSignificantFigures(d.medianlogcpm)
      );
  }

  initChart() {
    const self = this;

    // Chart
    this.chart = dc
      .barChart(this.chartContainer.nativeElement)
      .dimension(this.dimension)
      .group(this.group)
      .brushOn(false);

    // X axis
    this.chart.x(d3.scaleBand()).xUnits(dc.units.ordinal);

    // Y axis
    this.chart
      .y(d3.scaleLinear().domain([0, this.group.top(1)[0]?.value || 0]))
      .yAxisLabel(this.yAxisLabel)
      .yAxis()
      .ticks(3);

    // Colors
    this.chart.colors(['#5171C0']);

    // Spacing
    this.chart
      .margins({
        left: 70,
        right: 0,
        bottom: 30,
        top: 50,
      })
      .barPadding(0.5);

    // Misc
    this.chart.renderLabel(true).turnOnControls(false).renderTitle(false);

    // On render
    this.chart.on('renderlet', (chart: any) => {
      if (chart) {
        const yDomainLength = Math.abs(
          chart.y().domain()[1] - chart.y().domain()[0]
        );
        chart.selectAll('rect').each((el: any, i: number, tree: any) => {
          if (el && el.y <= 0) {
            tree[i].setAttribute('height', 0);
          }
        });
        chart.selectAll('rect').attr('pointer-events', 'none');
        chart.selectAll('text').each((el: any, i: number, tree: any) => {
          if (el && el['data'] && el['data'].value < 0) {
            el['data'].value = '';
            el.y = '';
            tree[i].innerHTML = '';
          }
        });
        // const svgEl = (chart.selectAll('g.axis.y').node() as SVGGraphicsElement);
        const mult = chart.effectiveHeight() / yDomainLength;
        const lefty = 0;
        const righty = 0; // use real statistics here!
        const extradata = [
          { x: chart.x().range()[0], y: chart.y()(lefty) },
          { x: chart.x().range()[1], y: chart.y()(righty) },
        ];
        const line = d3
          .line()
          .x((d: any) => d.x)
          .y(() => Math.abs(chart.y().domain()[1] - Math.log2(5)) * mult);
        const chartBody = chart.select('g.chart-body');
        let path = chartBody.selectAll('path.extra').data([extradata]);
        path = path
          .enter()
          .append('path')
          .attr('class', 'extra')
          .attr('stroke', 'red')
          .attr('id', 'extra-line')
          .merge(path);
        path.attr('d', line);

        self.addXAxisTooltips();
      }
    });

    this.chart.filter = () => '';
    this.chart.render();
  }

  override getXAxisTooltipText(text: string) {
    return this.helperService.getTissueTooltipText(text);
  }
}
