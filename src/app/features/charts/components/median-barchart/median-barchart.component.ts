// -------------------------------------------------------------------------- //
// External
// -------------------------------------------------------------------------- //
import {
  AfterViewInit,
  Component,
  ElementRef,
  HostListener,
  Input,
  OnChanges,
  OnDestroy,
  SimpleChanges,
  ViewChild,
  ViewEncapsulation,
} from '@angular/core';
import * as d3 from 'd3';

// -------------------------------------------------------------------------- //
// Internal
// -------------------------------------------------------------------------- //
import { MedianExpression } from '../../../../models';
import { HelperService } from '../../../../core/services';

// -------------------------------------------------------------------------- //
// Component
// -------------------------------------------------------------------------- //
@Component({
  selector: 'median-barchart',
  templateUrl: './median-barchart.component.html',
  styleUrls: ['./median-barchart.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class MedianBarChartComponent implements OnChanges, AfterViewInit, OnDestroy
{
  private chartInitialized = false;
  private tooltipInitialized = false;
  private _data: MedianExpression[] = [];
  private chart!: d3.Selection<any, unknown, null, undefined>;
  private tooltip!: d3.Selection<any, unknown, null, undefined>;
  private MEANINGFUL_EXPRESSION_THRESHOLD = Math.log2(5);
  private maxValueY = -1;

  get data() {
    return this._data;
  }
  @Input() set data(data: MedianExpression[]) {
    this._data = data
      .filter((el) => el.medianlogcpm && el.medianlogcpm > 0)
      .sort((a, b) => a.tissue.localeCompare(b.tissue));
    this.maxValueY = Math.max(
      this.MEANINGFUL_EXPRESSION_THRESHOLD,
      d3.max(this._data, (d) => d.medianlogcpm) || 0
    );
  }

  @Input() xAxisLabel = '';
  @Input() yAxisLabel = 'LOG2 CPM';

  @ViewChild('chart') chartRef: ElementRef<SVGElement> = {} as ElementRef;
  @ViewChild('tooltip') tooltipRef: ElementRef<HTMLElement> = {} as ElementRef;

  dimension: any;
  group: any;

  constructor(private helperService: HelperService) {}

  ngOnChanges(changes: SimpleChanges): void {
    if (
      (changes._data && !changes._data.firstChange) ||
      (changes.xAxisLabel && !changes.xAxisLabel.firstChange) ||
      (changes.yAxisLabel && !changes.yAxisLabel.firstChange)
    ) {
      if (this._data.length === 0) {
        this.clearChart();
        this.hideChart();
      } else {
        this.clearChart();
        this.showChart();
        this.createChart();
      }
    }
  }

  ngAfterViewInit(): void {
    if (this._data.length === 0) this.hideChart();
    else this.createChart();
  }

  ngOnDestroy(): void {
    this.destroyChart();
  }

  clearChart() {
    const svg = d3.select(this.chartRef.nativeElement);
    svg.selectAll('*').remove();
  }

  hideChart() {
    const svg = d3.select(this.chartRef.nativeElement);
    svg.style('display', 'none');
  }

  showChart() {
    const svg = d3.select(this.chartRef.nativeElement);
    svg.style('display', 'block');
  }

  destroyChart() {
    if (this.chartInitialized) this.chart.remove();
    if (this.tooltipInitialized) this.tooltip.remove();
  }

  showTooltip(text: string, x: number, y: number): void {
    this.tooltip = d3
      .select(this.tooltipRef.nativeElement)
      .style('left', `${x}px`)
      .style('top', `${y}px`)
      .style('display', 'block')
      .html(text);
    this.tooltipInitialized = true;
  }

  hideTooltip() {
    if (this.tooltipInitialized) {
      this.tooltip.style('display', 'none');
    }
  }

  getBarCenterX(tissue: string, xScale: d3.ScaleBand<string>): number {
    return (xScale(tissue) || 0) + xScale.bandwidth() / 2;
  }

  // get the current width allotted to this chart or default
  getChartBoundingWidth(): number {
    return (
      d3.select(this.chartRef.nativeElement).node()?.getBoundingClientRect()
        .width || 500
    );
  }

  createChart() {
    if (this._data.length > 0) {
      const barColor = this.helperService.getColor('secondary');
      const width = this.getChartBoundingWidth();
      const height = 350;
      const margin = { top: 20, right: 20, bottom: 65, left: 65 };
      const innerWidth = width - margin.left - margin.right;
      const innerHeight = height - margin.top - margin.bottom;

      this.chart = d3
        .select(this.chartRef.nativeElement)
        .attr('width', width)
        .attr('height', height)
        .append('g')
        .attr('transform', `translate(${margin.left}, ${margin.top})`);

      // SCALES
      const xScale = d3
        .scaleBand()
        .domain(this._data.map((d) => d.tissue))
        .range([0, innerWidth])
        .padding(0.2);

      const yScale = d3
        .scaleLinear()
        .domain([0, this.maxValueY])
        .nice()
        .range([innerHeight, 0]);

      // BARS
      this.chart
        .selectAll('.medianbars')
        .data(this._data)
        .enter()
        .append('rect')
        .attr('class', 'medianbars')
        .attr('x', (d) => xScale(d.tissue) as number)
        .attr('y', (d) => yScale(d.medianlogcpm || 0))
        .attr('width', xScale.bandwidth())
        .attr('height', (d) => innerHeight - yScale(d.medianlogcpm || 0))
        .attr('fill', barColor);

      // SCORE LABELS
      this.chart
        .selectAll('.bar-labels')
        .data(this._data)
        .enter()
        .append('text')
        .attr('class', 'bar-labels')
        .attr('x', (d) => this.getBarCenterX(d.tissue, xScale))
        .attr('y', (d) => yScale(d.medianlogcpm || 0) - 5)
        .text((d) => this.helperService.roundNumber(d.medianlogcpm || 0, 2));

      // X-AXIS
      const xAxis = d3.axisBottom(xScale);
      this.chart
        .append('g')
        .attr('class', 'x-axis')
        .attr('transform', `translate(0, ${innerHeight})`)
        .call(xAxis.tickSizeOuter(0))
        .selectAll('.tick')
        .on('mouseenter', (_, tissue) => {
          const tooltipText = this.helperService.getGCTColumnTooltipText(
            tissue as string
          );
          this.showTooltip(
            tooltipText,
            this.getBarCenterX(tissue as string, xScale) + margin.left,
            height - margin.top
          );
        })
        .on('mouseleave', () => {
          this.hideTooltip();
        });

      // Y-AXIS
      const yAxis = d3.axisLeft(yScale);
      this.chart.append('g').attr('class', 'y-axis').call(yAxis);

      // X-AXIS LABEL
      this.chart
        .append('text')
        .attr('class', 'x-axis-label')
        .attr('x', innerWidth / 2)
        .attr('y', innerHeight + margin.bottom)
        .attr('text-anchor', 'middle')
        .text(this.xAxisLabel);

      // Y-AXIS LABEL
      this.chart
        .append('text')
        .attr('class', 'y-axis-label')
        .attr('x', -innerHeight / 2)
        .attr('y', -margin.left)
        .attr('dy', '1em')
        .attr('text-anchor', 'middle')
        .attr('transform', 'rotate(-90)')
        .text(this.yAxisLabel);

      // THRESHOLD LINE
      this.chart
        .append('line')
        .attr('class', 'meaningful-expression-threshold-line')
        .attr('x1', 0)
        .attr('x2', innerWidth)
        .attr('y1', yScale(this.MEANINGFUL_EXPRESSION_THRESHOLD))
        .attr('y2', yScale(this.MEANINGFUL_EXPRESSION_THRESHOLD))
        .attr('stroke', 'red');

      this.chartInitialized = true;
    }
  }

  @HostListener('window:resize', ['$event'])
  onResize() {
    this.clearChart();
    this.createChart();
  }
}
