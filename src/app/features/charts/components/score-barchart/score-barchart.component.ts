// -------------------------------------------------------------------------- //
// External
// -------------------------------------------------------------------------- //
import { AfterViewInit, Component, ElementRef, Input, OnChanges, ViewChild, ViewEncapsulation } from '@angular/core';
import * as d3 from 'd3';

// -------------------------------------------------------------------------- //
// Internal
// -------------------------------------------------------------------------- //
import { HelperService } from '../../../../core/services';
import { OverallScoresDistribution, ScoreData } from 'app/models';

// -------------------------------------------------------------------------- //
// Component
// -------------------------------------------------------------------------- //
@Component({
  selector: 'score-barchart',
  templateUrl: './score-barchart.component.html',
  styleUrls: ['./score-barchart.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class ScoreBarChartComponent implements AfterViewInit, OnChanges {
  _score: number | null = null;
  get score(): number | null {
    return this._score;
  }
  @Input() set score(score: number | null) {
    this._score = score;
  }

  @Input() barColor = '#8B8AD1';
  
  @Input() data: OverallScoresDistribution | undefined;
  @Input() xAxisLabel = 'Gene score';
  @Input() yAxisLabel = 'Number of genes';

  @ViewChild('chart') chartRef: ElementRef<SVGElement> = {} as ElementRef;

  @ViewChild('tooltip', { static: true }) tooltip: ElementRef<HTMLElement> = {} as ElementRef;

  initialized = false;
  chartData: ScoreData[] = [];
  scoreIndex = -1;
  
  tooltips: {
    [key: string]: d3.Selection<HTMLDivElement, unknown, HTMLElement, any>;
  } = {};

  tooltipId = '';

  d3index = d3.local();

  constructor(private helperService: HelperService) {
  }

  ngOnChanges(): void {
    if (this.initialized) {
      // if chart has already been initialized, this means the data has changed
      this.createChart();
    }
  }

  ngAfterViewInit(): void {
    if (!this.chartRef.nativeElement) {
      return;
    }

    if (!this.data)
      return;

    this.createChart();
  }

  initData() {
    if (!this.data)
      return;
      
    this.chartData = [];

    this.data.bins.forEach((item, index: number) => {
      if (!this._score)
        return;
      if (this._score >= item[0] && this._score < item[1]) {
        this.scoreIndex = index;
      }
    });
    this.data.distribution.forEach((item, index: number) => {
      this.chartData.push(
        {
          distribution: item,
          bins: this.data?.bins[index]
        } as ScoreData 
      );
    });
  }

  createChart() {
    this.initData();
    
    const width = 350;
    const height = 350;
    const margin = { top: 20, right: 20, bottom: 40, left: 60 };
    const innerWidth = width - margin.left - margin.right;
    const innerHeight = height - margin.top - margin.bottom;

    if (this.chartData) {
      // clear the existing chart as the data may have changed due to a new overlaypanel being displayed
      d3.select(this.chartRef.nativeElement).selectAll('*').remove();

      const svg = d3.select(this.chartRef.nativeElement)
        .attr('width', width)
        .attr('height', height)
        .append('g')
        .attr('transform', `translate(${margin.left}, ${margin.top})`);

      const xScale = d3.scaleBand()
        .domain(this.chartData.map(d => d.bins[0].toString()))
        .range([0, innerWidth])
        .padding(0.2);

      const yScale = d3.scaleLinear()
        .domain([0, d3.max(this.chartData, d => d.distribution) as number])
        .range([innerHeight, 0]);

      // negative space above bar
      svg
        .selectAll('.negative-bars')
        .data(this.chartData)
        .enter().append('rect')
        .attr('class', 'negative-bars')
        .attr('x', d => xScale(d.bins[0].toString()) as number)
        .attr('y', 0)
        .attr('width', xScale.bandwidth())
        .attr('height', d => yScale(d.distribution))
        .attr('fill', 'transparent')
        .on('mouseenter', (event, d) => {
          const index = svg.selectAll('.negative-bars').nodes().indexOf(event.target);
          const tooltipText = this.getToolTipText(d.bins[0] as number, d.bins[1] as number, d.distribution);
          const x = margin.left + (xScale(d.bins[0].toString()) as number) + xScale.bandwidth() / 2;
          const y = yScale(d.distribution) + margin.top;
          const bar = d3.select(bars.nodes()[index]);
          this.highlightBar(bar, index);
          this.showTooltip(tooltipText, x, y, index);
        })
        .on('mouseleave', (event) => {
          const index = svg.selectAll('.negative-bars').nodes().indexOf(event.target);
          const bar = d3.select(bars.nodes()[index]);
          this.unhighlightBar(bar, index);
          this.hideTooltip(event);
        });

      // BARS
      const bars = svg
        .selectAll('.scorebars')
        .data(this.chartData)
        .enter().append('rect')
        .attr('class', 'scorebars')
        .attr('x', d => xScale(d.bins[0].toString()) as number)
        .attr('y', d => yScale(d.distribution))
        .attr('width', xScale.bandwidth())
        .attr('height', d => innerHeight - yScale(d.distribution))
        .attr('fill', this.barColor)
        .style('fill-opacity', (_, index) => this.scoreIndex === index ? '100%' : '50%')
        .on('mouseenter', (event, d) => {
          const index = svg.selectAll('.scorebars').nodes().indexOf(event.target);
          const tooltipText = this.getToolTipText(d.bins[0] as number, d.bins[1] as number, d.distribution);
          const x = margin.left + (xScale(d.bins[0].toString()) as number) + xScale.bandwidth() / 2;
          const y = yScale(d.distribution) + margin.top;
          const bar = d3.select(bars.nodes()[index]);
          this.highlightBar(bar, index);
          this.showTooltip(tooltipText, x, y, index);
        })
        .on('mouseleave', (event) => {
          const index = svg.selectAll('.scorebars').nodes().indexOf(event.target);
          const bar = d3.select(bars.nodes()[index]);
          this.unhighlightBar(bar, index);
          this.hideTooltip(event);
        });

      // SCORE LABEL
      svg
        .attr('class', 'bar-labels')
        .selectAll('.bar-labels')
        .data(this.chartData)
        .enter()
        .append('text')
        .attr('x', d => xScale(d.bins[0].toString()) as number + xScale.bandwidth() / 2)
        .attr('y', d => yScale(d.distribution) - 5)
        .attr('fill', this.barColor)
        .attr('text-anchor', 'middle')
        .attr('font-size', '12px')
        .style('font-weight', (_, index) => this.scoreIndex === index ? 'bold' : 'normal')
        .text((_, index) => {
          // only show the score on the corresponding bar
          if (this.scoreIndex == index)
            return this.helperService.roundNumber(this.score as number, 2);
          return '';
        })
        .on('mouseenter', (_, d) => {
          const index = this.scoreIndex;
          const tooltipText = this.getToolTipText(d.bins[0] as number, d.bins[1] as number, d.distribution);
          const x = margin.left + (xScale(d.bins[0].toString()) as number) + xScale.bandwidth() / 2;
          const y = yScale(d.distribution) + margin.top;
          const bar = d3.select(bars.nodes()[index]);
          this.highlightBar(bar, index);
          this.showTooltip(tooltipText, x, y, index);
        })
        .on('mouseleave', (event) => {
          const index = this.scoreIndex;
          const bar = d3.select(bars.nodes()[index]);
          this.unhighlightBar(bar, index);
          this.hideTooltip(event);
        });

      // x-axis
      const xAxis = d3.axisBottom(xScale);
      svg.append('g')
        .attr('class', 'x-axis')
        .attr('transform', `translate(0, ${ innerHeight })`)
        .call(xAxis);

      // y-axis
      const yAxis = d3.axisLeft(yScale);
      svg.append('g')
        .attr('class', 'y-axis')
        .call(yAxis);

      // x-axis label
      svg.append('text')
        .attr('class', 'x-axis-label')
        .attr('x', innerWidth / 2)
        .attr('y', innerHeight + margin.bottom)
        .attr('text-anchor', 'middle')
        .text('GENE SCORE');

      // y-axis label
      svg.append('text')
        .attr('class', 'y-axis-label')
        .attr('x', -innerHeight / 2)
        .attr('y', -margin.left)
        .attr('dy', '1em')
        .attr('text-anchor', 'middle')
        .attr('transform', 'rotate(-90)')
        .text('NUMBER OF GENES');

      this.initialized = true;
    }
  }

  highlightBar(bar: d3.Selection<SVGRectElement, unknown, null, undefined>, index: number) {
    if (index === this.scoreIndex) {
      // when user mouses over score bar, change the opacity so it is clear they have moused over
      bar.style('fill-opacity', '80%');
    } else {
      bar.style('fill-opacity', '100%');
    }
  }

  unhighlightBar(bar: d3.Selection<SVGRectElement, unknown, null, undefined>, index: number) {
    if (index === this.scoreIndex) {
      // score bar should be 100% on mouseout
      bar.style('fill-opacity', '100%');
    } else {
      // non-score bars should be 50%
      bar.style('fill-opacity', '50%');
    }
  }

  getToolTipText(scoreRangeStart: number, scoreRangeEnd: number, geneCount: number) {
    const leftBoundCharacter = this.scoreIndex == 0 ? '[' : '(';
    return `Score Range: ${ leftBoundCharacter } ${ scoreRangeStart }, ${ scoreRangeEnd }]
    <br>
    Gene Count: ${ geneCount }`;
  }

  showTooltip(text: string, x: number, y: number, index: number) {
    const tooltipElement = this.tooltip.nativeElement;
    tooltipElement.innerHTML = text;
    tooltipElement.style.left = `${x}px`;
    if (index === this.scoreIndex)
      y -= 14; // account for height of score
    tooltipElement.style.top = `${y}px`;
    tooltipElement.style.display = 'block';
  }

  hideTooltip(event: MouseEvent) {
    const tooltipElement = this.tooltip.nativeElement;
    // check whether mouse is over the tooltip otherwise there will be flicker
    if (tooltipElement && tooltipElement.contains(event.relatedTarget as Node)) {
      return;
    }

    if (tooltipElement.style.display === 'block')
      tooltipElement.style.display = 'none';
  }
}
